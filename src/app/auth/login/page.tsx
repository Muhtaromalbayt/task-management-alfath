"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuthStore } from "@/stores/use-auth-store";
import { Eye, EyeOff, Loader2, AlertCircle } from "lucide-react";
import { login as apiLogin } from "@/lib/api/auth";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    password: z.string().min(6, {
        message: "Password must be at least 6 characters.",
    }),
});

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        setError(null);

        try {
            // Call real API
            const response = await apiLogin({
                email: values.email,
                password: values.password,
            });

            // Store user and token in zustand store
            login({
                id: response.user.id,
                name: response.user.name,
                email: response.user.email,
                role: response.user.role,
                avatar: response.user.avatar
            }, response.token);

            // Redirect to dashboard
            router.push("/dashboard");
        } catch (err) {
            console.error("Login failed:", err);
            setError(err instanceof Error ? err.message : "Login failed. Please check your credentials.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="border-t-4 border-t-accent shadow-xl w-[400px]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">Login</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email and password to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="flex items-center gap-2 p-3 mb-4 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                            <AlertCircle className="h-4 w-4 shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="name@alfath.org"
                                                {...field}
                                                disabled={isLoading}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setError(null);
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••"
                                                    {...field}
                                                    disabled={isLoading}
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        setError(null);
                                                    }}
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="sm"
                                                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                    onClick={() => setShowPassword(!showPassword)}
                                                >
                                                    {showPassword ? (
                                                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                                                    ) : (
                                                        <Eye className="h-4 w-4 text-muted-foreground" />
                                                    )}
                                                </Button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-300 shadow-md"
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </Button>
                        </form>
                    </Form>

                    {/* Demo credentials hint */}
                    <div className="mt-4 p-3 bg-muted/50 rounded-md text-xs text-muted-foreground">
                        <p className="font-medium mb-1">Demo Credentials:</p>
                        <p>Email: admin@alfath.org</p>
                        <p>Password: admin123</p>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 text-center text-sm text-muted-foreground">
                    <Link href="/auth/register" className="hover:text-primary underline underline-offset-4">
                        Don't have an account? Register
                    </Link>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
