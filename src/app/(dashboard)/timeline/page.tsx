"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay, parseISO, isValid } from "date-fns";
import { cn } from "@/lib/utils";
import { getTasks, Task } from "@/lib/api/tasks";
import { getProjects, Project } from "@/lib/api/projects";

interface TimelineItem {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: "project" | "task";
    progress?: number;
    color: string;
    assignee?: string;
}

export default function TimelinePage() {
    // Start from Dec 1, 2025 to show the requested timeline
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 15));
    const [items, setItems] = useState<TimelineItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Generate 14 days view
    const startDate = startOfWeek(currentDate);
    const endDate = addDays(startDate, 13);
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    useEffect(() => {
        async function loadData() {
            try {
                const [tasksData, projectsData] = await Promise.all([
                    getTasks(),
                    getProjects()
                ]);

                const timelineItems: TimelineItem[] = [];

                // Process Projects
                projectsData.forEach(p => {
                    // For projects, we might not have exact start/end in DB yet, but let's assume due_date is end
                    // and created_at is start. 
                    // However, specifically for "Tutorial PAI SPAI", user wants to see individual tasks as the timeline rows.
                    // So we mainly focus on Tasks. 
                });

                // Process Tasks
                tasksData.forEach(t => {
                    let start = t.start_date ? parseISO(t.start_date) : (t.due_date ? parseISO(t.due_date) : undefined);
                    let end = t.due_date ? parseISO(t.due_date) : start;

                    if (start && isValid(start) && end && isValid(end)) {
                        timelineItems.push({
                            id: t.id,
                            title: t.content,
                            start: start,
                            end: end,
                            type: 'task',
                            color: getPriorityColor(t.priority),
                            assignee: t.assignee_name
                        });
                    }
                });

                setItems(timelineItems);
            } catch (error) {
                console.error("Failed to load timeline data", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    const nextWeek = () => setCurrentDate(addDays(currentDate, 7));
    const prevWeek = () => setCurrentDate(addDays(currentDate, -7));

    function getPriorityColor(priority: string) {
        switch (priority) {
            case 'High': return 'bg-red-500 border-red-400';
            case 'Medium': return 'bg-blue-500 border-blue-400';
            case 'Low': return 'bg-green-500 border-green-400';
            default: return 'bg-slate-500';
        }
    }

    // Helper to calculate position and width
    const getPositionStyle = (itemStart: Date, itemEnd: Date) => {
        const totalDays = 14;
        const viewStart = startDate.getTime();

        // Calculate start position relative to view start
        let startDiff = Math.floor((itemStart.getTime() - viewStart) / (1000 * 60 * 60 * 24));

        // Calculate duration in days
        let duration = Math.ceil((itemEnd.getTime() - itemStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        // If item ends before view starts, hide
        if (startDiff + duration <= 0) return { display: 'none' };

        // If item starts after view ends, hide
        if (startDiff >= totalDays) return { display: 'none' };

        // Handle text/bar positioning when partially visible
        let leftPercent = (startDiff / totalDays) * 100;
        let widthPercent = (duration / totalDays) * 100;

        // Visual adjustment for bars starting before view
        if (startDiff < 0) {
            // We keep the left negative to let CSS clip it (or we could truncate)
            // But simple calculating is better:
            // Let's just return CSS and let overflow-hidden handle it
        }

        return {
            left: `${leftPercent}%`,
            width: `${Math.max(widthPercent, (100 / 14))}%`, // Min width 1 day slot
        };
    };

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Timeline</h2>
                    <p className="text-muted-foreground">Jadwal Tutorial PAI SPAI Semester Genap 2025/2026</p>
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
                </div>
            </div>

            <div className="flex-1 border rounded-lg overflow-hidden bg-background shadow-sm flex flex-col h-[calc(100vh-12rem)]">
                {/* Header Row */}
                <div className="flex border-b bg-muted/30 sticky top-0 z-10">
                    <div className="w-64 p-4 border-r font-medium text-sm text-foreground/80 shrink-0 bg-muted/30">
                        Kegiatan
                    </div>
                    <div className="flex-1 flex min-w-0">
                        {days.map((day) => (
                            <div
                                key={day.toString()}
                                className={cn(
                                    "flex-1 border-r last:border-r-0 p-2 text-center text-xs min-w-[3rem]",
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
                <div className="divide-y overflow-y-auto flex-1 relative">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        items.length === 0 ? (
                            <div className="flex items-center justify-center h-full text-muted-foreground">
                                No timeline items found within this range.
                            </div>
                        ) : (
                            items.map((item, index) => (
                                <div key={item.id} className="flex hover:bg-muted/20 transition-colors group">
                                    <div className="w-64 p-3 border-r shrink-0 flex items-center justify-between sticky left-0 bg-background/95 backdrop-blur z-0 border-r-border/50">
                                        <div className="flex items-center gap-2 w-full overflow-hidden">
                                            {item.type === 'project' ? (
                                                <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                            ) : (
                                                <div className="w-2 h-2 rounded-full bg-transparent ml-4 border border-foreground/20 shrink-0" />
                                            )}
                                            <span className={cn("text-xs truncate", item.type === 'project' ? "font-semibold" : "text-muted-foreground")} title={item.title}>
                                                {item.title}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex-1 relative h-10 min-w-0">
                                        {/* Grid Lines for reference */}
                                        <div className="absolute inset-0 flex pointer-events-none">
                                            {days.map((day) => (
                                                <div key={day.toString()} className="flex-1 border-r last:border-r-0 border-border/30" />
                                            ))}
                                        </div>

                                        {/* Timeline Bar */}
                                        <motion.div
                                            initial={{ opacity: 0, scaleX: 0 }}
                                            animate={{ opacity: 1, scaleX: 1 }}
                                            transition={{ delay: index * 0.02 }}
                                            className={cn(
                                                "absolute top-2 h-6 rounded-md shadow-sm border flex items-center px-2 text-[10px] text-white font-medium overflow-hidden whitespace-nowrap cursor-pointer hover:brightness-110 transition-all",
                                                item.color
                                            )}
                                            style={getPositionStyle(item.start, item.end)}
                                            title={`${item.title} (${format(item.start, "MMM d")} - ${format(item.end, "MMM d")})`}
                                        >
                                            <span className="drop-shadow-md truncate">{item.title}</span>
                                        </motion.div>
                                    </div>
                                </div>
                            ))
                        )
                    )}
                </div>
            </div>
        </div>
    );
}
