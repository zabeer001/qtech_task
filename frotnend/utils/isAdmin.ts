// hooks/useUser.ts
import { useEffect, useState } from "react";
import { BACKEND_URL } from "@/config";

export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  // Add more fields if needed
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null); // null = loading or unauthenticated

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setUser(null);
          return;
        }

        const res = await fetch(`${BACKEND_URL}api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setUser(null);
          return;
        }

        // Parse the response and extract the data
        const responseData = await res.json();
        const userData: User = responseData.data; // Ensure data matches User interface

      console.log('usDDDDDDDDDaaaaaaaaaaattttttttt');
      
        console.log(userData);
        
        setUser(userData); // Set the user data
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      }
    }

    fetchUser();
  }, []);

  return user;
}