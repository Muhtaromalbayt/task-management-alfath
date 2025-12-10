import { ReactNode } from "react";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen bg-muted/40">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block fixed inset-y-0 left-0 z-10 w-64 bg-background border-r">
                <Sidebar className="w-full h-full border-none" />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
                <Navbar />
                <main className="flex-1 p-6 overflow-y-auto">
                    <div className="max-w-7xl mx-auto space-y-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
