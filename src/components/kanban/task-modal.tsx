"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Task } from "@/types/kanban";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CheckSquare, Clock, Paperclip, Send, Tag, Trash2, User, Plus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface TaskModalProps {
    task: Task | null;
    open: boolean;
    onClose: () => void;
    onSave: (task: Task) => void;
}

export function TaskModal({ task, open, onClose, onSave }: TaskModalProps) {
    const [editedTask, setEditedTask] = useState<Task | null>(task);
    const [comment, setComment] = useState("");
    const [checklistInput, setChecklistInput] = useState("");

    // Mock data for UI demo if task doesn't have these fields yet
    const [comments, setComments] = useState([
        { id: 1, user: "Ahmad Fauzi", text: "Please update the color scheme.", time: "2 hours ago" },
        { id: 2, user: "Siti Nurhaliza", text: "Added the assets to the drive.", time: "1 hour ago" },
    ]);

    const [checklist, setChecklist] = useState([
        { id: 1, text: "Research competitors", done: true },
        { id: 2, text: "Draft initial layout", done: false },
    ]);

    if (!task) return null;

    const handleSave = () => {
        if (editedTask) {
            onSave(editedTask);
        }
        onClose();
    };

    const addChecklistItem = () => {
        if (!checklistInput.trim()) return;
        setChecklist([...checklist, { id: Date.now(), text: checklistInput, done: false }]);
        setChecklistInput("");
    };

    const toggleCheckitem = (id: number) => {
        setChecklist(checklist.map(item => item.id === id ? { ...item, done: !item.done } : item));
    };

    const addComment = () => {
        if (!comment.trim()) return;
        setComments([...comments, { id: Date.now(), user: "You", text: comment, time: "Just now" }]);
        setComment("");
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-3xl h-[85vh] p-0 overflow-hidden flex flex-col gap-0 bg-background/95 backdrop-blur-md">
                {/* Header Image or Color Strip could go here */}
                <div className="h-2 w-full bg-primary/20" />

                <div className="flex flex-1 overflow-hidden">
                    {/* Main Content */}
                    <ScrollArea className="flex-1 p-6">
                        <DialogHeader className="mb-6">
                            <DialogTitle className="text-2xl font-bold flex items-start gap-4">
                                <span className="mt-1">
                                    {task.content}
                                </span>
                                <Badge variant="outline" className="ml-auto shrink-0 mt-2">
                                    {task.columnId}
                                </Badge>
                            </DialogTitle>
                            <DialogDescription>
                                Created in <span className="underline cursor-pointer">General Board</span>
                            </DialogDescription>
                        </DialogHeader>

                        <div className="grid gap-6">
                            {/* Meta Data Row */}
                            <div className="flex flex-wrap gap-4">
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase font-semibold">Status</Label>
                                    <Select defaultValue={task.columnId.toString()}>
                                        <SelectTrigger className="w-[140px] h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="todo">To Do</SelectItem>
                                            <SelectItem value="in-progress">In Progress</SelectItem>
                                            <SelectItem value="review">Review</SelectItem>
                                            <SelectItem value="done">Done</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase font-semibold">Priority</Label>
                                    <Select defaultValue={task.priority || "Medium"}>
                                        <SelectTrigger className="w-[130px] h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Low">Low</SelectItem>
                                            <SelectItem value="Medium">Medium</SelectItem>
                                            <SelectItem value="High">High</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase font-semibold">Assignee</Label>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 cursor-pointer hover:ring-2 ring-primary/50 transition-all">
                                            <AvatarFallback className="text-xs bg-primary/20 text-primary">{task.assignee || "UN"}</AvatarFallback>
                                        </Avatar>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full border border-dashed">
                                            <Plus className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <Label className="text-xs text-muted-foreground uppercase font-semibold">Due Date</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn("w-[140px] h-8 justify-start text-left font-normal text-xs", !task.dueDate && "text-muted-foreground")}
                                            >
                                                <CalendarIcon className="mr-2 h-3 w-3" />
                                                {task.dueDate ? format(task.dueDate, "PPP") : <span>Pick a date</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg font-semibold flex items-center gap-2">
                                    <div className="p-1 bg-muted rounded">
                                        <CheckSquare className="h-4 w-4" />
                                    </div>
                                    Description
                                </Label>
                                <Textarea
                                    className="min-h-[120px] bg-muted/20 resize-none focus-visible:ring-1"
                                    placeholder="Add a more detailed description..."
                                    defaultValue="Implement the main dashboard layout with responsive grid system using Tailwind CSS and shadcn/ui components."
                                />
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg font-semibold flex items-center gap-2">
                                    <div className="p-1 bg-muted rounded">
                                        <CheckSquare className="h-4 w-4" />
                                    </div>
                                    Checklist
                                </Label>
                                <div className="space-y-3">
                                    <div className="space-y-2">
                                        {checklist.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 group">
                                                <Checkbox
                                                    checked={item.done}
                                                    onCheckedChange={() => toggleCheckitem(item.id)}
                                                />
                                                <span className={cn("text-sm flex-1", item.done && "line-through text-muted-foreground decoration-2 decoration-muted-foreground")}>
                                                    {item.text}
                                                </span>
                                                <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <Trash2 className="h-3 w-3 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex gap-2">
                                        <Input
                                            placeholder="Add an item..."
                                            value={checklistInput}
                                            onChange={(e) => setChecklistInput(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && addChecklistItem()}
                                            className="h-8 text-sm"
                                        />
                                        <Button size="sm" onClick={addChecklistItem} variant="secondary">Add</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <Label className="text-lg font-semibold flex items-center gap-2">
                                    <div className="p-1 bg-muted rounded">
                                        <Paperclip className="h-4 w-4" />
                                    </div>
                                    Attachments
                                </Label>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="h-24 rounded-lg border border-dashed flex items-center justify-center bg-muted/10 hover:bg-muted/20 cursor-pointer transition-colors">
                                        <div className="text-center text-xs text-muted-foreground">
                                            <Plus className="h-6 w-6 mx-auto mb-1 opacity-50" />
                                            Upload File
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ScrollArea>

                    {/* Sidebar / Comments Section */}
                    <div className="w-[300px] border-l bg-muted/10 flex flex-col">
                        <div className="p-4 border-b">
                            <h4 className="font-semibold text-sm">Activity</h4>
                        </div>
                        <ScrollArea className="flex-1 p-4">
                            <div className="space-y-6">
                                {comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 text-sm">
                                        <Avatar className="h-8 w-8 mt-1">
                                            <AvatarFallback className="text-xs">{comment.user.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-semibold">{comment.user}</span>
                                                <span className="text-xs text-muted-foreground">{comment.time}</span>
                                            </div>
                                            <p className="text-muted-foreground leading-relaxed">{comment.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div className="p-4 border-t bg-background">
                            <div className="flex gap-2 items-end">
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>ME</AvatarFallback>
                                </Avatar>
                                <div className="flex-1 space-y-2">
                                    <Textarea
                                        placeholder="Write a comment..."
                                        className="min-h-[80px] text-sm resize-none"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    />
                                    <div className="flex justify-end">
                                        <Button size="sm" className="h-7 text-xs" onClick={addComment}>
                                            Send
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
