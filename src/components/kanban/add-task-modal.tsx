"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useBoardStore } from "@/stores/use-board-store";

const formSchema = z.object({
    content: z.string().min(1, "Task content is required").max(500, "Task content too long"),
    priority: z.enum(["Low", "Medium", "High"]),
    dueDate: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface AddTaskModalProps {
    open: boolean;
    onClose: () => void;
    columnId: string;
}

export function AddTaskModal({ open, onClose, columnId }: AddTaskModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const { addTask } = useBoardStore();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            content: "",
            priority: "Medium",
        },
    });

    const handleClose = () => {
        form.reset();
        setError(null);
        setSuccess(false);
        onClose();
    };

    async function onSubmit(data: FormData) {
        setIsSubmitting(true);
        setError(null);

        try {
            const result = await addTask({
                columnId,
                content: data.content,
                priority: data.priority,
                dueDate: data.dueDate,
            });

            if (result) {
                setSuccess(true);
                setTimeout(() => {
                    form.reset();
                    setSuccess(false);
                    onClose();
                }, 500);
            } else {
                setError("Failed to add task. Please try again.");
            }
        } catch (err) {
            console.error("Failed to add task:", err);
            setError(err instanceof Error ? err.message : "Failed to add task. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Task</DialogTitle>
                    <DialogDescription>
                        Create a new task for this column.
                    </DialogDescription>
                </DialogHeader>

                {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md text-destructive text-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}

                {success && (
                    <div className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/20 rounded-md text-green-600 text-sm">
                        <CheckCircle className="h-4 w-4 shrink-0" />
                        <span>Task added successfully!</span>
                    </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="content">Task Description *</Label>
                        <Textarea
                            id="content"
                            placeholder="What needs to be done?"
                            className="resize-none min-h-[80px]"
                            disabled={isSubmitting || success}
                            {...form.register("content")}
                        />
                        {form.formState.errors.content && (
                            <p className="text-sm text-destructive">{form.formState.errors.content.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            value={form.watch("priority")}
                            onValueChange={(value) => form.setValue("priority", value as "Low" | "Medium" | "High")}
                            disabled={isSubmitting || success}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Low">
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-green-500" />
                                        Low
                                    </span>
                                </SelectItem>
                                <SelectItem value="Medium">
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-yellow-500" />
                                        Medium
                                    </span>
                                </SelectItem>
                                <SelectItem value="High">
                                    <span className="flex items-center gap-2">
                                        <span className="h-2 w-2 rounded-full bg-red-500" />
                                        High
                                    </span>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Due Date (Optional)</Label>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={isSubmitting || success}
                                    className={cn(
                                        "w-full justify-start text-left font-normal",
                                        !form.watch("dueDate") && "text-muted-foreground"
                                    )}
                                >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {form.watch("dueDate") ? (
                                        format(form.watch("dueDate")!, "PPP")
                                    ) : (
                                        <span>Pick a date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={form.watch("dueDate")}
                                    onSelect={(date) => form.setValue("dueDate", date)}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || success}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Added!
                                </>
                            ) : (
                                "Add Task"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
