"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import {
    LayoutDashboard,
    KanbanSquare,
    ListTodo,
    CalendarDays,
    Users,
    Settings,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/use-auth-store";

const sidebarLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/projects", label: "Projects", icon: KanbanSquare },
    { href: "/tasks", label: "My Tasks", icon: ListTodo },
    { href: "/timeline", label: "Timeline", icon: CalendarDays },
    { href: "/team", label: "Team", icon: Users },
    { href: "/settings", label: "Settings", icon: Settings },
];

interface SidebarProps {
    className?: string;
    onNavigate?: () => void; // Callback when navigation occurs
}

export function Sidebar({ className, onNavigate }: SidebarProps) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, logout } = useAuthStore();

    const handleLinkClick = () => {
        // Call onNavigate callback to close mobile menu
        onNavigate?.();
    };

    const handleLogout = () => {
        logout();
        onNavigate?.();
        router.push("/auth/login");
    };

    return (
        <div className={cn("flex flex-col h-screen bg-sidebar border-r border-sidebar-border w-64", className)}>
            <div className="h-16 flex items-center px-6 border-b border-sidebar-border">
                <Link href="/dashboard" onClick={handleLinkClick}>
                    <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                        Al-FATH
                    </h1>
                </Link>
            </div>

            <ScrollArea className="flex-1 px-3 py-4">
                <nav className="space-y-1">
                    {sidebarLinks.map((link) => {
                        const isActive = pathname === link.href || pathname?.startsWith(`${link.href}/`);
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={handleLinkClick}
                                className={cn(
                                    "flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-all duration-150",
                                    isActive
                                        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
                                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                                )}
                            >
                                <link.icon className={cn("h-4 w-4", isActive ? "text-primary" : "text-muted-foreground")} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>
            </ScrollArea>

            <div className="p-4 border-t border-sidebar-border">
                <div className="flex items-center gap-3 mb-4">
                    <Avatar>
                        <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} />
                        <AvatarFallback>{user?.name?.substring(0, 2) || "AD"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                        <span className="text-sm font-medium">{user?.name || "Guest User"}</span>
                        <span className="text-xs text-muted-foreground">{user?.email || "guest@alfath.org"}</span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={handleLogout}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Log Out
                </Button>
            </div>
        </div>
    );
}
