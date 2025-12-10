"use client";

export const runtime = 'edge';

import { useEffect, useState, use } from "react";
import { KanbanBoard } from "@/components/kanban/board";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Filter, Loader2, Plus, Settings, Share2, Users, ArrowLeft } from "lucide-react";
import { useBoardStore } from "@/stores/use-board-store";
import { getProject, ProjectWithDetails } from "@/lib/api/projects";
import Link from "next/link";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectDetailsPage({ params }: PageProps) {
    const resolvedParams = use(params);
    const { fetchProject, isLoading: boardLoading, error: boardError } = useBoardStore();
    const [project, setProject] = useState<ProjectWithDetails | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function loadProject() {
            setIsLoading(true);
            setError(null);

            try {
                const data = await getProject(resolvedParams.id);
                setProject(data);

                // Load board data via store
                await fetchProject(resolvedParams.id);
            } catch (err) {
                console.error("Failed to load project:", err);
                setError(err instanceof Error ? err.message : "Failed to load project");
            } finally {
                setIsLoading(false);
            }
        }

        loadProject();
    }, [resolvedParams.id, fetchProject]);

    const getStatusColor = (status?: string) => {
        switch (status) {
            case "In Progress":
                return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400";
            case "Completed":
                return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
            case "On Hold":
                return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
            default:
                return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400";
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-[calc(100vh-6rem)]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                    <p className="text-muted-foreground">Loading project...</p>
                </div>
            </div>
        );
    }

    if (error || !project) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-6rem)]">
                <div className="text-center space-y-4">
                    <p className="text-destructive">{error || "Project not found"}</p>
                    <Button asChild variant="outline">
                        <Link href="/projects">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to Projects
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)]">
            {/* Project Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                            <Link href="/projects">
                                <ArrowLeft className="h-4 w-4" />
                            </Link>
                        </Button>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">{project.title}</h1>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                        </span>
                    </div>
                    <p className="text-muted-foreground text-sm ml-11">{project.description || "No description"}</p>
                </div>

                <div className="flex items-center gap-3">
                    {project.members && project.members.length > 0 && (
                        <>
                            <div className="flex -space-x-2 mr-2">
                                {project.members.slice(0, 3).map((member, i) => (
                                    <Avatar key={member.id} className="h-8 w-8 border-2 border-background">
                                        <AvatarImage src={member.avatar} />
                                        <AvatarFallback className="text-xs">
                                            {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                        </AvatarFallback>
                                    </Avatar>
                                ))}
                                {project.members.length > 3 && (
                                    <Avatar className="h-8 w-8 border-2 border-background">
                                        <AvatarFallback className="bg-accent/20 text-accent-foreground text-xs">
                                            +{project.members.length - 3}
                                        </AvatarFallback>
                                    </Avatar>
                                )}
                            </div>
                            <div className="h-8 w-px bg-border hidden md:block" />
                        </>
                    )}
                    <Button variant="outline" size="sm" className="hidden md:flex">
                        <Users className="mr-2 h-4 w-4" />
                        Team
                    </Button>
                    <Button variant="outline" size="sm">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                </div>
            </div>

            {/* Board Layout */}
            <div className="flex-1 overflow-hidden rounded-lg border bg-background/50 backdrop-blur-sm -mx-4 md:mx-0">
                {/* Board Toolbar */}
                <div className="flex items-center justify-between p-3 border-b bg-background/50">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Filter className="mr-2 h-3.5 w-3.5" />
                            Filter
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Calendar className="mr-2 h-3.5 w-3.5" />
                            Timeline
                        </Button>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                            <Share2 className="mr-2 h-3.5 w-3.5" />
                            Share
                        </Button>
                    </div>
                </div>

                {/* Kanban Board Area */}
                <div className="h-full p-4 bg-muted/20">
                    {boardLoading ? (
                        <div className="flex items-center justify-center h-64">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                        </div>
                    ) : boardError ? (
                        <div className="flex items-center justify-center h-64 text-destructive">
                            {boardError}
                        </div>
                    ) : (
                        <KanbanBoard />
                    )}
                </div>
            </div>
        </div>
    );
}
