"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, Calendar as CalendarIcon, List as ListIcon, BarChart2 } from "lucide-react";
import { format, addDays, startOfWeek, eachDayOfInterval, isSameDay, parseISO, isValid, addWeeks, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";
import { cn } from "@/lib/utils";
import { getTasks } from "@/lib/api/tasks";
import { getProjects } from "@/lib/api/projects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface TimelineItem {
    id: string;
    title: string;
    start: Date;
    end: Date;
    type: "project" | "task";
    progress?: number;
    color: string;
    assignee?: string;
    priority: string;
}

export default function TimelinePage() {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 11, 15)); // Start Dec 2025
    const [items, setItems] = useState<TimelineItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"gantt" | "list">("gantt");

    // Gantt View Calculations
    const startDate = startOfWeek(currentDate);
    const endDate = addDays(startDate, 13); // 2 weeks view
    const days = eachDayOfInterval({ start: startDate, end: endDate });

    useEffect(() => {
        async function loadData() {
            try {
                // Fetch tasks only for now as requested
                const tasksData = await getTasks();

                const timelineItems: TimelineItem[] = [];

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
                            assignee: t.assignee_name,
                            priority: t.priority
                        });
                    }
                });

                // Sort by date
                timelineItems.sort((a, b) => a.start.getTime() - b.start.getTime());

                setItems(timelineItems);
            } catch (error) {
                console.error("Failed to load timeline data", error);
            } finally {
                setIsLoading(false);
            }
        }

        loadData();
    }, []);

    const nextPeriod = () => setCurrentDate(addWeeks(currentDate, 2));
    const prevPeriod = () => setCurrentDate(addWeeks(currentDate, -2));

    function getPriorityColor(priority: string) {
        switch (priority) {
            case 'High': return 'bg-red-500 border-red-400';
            case 'Medium': return 'bg-blue-500 border-blue-400';
            case 'Low': return 'bg-green-500 border-green-400';
            default: return 'bg-slate-500';
        }
    }

    function getPriorityBadgeColor(priority: string) {
        switch (priority) {
            case 'High': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
            case 'Medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
            case 'Low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
            default: return 'bg-gray-100 text-gray-800';
        }
    }

    // --- GANTT VIEW RENDERER ---
    const getPositionStyle = (itemStart: Date, itemEnd: Date) => {
        const totalDays = 14;
        const viewStart = startDate.getTime();
        let startDiff = Math.floor((itemStart.getTime() - viewStart) / (1000 * 60 * 60 * 24));
        let duration = Math.ceil((itemEnd.getTime() - itemStart.getTime()) / (1000 * 60 * 60 * 24)) + 1;

        if (startDiff + duration <= 0) return { display: 'none' };
        if (startDiff >= totalDays) return { display: 'none' };

        let leftPercent = (startDiff / totalDays) * 100;
        let widthPercent = (duration / totalDays) * 100;

        return {
            left: `${leftPercent}%`,
            width: `${Math.max(widthPercent, (100 / 14))}%`,
        };
    };

    // --- LIST VIEW GROUPING ---
    const groupedItems = items.reduce((acc, item) => {
        const monthYear = format(item.start, "MMMM yyyy");
        if (!acc[monthYear]) acc[monthYear] = [];
        acc[monthYear].push(item);
        return acc;
    }, {} as Record<string, TimelineItem[]>);

    return (
        <div className="space-y-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Timeline</h2>
                    <p className="text-muted-foreground">Jadwal Tutorial PAI SPAI Semester Genap 2025/2026</p>
                </div>

                {/* View Switcher for Mobile/Desktop */}
                <div className="flex items-center gap-2 bg-muted p-1 rounded-lg self-start md:self-auto">
                    <Button
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("list")}
                        className="text-xs"
                    >
                        <ListIcon className="mr-2 h-3 w-3" /> List
                    </Button>
                    <Button
                        variant={viewMode === "gantt" ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setViewMode("gantt")}
                        className="text-xs hidden md:flex"
                    >
                        <BarChart2 className="mr-2 h-3 w-3" /> Gantt
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <>
                    {/* --- MOBILE LIST VIEW (Default on mobile, Toggleable on Desktop) --- */}
                    <div className={cn("space-y-8", viewMode === "gantt" && "hidden md:hidden")}>
                        {Object.entries(groupedItems).map(([month, monthItems]) => (
                            <div key={month} className="space-y-4">
                                <div className="sticky top-0 bg-background/95 backdrop-blur py-2 z-10 border-b">
                                    <h3 className="text-lg font-semibold text-primary">{month}</h3>
                                </div>
                                <div className="grid gap-3">
                                    {monthItems.map((item) => (
                                        <Card key={item.id} className="overflow-hidden">
                                            <div className={cn("h-1 w-full", item.color.split(' ')[0])} />
                                            <CardContent className="p-4">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div className="space-y-1">
                                                        <h4 className="font-medium line-clamp-2">{item.title}</h4>
                                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                            <CalendarIcon className="h-3 w-3" />
                                                            <span>
                                                                {format(item.start, "d MMM")}
                                                                {item.start.getTime() !== item.end.getTime() && ` - ${format(item.end, "d MMM")}`}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <Badge variant="outline" className={getPriorityBadgeColor(item.priority)}>
                                                        {item.priority}
                                                    </Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* --- DESKTOP GANTT VIEW --- */}
                    <div className={cn("flex-1 border rounded-lg overflow-hidden bg-background shadow-sm flex flex-col h-[calc(100vh-12rem)]", viewMode === "list" && "hidden")}>
                        {/* Controls */}
                        <div className="flex items-center justify-between p-2 border-b bg-muted/20">
                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="icon" onClick={prevPeriod} className="h-8 w-8">
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="px-3 text-sm font-medium min-w-[140px] text-center">
                                    {format(startDate, "d MMM")} - {format(endDate, "d MMM yyyy")}
                                </span>
                                <Button variant="ghost" size="icon" onClick={nextPeriod} className="h-8 w-8">
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Calendar Header */}
                        <div className="flex border-b bg-muted/30">
                            <div className="w-64 p-3 border-r font-medium text-sm text-foreground/80 shrink-0 bg-muted/30 pl-4">
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

                        {/* Timeline Items */}
                        <div className="divide-y overflow-y-auto flex-1 relative">
                            {items.length === 0 ? (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    No timeline items found within this range.
                                </div>
                            ) : (
                                items.map((item, index) => {
                                    const position = getPositionStyle(item.start, item.end);

                                    // Only render if visible in current view
                                    if (position.display === 'none') {
                                        // Optional: Render row but without bar if you want list continuity, 
                                        // but usually we hide fetching rows that aren't in view in Gantt
                                        // For now, let's render the row anyway so users see the task exists
                                    }

                                    return (
                                        <div key={item.id} className="flex hover:bg-muted/20 transition-colors group h-12">
                                            <div className="w-64 p-3 border-r shrink-0 flex items-center justify-between sticky left-0 bg-background/95 backdrop-blur z-20 border-r-border/50 pl-4">
                                                <div className="flex items-center gap-2 w-full overflow-hidden">
                                                    <div className={cn("w-2 h-2 rounded-full shrink-0", item.color.split(' ')[0])} />
                                                    <span className="text-xs truncate font-medium" title={item.title}>
                                                        {item.title}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex-1 relative h-full min-w-0 z-10">
                                                {/* Grid Lines */}
                                                <div className="absolute inset-0 flex pointer-events-none">
                                                    {days.map((day) => (
                                                        <div key={day.toString()} className="flex-1 border-r last:border-r-0 border-border/30" />
                                                    ))}
                                                </div>

                                                {/* Bar */}
                                                {position.display !== 'none' && (
                                                    <motion.div
                                                        initial={{ opacity: 0, scaleX: 0 }}
                                                        animate={{ opacity: 1, scaleX: 1 }}
                                                        transition={{ delay: 0.1 }}
                                                        className={cn(
                                                            "absolute top-3 h-6 rounded-md shadow-sm border flex items-center px-2 text-[10px] text-white font-medium overflow-hidden whitespace-nowrap cursor-pointer hover:brightness-110 transition-all",
                                                            item.color
                                                        )}
                                                        style={position}
                                                        title={`${item.title} (${format(item.start, "d MMM")} - ${format(item.end, "d MMM")})`}
                                                    >
                                                        <span className="drop-shadow-md truncate">{item.title}</span>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
