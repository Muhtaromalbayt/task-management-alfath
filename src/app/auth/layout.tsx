import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute inset-0 bg-linear-to-br from-primary/20 via-background to-accent/10 z-0 pointer-events-none" />
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-accent to-primary z-10" />

            <div className="relative z-10 w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent drop-shadow-xs">
                        Al-FATH
                    </h1>
                </div>
                {children}
            </div>
        </div>
    );
}
