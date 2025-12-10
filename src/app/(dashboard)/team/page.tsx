"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Search, Plus, Mail, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { getUsers, User } from "@/lib/api/users";
import { getDivisions, Division } from "@/lib/api/divisions";

export default function TeamPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [divisions, setDivisions] = useState<Division[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDivision, setSelectedDivision] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [usersData, divisionsData] = await Promise.all([
                    getUsers(),
                    getDivisions()
                ]);
                setUsers(usersData);
                setDivisions(divisionsData);
            } catch (error) {
                console.error("Failed to load team data:", error);
                // Use mock data as fallback
                setUsers([
                    { id: "1", name: "Muhammad Rifqi", email: "rifqi@alfath.org", role: "admin", division_id: "presidium", division_name: "Presidium Inti" },
                    { id: "2", name: "Aisyah Putri", email: "aisyah@alfath.org", role: "user", division_id: "presidium", division_name: "Presidium Inti" },
                    { id: "3", name: "Budi Santoso", email: "budi@alfath.org", role: "user", division_id: "pai", division_name: "Tutorial PAI" },
                    { id: "4", name: "Fajar Siddiq", email: "fajar@alfath.org", role: "user", division_id: "pai", division_name: "Tutorial PAI" },
                    { id: "5", name: "Nadia Rahma", email: "nadia@alfath.org", role: "user", division_id: "spai", division_name: "Tutorial SPAI" },
                    { id: "6", name: "Rizky Pratama", email: "rizky@alfath.org", role: "user", division_id: "bk", division_name: "Bina Kader" },
                ]);
                setDivisions([
                    { id: "presidium", name: "Presidium Inti", color: "bg-primary/10 border-primary" },
                    { id: "pai", name: "Tutorial PAI", color: "bg-blue-500/10 border-blue-500" },
                    { id: "spai", name: "Tutorial SPAI", color: "bg-indigo-500/10 border-indigo-500" },
                    { id: "bk", name: "Bina Kader", color: "bg-amber-500/10 border-amber-500" },
                    { id: "syiar", name: "Syiar & Media", color: "bg-emerald-500/10 border-emerald-500" },
                ]);
            } finally {
                setIsLoading(false);
            }
        }
        loadData();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesDivision = selectedDivision === "all" || user.division_id === selectedDivision;
        return matchesSearch && matchesDivision;
    });

    const getRoleBadgeVariant = (role: string) => {
        switch (role) {
            case "superadmin": return "destructive";
            case "admin": return "default";
            default: return "secondary";
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case "superadmin": return "Super Admin";
            case "admin": return "Admin";
            default: return "Member";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-foreground">Team</h2>
                    <p className="text-muted-foreground">Manage team members across all divisions.</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" /> Invite Member
                </Button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-10"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <Select value={selectedDivision} onValueChange={setSelectedDivision}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                        <SelectValue placeholder="Filter by division" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Divisions</SelectItem>
                        {divisions.map((div) => (
                            <SelectItem key={div.id} value={div.id}>{div.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                                <p className="text-2xl font-bold">{users.length}</p>
                            </div>
                            <Users className="h-8 w-8 text-primary/20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Divisions</p>
                                <p className="text-2xl font-bold">{divisions.length}</p>
                            </div>
                            <Shield className="h-8 w-8 text-primary/20" />
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Admins</p>
                                <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin' || u.role === 'superadmin').length}</p>
                            </div>
                            <Shield className="h-8 w-8 text-primary/20" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Team Grid */}
            {isLoading ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-full bg-muted" />
                                    <div className="space-y-2">
                                        <div className="h-4 w-24 bg-muted rounded" />
                                        <div className="h-3 w-32 bg-muted rounded" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : filteredUsers.length === 0 ? (
                <Card className="py-12">
                    <CardContent className="text-center text-muted-foreground">
                        <Users className="mx-auto h-12 w-12 mb-4 opacity-20" />
                        <p>No team members found.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {filteredUsers.map((user, index) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <Card className="hover:shadow-md transition-all duration-200 group">
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-4">
                                            <Avatar className="h-12 w-12 border-2 border-muted">
                                                <AvatarImage src={user.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-primary">
                                                    {user.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold group-hover:text-primary transition-colors">
                                                    {user.name}
                                                </p>
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <Mail className="h-3 w-3" />
                                                    {user.email}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={getRoleBadgeVariant(user.role)}>
                                            {getRoleLabel(user.role)}
                                        </Badge>
                                    </div>
                                    {user.division_name && (
                                        <div className="mt-4 pt-4 border-t">
                                            <p className="text-xs text-muted-foreground">Division</p>
                                            <p className="text-sm font-medium">{user.division_name}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
