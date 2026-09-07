import { ReactNode } from "react";
import { AppSidebar } from "@/app/_component/me/app-sidebare";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
    children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="min-w-0">
                <SidebarTrigger />
                {children}
            </SidebarInset>
        </SidebarProvider>
    );
}
