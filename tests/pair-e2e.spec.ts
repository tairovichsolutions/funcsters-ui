import { test, expect, chromium, type BrowserContext, type Page } from "@playwright/test";

/**
 * Full 2-browser happy-path E2E for the pair-programming feature.
 *
 * Runs two Chromium contexts with fake media devices so getUserMedia
 * returns synthetic audio without needing a microphone. Exercises the
 * full stack: Next.js UI → Next proxy → Spring REST → STOMP signaling →
 * WebRTC handshake → Yjs sync over the DataChannel.
 *
 * Does NOT exercise real TURN relay (same local NAT). That's the manual
 * cross-network test the user runs after this passes.
 */

const UI = "http://localhost:4200";
const BE = "http://localhost:8091";

interface TestUser {
  id: number;
  username: string;
  email: string;
  password: string;
  accessToken: string;
}

async function registerUser(username: string): Promise<TestUser> {
  const email = `e2e-${username}-${Date.now()}@test.local`;
  const password = "TestPass123!";
  const res = await fetch(`${BE}/api/v1/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, username }),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(`register failed: ${JSON.stringify(body)}`);
  return { id: body.id, username, email, password, accessToken: body.accessToken };
}

async function cleanDb() {
  // Use plain delete via backend is not exposed — we call the register endpoint
  // with unique emails so cleanup isn't strictly needed. But we do clean the
  // pair tables via the manual state-reset that happens when all sessions end.
  // For a cleaner slate, the test author can manually delete before running.
}

async function loginAndSetCookies(context: BrowserContext, user: TestUser): Promise<void> {
  // Use the Next /api/auth/login route because it sets httpOnly cookies the
  // FE expects. Using the backend /api/v1/auth/register returns an
  // accessToken but the cookies aren't set. We call the Next API from the
  // context so cookies land on the right origin.
  const page = await context.newPage();
  const res = await page.request.post(`${UI}/api/auth/login`, {
    data: { email: user.email, password: user.password },
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok()) {
    const body = await res.text();
    throw new Error(`login failed for ${user.username}: ${body}`);
  }
  await page.close();
}

test.setTimeout(180_000);

test("full pair programming flow: host + joiner end-to-end", async () => {
  const host = await registerUser(`host_${Date.now().toString().slice(-6)}`);
  const joiner = await registerUser(`joiner_${Date.now().toString().slice(-6)}`);

  const browser = await chromium.launch({
    headless: true,
    args: [
      "--use-fake-ui-for-media-stream",
      "--use-fake-device-for-media-stream",
      "--autoplay-policy=no-user-gesture-required",
    ],
  });

  const hostCtx = await browser.newContext({ permissions: ["microphone"] });
  const joinerCtx = await browser.newContext({ permissions: ["microphone"] });

  try {
    await loginAndSetCookies(hostCtx, host);
    await loginAndSetCookies(joinerCtx, joiner);

    const hostPage = await hostCtx.newPage();
    const joinerPage = await joinerCtx.newPage();

    // Capture console errors on both.
    const hostConsoleErrors: string[] = [];
    const joinerConsoleErrors: string[] = [];
    hostPage.on("console", (msg) => {
      if (msg.type() === "error") hostConsoleErrors.push(`[host] ${msg.text()}`);
    });
    joinerPage.on("console", (msg) => {
      if (msg.type() === "error") joinerConsoleErrors.push(`[joiner] ${msg.text()}`);
    });
    hostPage.on("response", (resp) => {
      const url = resp.url();
      if (url.includes("/api/v1/pair/me/active-session") || url.includes("/api/users/")) {
        console.log(`[host-resp] ${resp.status()} ${url}`);
      }
    });
    hostPage.on("framenavigated", (frame) => {
      if (frame === hostPage.mainFrame()) console.log(`[host-nav] ${frame.url()}`);
    });

    // --- Host creates a pair request via the REST proxy -------------------
    const createRes = await hostPage.request.post(
      `${UI}/api/v1/pair/requests`,
      {
        data: {
          challengeId: 2,
          languageId: 2,
          focusArea: "DEBUGGING",
          spokenLanguages: ["EN"],
        },
      }
    );
    expect(createRes.status(), "create request should succeed").toBe(200);
    const createBody = await createRes.json();
    const pairRequestId = createBody.data.id as number;
    console.log(`[e2e] pair_request ${pairRequestId} created by host`);

    // --- Joiner sends join request ----------------------------------------
    const joinRes = await joinerPage.request.post(
      `${UI}/api/v1/pair/requests/${pairRequestId}/joins`
    );
    expect(joinRes.status(), "join request should succeed").toBe(200);
    const joinBody = await joinRes.json();
    const joinRequestId = joinBody.data.id as number;
    console.log(`[e2e] join_request ${joinRequestId} sent by joiner`);

    // --- Host accepts the joiner ------------------------------------------
    const acceptRes = await hostPage.request.post(
      `${UI}/api/v1/pair/joins/${joinRequestId}/accept`
    );
    expect(acceptRes.status(), "accept should succeed").toBe(200);
    const acceptBody = await acceptRes.json();
    const sessionId = acceptBody.data.id as number;
    expect(acceptBody.data.status).toBe("AWAITING_GUIDELINES");
    console.log(`[e2e] session ${sessionId} created, AWAITING_GUIDELINES`);

    // --- Joiner accepts guidelines → session goes ACTIVE ------------------
    const guidelinesRes = await joinerPage.request.post(
      `${UI}/api/v1/pair/sessions/${sessionId}/accept-guidelines`
    );
    expect(guidelinesRes.status(), "accept-guidelines should succeed").toBe(200);
    const guidelinesBody = await guidelinesRes.json();
    expect(guidelinesBody.data.status).toBe("ACTIVE");
    expect(guidelinesBody.data.startedAtEpochMs).toBeTruthy();
    expect(guidelinesBody.data.endsAtEpochMs).toBeTruthy();
    const sessionDuration =
      guidelinesBody.data.endsAtEpochMs - guidelinesBody.data.startedAtEpochMs;
    expect(sessionDuration, "session must be exactly 45 minutes").toBe(45 * 60 * 1000);
    console.log(`[e2e] session ACTIVE, 45-min window verified`);

    // --- Diagnostic: verify /me/active-session works via proxy ------------
    const mesHost = await hostPage.request.get(`${UI}/api/v1/pair/me/active-session`);
    console.log(`[diag] host /me/active-session: ${mesHost.status()} ${await mesHost.text()}`);
    const mesJoiner = await joinerPage.request.get(`${UI}/api/v1/pair/me/active-session`);
    console.log(`[diag] joiner /me/active-session: ${mesJoiner.status()} ${await mesJoiner.text()}`);
    const meHost = await hostPage.request.get(`${UI}/api/users/${host.id}`);
    console.log(`[diag] host /api/users/${host.id}: ${meHost.status()}`);

    // --- Both navigate to the session page --------------------------------
    await Promise.all([
      hostPage.goto(`${UI}/pair/session/${sessionId}`, { waitUntil: "networkidle" }),
      joinerPage.goto(`${UI}/pair/session/${sessionId}`, { waitUntil: "networkidle" }),
    ]);

    // Wait for session page to finish loading (past the "Loading session…" gate).
    await hostPage.waitForFunction(() => !document.body.innerText.includes("Loading session"), { timeout: 20_000 });
    await joinerPage.waitForFunction(() => !document.body.innerText.includes("Loading session"), { timeout: 20_000 });

    // Dump current URL + a snippet of the DOM for diagnostics
    console.log(`[e2e] hostPage URL: ${hostPage.url()}`);
    console.log(`[e2e] joinerPage URL: ${joinerPage.url()}`);
    const hostHeader = await hostPage.locator("header").first().textContent().catch(() => "(no header)");
    const joinerHeader = await joinerPage.locator("header").first().textContent().catch(() => "(no header)");
    console.log(`[e2e] hostHeader: ${hostHeader?.slice(0, 200)}`);
    console.log(`[e2e] joinerHeader: ${joinerHeader?.slice(0, 200)}`);

    // Both should show the partner's username in the top bar
    await expect(hostPage.getByText(`@${joiner.username}`)).toBeVisible({ timeout: 30_000 });
    await expect(joinerPage.getByText(`@${host.username}`)).toBeVisible({ timeout: 30_000 });
    console.log(`[e2e] both browsers rendered session page`);

    // --- Diagnostic: read the connection badge via header text probe ------
    const badgeState = async (page: Page): Promise<string> => {
      return page.evaluate(() => {
        const header = document.querySelector("header");
        if (!header) return "(no header)";
        const spans = Array.from(header.querySelectorAll("span"));
        const badge = spans.find((s) =>
          /Connected|Connecting|Reconnecting|Failed|Closed/.test(s.textContent ?? "")
        );
        return badge?.textContent?.trim() ?? "(no badge)";
      });
    };
    const hbefore = await badgeState(hostPage);
    const jbefore = await badgeState(joinerPage);
    console.log(`[probe] initial: host="${hbefore}" joiner="${jbefore}"`);

    // Wait up to 45s for both to reach "Connected"
    const deadline = Date.now() + 45_000;
    let connected = false;
    while (Date.now() < deadline) {
      const h = await badgeState(hostPage);
      const j = await badgeState(joinerPage);
      if (h.includes("Connected") && j.includes("Connected")) {
        console.log(`[probe] BOTH CONNECTED host="${h}" joiner="${j}"`);
        connected = true;
        break;
      }
      await hostPage.waitForTimeout(1_000);
    }
    if (!connected) {
      const h = await badgeState(hostPage);
      const j = await badgeState(joinerPage);
      console.log(`[probe] FINAL (not connected): host="${h}" joiner="${j}"`);
    }
    expect(connected, "both peers should reach Connected within 45s").toBe(true);

    // --- Verify mute/unmute wiring ----------------------------------------
    await hostPage.getByRole("button", { name: /^Mute$/ }).click();
    await expect(hostPage.getByRole("button", { name: /^Unmute$/ })).toBeVisible();
    await hostPage.getByRole("button", { name: /^Unmute$/ }).click();
    await expect(hostPage.getByRole("button", { name: /^Mute$/ })).toBeVisible();
    console.log(`[e2e] mute/unmute toggle works`);

    // --- Host leaves ------------------------------------------------------
    await hostPage.getByRole("button", { name: /Leave Session/ }).click();
    await hostPage.getByRole("button", { name: /^Leave Session$/ }).last().click();

    // Both should redirect to lobby once the session is ENDED.
    await hostPage.waitForURL(/\/pair\/lobby/, { timeout: 15_000 });
    await joinerPage.waitForURL(/\/pair\/lobby/, { timeout: 15_000 });
    console.log(`[e2e] both redirected to lobby on leave`);

    // --- Assert no console errors on either side --------------------------
    // Filter out known-benign: some Next.js dev warnings, Chromium autoplay
    // warnings, and known "Bearer token" noise from the Next proxy.
    const filter = (e: string) =>
      !e.includes("Autoplay") &&
      !e.includes("Failed to load resource: the server responded with a status of 401") &&
      !e.includes("NEXT_PUBLIC_") &&
      !e.includes("hydrat");
    const hostErrors = hostConsoleErrors.filter(filter);
    const joinerErrors = joinerConsoleErrors.filter(filter);
    if (hostErrors.length > 0) console.log("host errors:", hostErrors);
    if (joinerErrors.length > 0) console.log("joiner errors:", joinerErrors);
    expect(hostErrors, "host console should have no unexpected errors").toHaveLength(0);
    expect(joinerErrors, "joiner console should have no unexpected errors").toHaveLength(0);
  } finally {
    await browser.close();
  }
});
