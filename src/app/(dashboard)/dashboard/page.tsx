"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Activity,
    CheckCircle2,
    Clock,
    Layout,
    MoreHorizontal,
    Plus,
    Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";

const stats = [
    {
        title: "Total Projects",
        value: "12",
        description: "+2 from last month",
        icon: Layout,
        color: "text-primary",
    },
    {
        title: "Tasks In Progress",
        value: "24",
        description: "5 tasks due today",
        icon: Clock,
        color: "text-accent",
    },
    {
        title: "Completed Tasks",
        value: "145",
        description: "+18% completion rate",
        icon: CheckCircle2,
        color: "text-green-600",
    },
    {
        title: "Active Members",
        value: "48",
        description: "Across 8 divisions",
        icon: Users,
        color: "text-blue-400",
    },
];

const departments = [
    { name: "Tutorial PAI", progress: 78, tasks: 12, color: "bg-primary" },
    { name: "Tutorial SPAI", progress: 65, tasks: 8, color: "bg-blue-600" },
    { name: "Bina Kader", progress: 90, tasks: 4, color: "bg-accent" },
    { name: "Syiar & Media", progress: 45, tasks: 15, color: "bg-indigo-600" },
];

const recentActivity = [
    {
        id: 1,
        user: "Ahmad Fauzi",
        action: "completed task",
        target: "Design Homepage Mockup",
        time: "2 hours ago",
        project: "Website Redesign",
    },
    {
        id: 2,
        user: "Siti Nurhaliza",
        action: "commented on",
        target: "Database Schema",
        time: "4 hours ago",
        project: "Backend API",
    },
    {
        id: 3,
        user: "Budi Santoso",
        action: "moved task",
        target: "Auth Flow",
        time: "5 hours ago",
        project: "Mobile App",
    },
];

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h2>
                    <p className="text-muted-foreground">Overview of Al-FATH Cabinet Performance</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm">
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, index) => (
                    <motion.div
                        key={stat.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-primary/20">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium text-muted-foreground">
                                    {stat.title}
                                </CardTitle>
                                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {stat.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4 hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {recentActivity.map((activity) => (
                                <div key={activity.id} className="flex items-start">
                                    <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-primary/10 text-primary border border-primary/20">
                                        <span className="text-xs font-bold">{activity.user.charAt(0)}</span>
                                    </div>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            <span className="font-semibold">{activity.user}</span> {activity.action}{" "}
                                            <span className="font-semibold text-primary">{activity.target}</span>
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {activity.project} • {activity.time}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3 hover:shadow-md transition-shadow duration-200">
                    <CardHeader>
                        <CardTitle>Department Progress</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {departments.map((dept, i) => (
                                <div key={dept.name} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="font-medium">{dept.name}</div>
                                        <div className="text-muted-foreground">{dept.progress}%</div>
                                    </div>
                                    <Progress value={dept.progress} className="h-2" indicatorClassName={dept.color} />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
