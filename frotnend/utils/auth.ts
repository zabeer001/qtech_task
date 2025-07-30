import { BACKEND_URL } from "@/config";

export async function handleLogout(redirect = true) {
  const token = localStorage.getItem("token");

  try {
    if (token) {
      const res = await fetch(`${BACKEND_URL}api/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Logout failed");
      }

      console.log("Logged out from server.");
    } else {
      console.warn("No token found in localStorage.");
    }
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    // Always remove token and redirect regardless of API result
    localStorage.removeItem("token");

    if (redirect) {
      window.location.href = "/login";
    }
  }
}
