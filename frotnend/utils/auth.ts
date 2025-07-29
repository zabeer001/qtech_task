import { BACKEND_URL } from "@/config";

export async function handleLogout(redirect = true) {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No token found.");
      return;
    }

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

    // Clear token
    localStorage.removeItem("token");
    console.log("Logged out successfully!");

    if (redirect) {
      window.location.href = "/login";
    }
  } catch (error) {
    console.error("Logout error:", error);
  }
}