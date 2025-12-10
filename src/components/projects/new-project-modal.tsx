"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createProject } from "@/lib/api/projects";

const formSchema = z.object({
    title: z.string().min(1, "Project title is required").max(100, "Title too long"),
    description: z.string().max(500, "Description too long").optional(),
    dueDate: z.date().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface NewProjectModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function NewProjectModal({ open, onClose, onSuccess }: NewProjectModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            description: "",
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
            const project = await createProject({
                title: data.title,
                description: data.description,
                due_date: data.dueDate?.toISOString(),
            });

            setSuccess(true);

            // Wait briefly to show success state
            setTimeout(() => {
                form.reset();
                setSuccess(false);
                onClose();
                onSuccess?.();

                // Navigate to the new project
                router.push(`/projects/${project.id}`);
            }, 500);
        } catch (err) {
            console.error("Failed to create project:", err);
            setError(err instanceof Error ? err.message : "Failed to create project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                    <DialogDescription>
                        Start a new project with a Kanban board for task management.
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
                        <span>Project created successfully! Redirecting...</span>
                    </div>
                )}

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Project Title *</Label>
                        <Input
                            id="title"
                            placeholder="e.g., Website Redesign"
                            disabled={isSubmitting || success}
                            {...form.register("title")}
                        />
                        {form.formState.errors.title && (
                            <p className="text-sm text-destructive">{form.formState.errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What is this project about?"
                            className="resize-none h-24"
                            disabled={isSubmitting || success}
                            {...form.register("description")}
                        />
                        {form.formState.errors.description && (
                            <p className="text-sm text-destructive">{form.formState.errors.description.message}</p>
                        )}
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
                                        <span>Pick a due date</span>
                                    )}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    mode="single"
                                    selected={form.watch("dueDate")}
                                    onSelect={(date) => form.setValue("dueDate", date)}
                                    disabled={(date) => date < new Date()}
                                    initialFocus
                                />
                            </PopoverContent>
                        </Popover>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting || success}>
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Creating...
                                </>
                            ) : success ? (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Created!
                                </>
                            ) : (
                                "Create Project"
                            )}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
