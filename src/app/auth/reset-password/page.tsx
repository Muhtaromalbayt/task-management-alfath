"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
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
import { Loader2, CheckCircle2 } from "lucide-react";

const formSchema = z.object({
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
});

export default function ResetPasswordPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Reset password for:", values);
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    }

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
        >
            <Card className="border-t-4 border-t-accent shadow-xl w-[400px]">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center text-primary">Reset Password</CardTitle>
                    <CardDescription className="text-center">
                        Enter your email to receive a password reset link
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isSubmitted ? (
                        <div className="flex flex-col items-center justify-center space-y-4 py-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            >
                                <CheckCircle2 className="h-16 w-16 text-green-500" />
                            </motion.div>
                            <p className="text-center text-muted-foreground">
                                If an account exists for <b>{form.getValues("email")}</b>, you will receive a reset link shortly.
                            </p>
                            <Button variant="outline" className="w-full mt-4" asChild>
                                <Link href="/auth/login">Back to Login</Link>
                            </Button>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="name@alfath.org" {...field} disabled={isLoading} />
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
                                            Sending...
                                        </>
                                    ) : (
                                        "Send Reset Link"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    )}
                </CardContent>
                {!isSubmitted && (
                    <CardFooter className="flex justify-center text-sm text-muted-foreground">
                        <Link href="/auth/login" className="flex items-center hover:text-primary underline underline-offset-4">
                            Back to Login
                        </Link>
                    </CardFooter>
                )}
            </Card>
        </motion.div>
    );
}
