"use client";

import { useState } from "react";
import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    closestCorners,
    DragStartEvent,
    DragEndEvent,
    DragOverEvent
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { KanbanColumn } from "@/components/kanban/column";
import { TaskCard } from "@/components/kanban/task-card";
import { TaskModal } from "@/components/kanban/task-modal";
import { Column, Task } from "@/types/kanban";
import { createPortal } from "react-dom";
import { useBoardStore } from "@/stores/use-board-store";

export function KanbanBoard() {
    const { columns, tasks, setColumns, setTasks } = useBoardStore();
    const [activeColumn, setActiveColumn] = useState<Column | null>(null);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10,
            },
        })
    );

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column);
            return;
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task);
            return;
        }
    }

    function onDragEnd(event: DragEndEvent) {
        setActiveColumn(null);
        setActiveTask(null);

        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        // Dragging Column
        if (active.data.current?.type === "Column") {
            const activeColumnIndex = columns.findIndex((col) => col.id === activeId);
            const overColumnIndex = columns.findIndex((col) => col.id === overId);
            setColumns(arrayMove(columns, activeColumnIndex, overColumnIndex));
        }
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveTask = active.data.current?.type === "Task";
        const isOverTask = over.data.current?.type === "Task";

        if (!isActiveTask) return;

        // Dropping Task over another Task
        if (isActiveTask && isOverTask) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);

            if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
                // Update columnId for the dragged task
                const updatedTasks = [...tasks];
                updatedTasks[activeIndex] = {
                    ...updatedTasks[activeIndex],
                    columnId: tasks[overIndex].columnId
                };
                setTasks(arrayMove(updatedTasks, activeIndex, overIndex));
            } else {
                setTasks(arrayMove(tasks, activeIndex, overIndex));
            }
        }

        // Dropping Task over a Column
        const isOverColumn = over.data.current?.type === "Column";
        if (isActiveTask && isOverColumn) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const updatedTasks = [...tasks];
            updatedTasks[activeIndex] = {
                ...updatedTasks[activeIndex],
                columnId: overId.toString()
            };
            // Ensure rerender by updating references
            setTasks(arrayMove(updatedTasks, activeIndex, activeIndex));
        }
    }

    function onTaskClick(task: Task) {
        setActiveTask(task);
        setIsModalOpen(true);
    }

    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="flex h-full min-h-[calc(100vh-12rem)] w-full overflow-x-auto overflow-y-hidden px-4 pb-4">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className="flex gap-4">
                    <SortableContext items={columns.map((col) => col.id)}>
                        {columns.map((col) => (
                            <KanbanColumn
                                key={col.id}
                                column={col}
                                tasks={tasks.filter((task) => task.columnId === col.id)}
                                onTaskClick={onTaskClick}
                            />
                        ))}
                    </SortableContext>
                </div>

                {createPortal(
                    <DragOverlay>
                        {activeColumn && (
                            <KanbanColumn
                                column={activeColumn}
                                tasks={tasks.filter((task) => task.columnId === activeColumn.id)}
                            />
                        )}
                        {activeTask && !isModalOpen && <TaskCard task={activeTask} />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>

            <TaskModal
                task={activeTask}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={(updatedTask) => {
                    // Update task in store
                    const taskIndex = tasks.findIndex((t) => t.id === updatedTask.id);
                    if (taskIndex !== -1) {
                        const newTasks = [...tasks];
                        newTasks[taskIndex] = updatedTask;
                        setTasks(newTasks);
                    }
                    setIsModalOpen(false);
                }}
            />
        </div>
    );
}
