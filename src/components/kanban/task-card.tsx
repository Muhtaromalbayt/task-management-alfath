import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Task } from "@/types/kanban";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface Props {
    task: Task;
    onClick?: (task: Task) => void; // Optional click handler
}

export function TaskCard({ task, onClick }: Props) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-50 bg-background p-4 rounded-lg border-2 border-primary h-[100px] cursor-grabbing"
            />
        );
    }

    const priorityColor = {
        Low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
        High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    }[task.priority];

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={() => onClick?.(task)}
            className="cursor-grab hover:ring-2 hover:ring-primary/20 hover:shadow-md transition-all active:cursor-grabbing"
        >
            <CardHeader className="p-3 pb-2 space-y-0">
                <div className="flex justify-between items-start gap-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${priorityColor}`}>
                        {task.priority}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="p-3 pt-0">
                <p className="text-sm font-medium leading-tight">{task.content}</p>
            </CardContent>
            <CardFooter className="p-3 pt-0 flex justify-between items-center">
                <span className="text-xs text-muted-foreground">#TASK-{task.id}</span>
                {task.assignee && (
                    <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {task.assignee}
                        </AvatarFallback>
                    </Avatar>
                )}
            </CardFooter>
        </Card>
    );
}
