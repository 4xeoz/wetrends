"use client"

import { TypeIcon as type, LucideIcon } from 'lucide-react'

import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
} from "@/components/ui/sidebar"

export function NavMain({
    items,
}: {
    items: {
        title: string
        url: string
        icon?: LucideIcon
        isActive?: boolean
        items?: {
            title: string
            url: string
            isActive?: boolean
        }[]
    }[]
}) {
    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                        <SidebarMenuButton 
                            tooltip={item.title} 
                            isActive={item.isActive}
                            className="group"
                        >
                            {item.icon && <item.icon className="text-sidebar-primary group-data-[active=true]:text-sidebar-primary-foreground" />}
                            <span>{item.title}</span>
                        </SidebarMenuButton>
                        {item.items && (
                            <SidebarMenuSub>
                                {item.items.map((subItem) => (
                                    <SidebarMenuSubItem key={subItem.title}>
                                        <SidebarMenuSubButton 
                                            asChild 
                                            isActive={subItem.isActive}
                                            className="hover:text-sidebar-primary data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground"
                                        >
                                            <a href={subItem.url}>
                                                <span>{subItem.title}</span>
                                            </a>
                                        </SidebarMenuSubButton>
                                    </SidebarMenuSubItem>
                                ))}
                            </SidebarMenuSub>
                        )}
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarGroup>
    )
}
