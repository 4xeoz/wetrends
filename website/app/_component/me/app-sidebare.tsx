"use client"

import type * as React from "react"
import { Bot, Command, GalleryVerticalEnd, PieChart, Settings2 } from "lucide-react"
import { NavMain } from "./nav-main"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar"
import { useEffect, useState } from "react"
import { NavUser } from "./nav-user"
import { getSession } from "next-auth/react"

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Analyzer",
      url: "/me/upload",
      icon: Bot,
      items: [
        {
          title: "Upload Files",
          url: "/me/upload",
          isActive: true,
        },
        {
          title: "Analysis History",
          url: "/me/history",
        },
      ],
    },
    {
      title: "Reports",
      url: "/reports",
      icon: GalleryVerticalEnd,
      items: [
        {
          title: "Monthly",
          url: "/reports/monthly",
        },
        {
          title: "Annual",
          url: "/reports/annual",
        },
      ],
    },
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [user, setUser] = useState<{ id: string; name: string; email: string; image: string } | null>(null)

  useEffect(() => {
    async function fetchUserData() {
      try {
        const session = await getSession()
        setUser({
          id: session?.user?.id as string,
          name: session?.user?.name as string,
          email: session?.user?.email as string,
          image: session?.user?.image as string,
        })
      } catch (error) {
        console.error("Failed to fetch user data:", error)
        setUser(null)
      }
    }

    fetchUserData()
  }, [])

  return (
    <Sidebar collapsible="icon" {...props} className="border-r border-sidebar-border">
      <SidebarHeader className="border-b border-sidebar-border">
      <div className="flex items-center gap-2 px-4 py-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
            <Command className="h-4 w-4" />
          </div>
          <h1 className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
            moneygrad
          </h1>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border">
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}







