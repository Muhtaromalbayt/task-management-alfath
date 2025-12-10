"use client";

import { DataTable } from "@/components/tasks/data-table";
import { columns } from "@/components/tasks/columns";
import { useBoardStore } from "@/stores/use-board-store";

export default function TasksPage() {
    const { tasks } = useBoardStore();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">My Tasks</h2>
                <p className="text-muted-foreground">Manage all your assigned tasks across projects.</p>
            </div>

            <div className="bg-background/50 backdrop-blur-sm rounded-lg border p-4">
                <DataTable columns={columns} data={tasks} />
            </div>
        </div>
    );
}
