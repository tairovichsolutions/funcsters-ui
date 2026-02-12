import axios from "axios";

export async function logout() {
  try {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
  } finally {
    window.location.href = "/challenges";
  }
}
