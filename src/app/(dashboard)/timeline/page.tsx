"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

const timelineData = [
    {
        id: 1,
        title: "Website Redesign",
        start: new Date(2025, 11, 8), // Dec 8, 2025
        end: new Date(2025, 11, 20),
        type: "project",
        progress: 45,
        color: "bg-blue-500",
    },
    {
        id: 2,
        title: "Design Phase",
        start: new Date(2025, 11, 8),
        end: new Date(2025, 11, 12),
        type: "task",
        parent: 1,
        assignee: "AF",
        color: "bg-blue-400",
    },
    {
        id: 3,
        title: "Frontend Dev",
        start: new Date(2025, 11, 13),
        end: new Date(2025, 11, 18),
        type: "task",
        parent: 1,
        assignee: "BS",
        color: "bg-indigo-400",
    },
    {
        id: 4,
        title: "Mobile App",
        start: new Date(2025, 11, 15),
        end: new Date(2025, 11, 30),
        type: "project",
        progress: 10,
        color: "bg-amber-500",
    },
];

export default function TimelinePage() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 8)); // Start showing from Dec 8

    // Generate 14 days view
    const startDate = startOfWeek(currentDate);
    const endDate = addDays(startDate, 13);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

    // Helper to calculate position and width
    const getPositionStyle = (itemStart: Date, itemEnd: Date) => {
        const totalDays = 14;

        let startDiff = Math.floor((itemStart.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
        let duration = Math.ceil((itemEnd.getTime() - itemStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // Handle out of bounds
        if (startDiff < 0) {
            duration += startDiff; // Reduce duration by the amount cut off from start
            startDiff = 0;
        }

        if (startDiff >= totalDays) return { display: 'none' }; // Completely out of view
        if (startDiff + duration > totalDays) {
            duration = totalDays - startDiff; // Cut off end
        }

        if (duration <= 0) return { display: 'none' };

        return {
            left: `${(startDiff / totalDays) * 100}%`,
            width: `${(duration / totalDays) * 100}%`,
        };
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Timeline</h2>
                    <p className="text-muted-foreground">Visual project roadmap and schedules.</p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted rounded-md p-1">
                        <Button variant="ghost" size="icon" onClick={prevWeek} className="h-8 w-8">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <span className="px-3 text-sm font-medium">
                            {format(startDate, "MMM d")} - {format(endDate, "MMM d, yyyy")}
                        </span>
                        <Button variant="ghost" size="icon" onClick={nextWeek} className="h-8 w-8">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Item
                    </Button>
                </div>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden bg-background shadow-sm flex flex-col">
                {/* Header Row */}
                <div className="flex border-b bg-muted/30">
                    <div className="w-64 p-4 border-r font-medium text-sm text-foreground/80 shrink-0">
                        Task Name
                    </div>
                    <div className="flex-1 flex">
                        {days.map((day) => (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "flex-1 border-r last:border-r-0 p-2 text-center text-xs",
                                    isSameDay(day, new Date()) ? "bg-primary/5 text-primary font-bold" : "text-muted-foreground"
                                )}
                            >
                                <div className="font-semibold">{format(day, "EEE")}</div>
                                <div>{format(day, "d")}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Timeline Rows */}
                <div className="divide-y overflow-y-auto flex-1">
                    {timelineData.map((item, index) => (
                        <div key={item.id} className="flex hover:bg-muted/20 transition-colors group">
                            <div className="w-64 p-3 border-r shrink-0 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    {item.type === 'project' ? (
                                        <div className="w-2 h-2 rounded-full bg-primary" />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-transparent ml-4 border border-muted-foreground" />
                                    )}
                                    <span className={cn("text-sm", item.type === 'project' ? "font-semibold" : "text-muted-foreground")}>
                                        {item.title}
                                    </span>
                                </div>
                                {item.assignee && (
                                    <Avatar className="h-6 w-6">
                                        <AvatarFallback className="text-[10px]">{item.assignee}</AvatarFallback>
                                    </Avatar>
                                )}
                            </div>

                            <div className="flex-1 relative h-12">
                                {/* Grid Lines for reference */}
                                <div className="absolute inset-0 flex pointer-events-none">
                                    {days.map((day) => (
                                        <div key={day.toString()} className="flex-1 border-r last:border-r-0" />
                                    ))}
                                </div>

                                {/* Timeline Bar */}
                                <motion.div
                                    initial={{ opacity: 0, scaleX: 0 }}
                                    animate={{ opacity: 1, scaleX: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className={cn(
                                        "absolute top-2 h-8 rounded-md shadow-sm border border-white/10 flex items-center px-2 text-xs text-white font-medium overflow-hidden whitespace-nowrap cursor-pointer hover:brightness-110 transition-all",
                                        item.color
                                    )}
                                    style={getPositionStyle(item.start, item.end)}
                                >
                                    {item.type === 'project' && (
                                        <span className="drop-shadow-sm">{item.progress}%</span>
                                    )}
                                </motion.div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
