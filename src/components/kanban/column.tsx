import { SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Column, Task } from "@/types/kanban";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus } from "lucide-react";
import { TaskCard } from "./task-card";
import { useMemo, useState } from "react";
import { AddTaskModal } from "./add-task-modal";

interface Props {
    column: Column;
    tasks: Task[];
    onTaskClick?: (task: Task) => void;
}

export function KanbanColumn({ column, tasks, onTaskClick }: Props) {
    const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column,
        },
    });

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    };

    const tasksIds = useMemo(() => tasks.map((t) => t.id), [tasks]);

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-muted/50 w-[300px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-40 border-2 border-primary border-dashed"
            ></div>
        );
    }

    return (
        <>
            <div
                ref={setNodeRef}
                style={style}
                className="bg-muted/30 w-[300px] min-w-[300px] rounded-lg flex flex-col h-full max-h-[calc(100vh-14rem)]"
            >
                <div
                    {...attributes}
                    {...listeners}
                    className="p-4 cursor-grab hover:bg-muted/50 rounded-t-lg transition-colors flex items-center justify-between"
                >
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{column.title}</h3>
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-background/50 text-xs font-medium text-muted-foreground">
                            {tasks.length}
                        </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-3">
                    <SortableContext items={tasksIds}>
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                        ))}
                    </SortableContext>
                </div>

                <div className="p-3">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-muted-foreground hover:text-primary"
                        onClick={() => setIsAddTaskOpen(true)}
                    >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Task
                    </Button>
                </div>
            </div>

            <AddTaskModal
                open={isAddTaskOpen}
                onClose={() => setIsAddTaskOpen(false)}
                columnId={column.id.toString()}
            />
        </>
    );
}

