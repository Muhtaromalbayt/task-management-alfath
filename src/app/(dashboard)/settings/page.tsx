"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Bell, Lock, User, Palette, LogOut, Moon, Sun } from "lucide-react";
import { useAuthStore } from "@/stores/use-auth-store";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
    const { user } = useAuthStore();

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-10">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Settings</h2>
                <p className="text-muted-foreground">Manage your account settings and preferences.</p>
            </div>

            <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                    <TabsTrigger value="profile">Profile</TabsTrigger>
                    <TabsTrigger value="account">Account</TabsTrigger>
                    <TabsTrigger value="appearance">Appearance</TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>
                                Update your photo and personal details here.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                                <div className="flex flex-col items-center gap-3">
                                    <Avatar className="h-24 w-24 border-2 border-muted">
                                        <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                                            {user?.name?.charAt(0) || "U"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <Button variant="outline" size="sm">Change Avatar</Button>
                                </div>
                                <div className="space-y-4 flex-1 w-full text-left">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input id="name" defaultValue={user?.name || "Muhammad Rifqi"} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" defaultValue={user?.email || "rifqi@alfath.id"} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="role">Role</Label>
                                        <Input id="role" defaultValue={user?.role || "Administrator"} disabled className="bg-muted text-muted-foreground" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Save Changes</Button>
                        </CardFooter>
                    </Card>
                </TabsContent>

                <TabsContent value="account" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Password & Security</CardTitle>
                            <CardDescription>
                                Manage your password and security preferences.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="current-password">Current Password</Label>
                                <Input id="current-password" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="new-password">New Password</Label>
                                <Input id="new-password" type="password" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="confirm-password">Confirm Password</Label>
                                <Input id="confirm-password" type="password" />
                            </div>
                        </CardContent>
                        <CardFooter className="border-t px-6 py-4">
                            <Button>Update Password</Button>
                        </CardFooter>
                    </Card>

                    <Card className="border-destructive/50">
                        <CardHeader>
                            <CardTitle className="text-destructive">Danger Zone</CardTitle>
                            <CardDescription>
                                Irreversible and destructive actions.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <p className="font-medium">Delete Account</p>
                                    <p className="text-sm text-muted-foreground">
                                        Permanently delete your account and all data.
                                    </p>
                                </div>
                                <Button variant="destructive">Delete Account</Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-4 mt-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Theme Preferences</CardTitle>
                            <CardDescription>
                                Customize the look and feel of the application.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Moon className="h-4 w-4" />
                                        <Label className="font-medium">Dark Mode</Label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Enable dark mode for better viewing at night.
                                    </p>
                                </div>
                                <Switch id="dark-mode" />
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <Bell className="h-4 w-4" />
                                        <Label className="font-medium">Desktop Notifications</Label>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Receive push notifications for important updates.
                                    </p>
                                </div>
                                <Switch id="notifications" defaultChecked />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
