"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, MoreVertical, Calendar, Users, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { getProjects, Project } from "@/lib/api/projects";
import { NewProjectModal } from "@/components/projects/new-project-modal";

// Fallback mock data
const mockProjects = [
    {
        id: "proj-001",
        title: "Website Redesign",
        description: "Revamp the main company website with new branding.",
        status: "In Progress" as const,
        due_date: "2025-12-31",
        member_count: 4,
        progress: 65,
    },
    {
        id: "proj-002",
        title: "Mobile App Development",
        description: "Create a cross-platform mobile app for clients.",
        status: "Planning" as const,
        due_date: "2026-01-15",
        member_count: 6,
        progress: 10,
    },
    {
        id: "proj-003",
        title: "Marketing Campaign",
        description: "Q1 2026 marketing strategy and execution.",
        status: "Completed" as const,
        due_date: "2025-11-30",
        member_count: 3,
        progress: 100,
    },
];

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

    async function loadProjects() {
        try {
            const data = await getProjects();
            setProjects(data);
        } catch (error) {
            console.error("Failed to load projects:", error);
            // Use mock data as fallback
            setProjects(mockProjects);
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        loadProjects();
    }, []);

    const formatDate = (dateStr?: string) => {
        if (!dateStr) return "No due date";
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Projects</h2>
                    <p className="text-muted-foreground">Manage your ongoing projects and boards.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90" onClick={() => setIsNewProjectOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Project
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link href={`/projects/${project.id}`}>
                                <Card className="hover:shadow-lg transition-all duration-300 border-t-4 border-t-transparent hover:border-t-primary cursor-pointer group">
                                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                        <div className="space-y-1">
                                            <CardTitle className="text-lg font-bold group-hover:text-primary transition-colors">
                                                {project.title}
                                            </CardTitle>
                                            <CardDescription className="line-clamp-2">
                                                {project.description}
                                            </CardDescription>
                                        </div>
                                        <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                                            <Calendar className="h-4 w-4" />
                                            <span>Due {formatDate(project.due_date)}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                                            <Users className="h-4 w-4" />
                                            <span>{project.member_count || 0} Team Members</span>
                                        </div>

                                        <div className="mt-4 space-y-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span>Progress</span>
                                                <span>{project.progress}%</span>
                                            </div>
                                            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-primary transition-all duration-500"
                                                    style={{ width: `${project.progress}%` }}
                                                />
                                            </div>
                                        </div>
                                    </CardContent>
                                    <CardFooter className="pt-2">
                                        <Badge variant={project.status === "Completed" ? "default" : "secondary"}>
                                            {project.status}
                                        </Badge>
                                    </CardFooter>
                                </Card>
                            </Link>
                        </motion.div>
                    ))}

                    {/* New Project Placeholder Card */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: projects.length * 0.1 }}
                    >
                        <button
                            className="w-full h-full min-h-[250px] border-2 border-dashed border-muted-foreground/25 rounded-xl flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 gap-4"
                            onClick={() => setIsNewProjectOpen(true)}
                        >
                            <div className="p-4 bg-background rounded-full shadow-sm">
                                <Plus className="h-6 w-6" />
                            </div>
                            <span className="font-medium">Create New Project</span>
                        </button>
                    </motion.div>
                </div>
            )}

            <NewProjectModal
                open={isNewProjectOpen}
                onClose={() => setIsNewProjectOpen(false)}
                onSuccess={loadProjects}
            />
        </div>
    );
}
