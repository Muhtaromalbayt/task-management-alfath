"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bell, Check, Clock, MessageSquare, UserPlus, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const initialNotifications = [
    {
        id: 1,
        title: "New Task Assigned",
        message: "You have been assigned to 'Homepage Redesign'",
        time: "10 minutes ago",
        read: false,
        type: "assignment",
    },
    {
        id: 2,
        title: "Mentioned in Comment",
        message: "Sarah mentioned you in 'API Schema': @alex can you review this?",
        time: "1 hour ago",
        read: false,
        type: "mention",
    },
    {
        id: 3,
        title: "Task Deadline Approaching",
        message: "'Database Migration' is due tomorrow at 5:00 PM",
        time: "3 hours ago",
        read: true,
        type: "deadline",
    },
    {
        id: 4,
        title: "Project Update",
        message: "Board 'Mobile App' has been archived",
        time: "1 day ago",
        read: true,
        type: "system",
    },
];

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState(initialNotifications);
    const [filter, setFilter] = useState<"all" | "unread">("all");

    const unreadCount = notifications.filter(n => !n.read).length;
    const filteredNotifications = notifications.filter(n => filter === "all" || !n.read);

    const markAllRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const markAsRead = (id: number) => {
        setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "assignment": return <UserPlus className="h-4 w-4 text-blue-500" />;
            case "mention": return <MessageSquare className="h-4 w-4 text-indigo-500" />;
            case "deadline": return <Clock className="h-4 w-4 text-amber-500" />;
            case "system": return <AlertCircle className="h-4 w-4 text-gray-500" />;
            default: return <Bell className="h-4 w-4" />;
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Notifications</h2>
                    <p className="text-muted-foreground">Stay updated with your latest activity.</p>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant={filter === "all" ? "default" : "outline"}
                        onClick={() => setFilter("all")}
                        size="sm"
                    >
                        All
                    </Button>
                    <Button
                        variant={filter === "unread" ? "default" : "outline"}
                        onClick={() => setFilter("unread")}
                        size="sm"
                    >
                        Unread
                        {unreadCount > 0 && <Badge variant="secondary" className="ml-2 h-5 px-1.5">{unreadCount}</Badge>}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={markAllRead} disabled={unreadCount === 0}>
                        Mark all read
                    </Button>
                </div>
            </div>

            <Card className="min-h-[600px] flex flex-col">
                <CardHeader className="pb-3 border-b">
                    <CardTitle className="text-lg">Recent Alerts</CardTitle>
                </CardHeader>
                <ScrollArea className="flex-1">
                    <div className="divide-y">
                        {filteredNotifications.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground flex flex-col items-center">
                                <Bell className="h-12 w-12 mb-4 opacity-20" />
                                <p>No notifications found.</p>
                            </div>
                        ) : (
                            filteredNotifications.map((notification) => (
                                <motion.div
                                    key={notification.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    className={cn(
                                        "p-4 flex gap-4 hover:bg-muted/50 transition-colors cursor-pointer",
                                        !notification.read && "bg-muted/30"
                                    )}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center shrink-0 border",
                                        !notification.read ? "bg-background shadow-sm" : "bg-muted"
                                    )}>
                                        {getIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex justify-between items-start">
                                            <p className={cn("text-sm font-medium", !notification.read && "text-primary font-bold")}>
                                                {notification.title}
                                            </p>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                                                {notification.time}
                                            </span>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {notification.message}
                                        </p>
                                    </div>
                                    {!notification.read && (
                                        <div className="flex flex-col justify-center">
                                            <div className="h-2 w-2 rounded-full bg-primary" />
                                        </div>
                                    )}
                                </motion.div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </Card>
        </div>
    );
}
