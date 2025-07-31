"use client"

import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { handleLogout } from "@/utils/auth"
import { useEffect, useState } from "react"
import { BACKEND_URL } from "@/config"

export default function Header() {
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null)

  async function getUserProfile() {
    try {
      const token = localStorage.getItem("token")
      if (!token) throw new Error("No token found")

      const res = await fetch(`${BACKEND_URL}api/me`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      })

      if (!res.ok) {
        const errorData = await res.json()
        throw new Error(errorData.message || "Failed to fetch user data")
      }

      const json = await res.json()
      const { name, email } = json.data
      setProfile({ name, email }) // Set the profile directly here
    } catch (error) {
      console.error("Error fetching user profile:", error)
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
      <div className="flex items-center gap-2">
    
        <h1 className="text-lg font-semibold hidden sm:block">Dashboard</h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.jpg?height=32&width=32" alt="@user" />
                <AvatarFallback>
                  {profile?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {profile?.name || "Loading..."}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {profile?.email || ""}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
         
            <DropdownMenuItem onClick={() => handleLogout()}>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
