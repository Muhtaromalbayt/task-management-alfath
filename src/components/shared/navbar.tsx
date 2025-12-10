"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Bell } from "lucide-react";
import { Sidebar } from "./sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/use-auth-store";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
    const { user, logout } = useAuthStore();
    const [sheetOpen, setSheetOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // Close sheet when pathname changes (navigation occurred)
    useEffect(() => {
        setSheetOpen(false);
    }, [pathname]);

    const handleLogout = () => {
        logout();
        router.push("/auth/login");
    };

    return (
        <header className="h-16 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 flex items-center justify-between lg:justify-end sticky top-0 z-50">
            <div className="lg:hidden">
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 w-64">
                        <Sidebar
                            className="border-none w-full"
                            onNavigate={() => setSheetOpen(false)}
                        />
                    </SheetContent>
                </Sheet>
            </div>

            <div className="flex items-center gap-4">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative text-muted-foreground hover:text-primary"
                    asChild
                >
                    <Link href="/notifications">
                        <Bell className="h-5 w-5" />
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-accent animate-pulse" />
                        <span className="sr-only">Notifications</span>
                    </Link>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.avatar || "https://github.com/shadcn.png"} alt="@user" />
                                <AvatarFallback>{user?.name?.substring(0, 2) || "AD"}</AvatarFallback>
                            </Avatar>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                        <DropdownMenuLabel className="font-normal">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none">{user?.name || "Guest User"}</p>
                                <p className="text-xs leading-none text-muted-foreground">
                                    {user?.email || "guest@alfath.org"}
                                </p>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                            <Link href="/settings">Profile</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/settings">Settings</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer"
                            onClick={handleLogout}
                        >
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
