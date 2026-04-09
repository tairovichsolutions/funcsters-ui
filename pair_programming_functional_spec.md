# Functional Requirements: Pair Programming Experience

## 1. Feature Purpose
The Pair Programming feature enables two users to solve coding challenges together in real-time. It facilitates knowledge sharing and collaborative problem-solving through a shared editor and integrated audio.

---

## 2. The Lobby (Discovery Phase)
The Lobby serves as the real-time marketplace for finding partners.
- **Request Visibility**: Any user seeking help appears in the Lobby list.
- **Challenge Context**: Each listing displays the specific challenge, the host's preferred programming language, and their spoken language.
- **Real-time Status**: The list must update automatically when a user starts or stops seeking help or when they find a partner.
- **Filters**: Users can refine the list by challenge difficulty, country of the host, and language preferences.

---

## 3. The Handshake (Connectivity Phase)

### 3.1 Requesting Assistance (The Host)
1. **Starting a Request**: A user initiates a request from any challenge page.
2. **Context Setup**: The user selects their specific focus area (e.g., Debugging, Logic, or Syntax).
3. **Broadcasting State**: A persistent status banner appears for the host across all pages, indicating their request is live.
4. **Incoming Requests**: The host is alerted when other users ask to join. This alert appears even if the host is already in the workspace.

### 3.2 Offering Assistance (The Partner)
1. **Finding a Host**: A partner identifies a live request in the Lobby.
2. **Join Request**: The partner asks to join. Their status changes to "Request Sent," and a persistent banner tracks their waiting status.
3. **Remote Navigation**: If the partner navigates away from the Lobby (e.g., to the Leaderboard or Settings), their request remains active.
4. **Global Alerts**: When the host grants permission, the partner receives a high-priority notification at the top of their screen, regardless of which page they are currently visiting.

### 3.3 Joining the Session
1. **Host Action**: The host reviews join requests and grants permission to one partner.
2. **Partner Action**: The partner clicks "Join Now" from their alert or lobby banner and is immediately placed into the host's workspace.

---

## 4. The Collaborative Workspace (Collaboration Phase)

### 4.1 Synchronized Editor
- **Seamless Typing**: Both users can type simultaneously in the same file. Changes from one user appear immediately for the other.
- **Cursor Visibility**: Users can see each other's cursor positions and names to avoid typing over one another.
- **Environment Sync**: If one user changes the editor theme or programming language, the change is reflected for both users.

### 4.2 Integrated Audio
- **Automatic Connection**: Audio communication starts automatically when the partner joins the session.
- **Voice Controls**: Users can Mute and Unmute their microphones at any time.
- **Speaking Indicators**: Visual cues identify who is currently talking.

### 4.3 Community Guidelines
- **Agreement**: Every user must agree to the community rules (Respect, Collaboration, and Data Privacy) before entering a shared session.

---

## 5. Session End-of-Life

### 5.1 Success and Submission
- **Execution**: Either user can initiate a test run. Both users see the output.
- **Submission**: When the host submits a passing solution, both users receive a completion alert. The points are awarded to the host's profile.

### 5.2 Leaving the Session
- **Voluntary Exit**: A user can click "Leave" to end the session. Both participants are notified and returned to the dashboard.
- **Connection Loss**: If a user's connection is lost, the system attempts to wait for a reconnection before terminating the session.
- **Host Cancellation**: A host can stop their pairing request at any time prior to the session starting.

---

## 6. Response Scenarios & Edge Cases

| Scenario | Expected Outcome |
| :--- | :--- |
| **Multiple Join Requests** | The host sees all pending requests in a list and chooses the most suitable partner. |
| **Request Expiry** | If a request remains unanswered for a specific duration, it is automatically withdrawn. |
| **Partner Navigates Away** | The partner is notified of the host's approval via a global pop-up, no matter which page they are on. |
| **Declined Request** | If a host declines a partner, the partner is notified and can return to the Lobby to find another match. |
| **Host Closes Browser** | The partner is immediately notified that the host has left the session. |
| **Session in the Lobby** | While on the Lobby screen, the system suppresses duplicate pop-up alerts since the status banner is already visible. |
