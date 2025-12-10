"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Task } from "@/types/kanban";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Helper to map columnId to readable status
const getStatus = (columnId: string | number) => {
    const map: Record<string, string> = {
        todo: "To Do",
        "in-progress": "In Progress",
        review: "Review",
        done: "Done",
    };
    return map[columnId.toString()] || columnId;
};

export const columns: ColumnDef<Task>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "id",
        header: "Task ID",
        cell: ({ row }) => <div className="w-[80px]">#{row.getValue("id")}</div>,
    },
    {
        accessorKey: "content",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div className="font-medium">{row.getValue("content")}</div>,
    },
    {
        accessorKey: "columnId",
        header: "Status",
        cell: ({ row }) => {
            const status = getStatus(row.getValue("columnId"));
            return (
                <Badge variant="outline" className="capitalize">
                    {status}
                </Badge>
            );
        },
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => {
            const priority = row.getValue("priority") as string;
            const color = {
                Low: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
                Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
                High: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
            }[priority] || "bg-slate-100 text-slate-700";

            return (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
                    {priority}
                </span>
            );
        },
    },
    {
        accessorKey: "assignee",
        header: "Assignee",
        cell: ({ row }) => <div>{row.getValue("assignee") || "Unassigned"}</div>,
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const task = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(task.id.toString())}
                        >
                            Copy task ID
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View details</DropdownMenuItem>
                        <DropdownMenuItem>Edit task</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
];
