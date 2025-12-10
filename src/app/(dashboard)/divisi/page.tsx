"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Users, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const divisions = [
    {
        id: "presidium",
        name: "Presidium Inti",
        description: "Core leadership and strategic direction.",
        members: [
            { name: "Muhammad Rifqi", role: "Ketua Umum", avatar: "MR" },
            { name: "Aisyah Putri", role: "Sekretaris Umum", avatar: "AP" },
            { name: "Budi Santoso", role: "Bendahara Umum", avatar: "BS" },
        ],
        color: "bg-primary/10 border-primary",
    },
    {
        id: "pai",
        name: "Tutorial PAI",
        description: "Managing Islamic Education tutorial programs.",
        members: [
            { name: "Fajar Siddiq", role: "Ketua Divisi", avatar: "FS" },
            { name: "Nadia Rahma", role: "Sekretaris Divisi", avatar: "NR" },
        ],
        color: "bg-blue-500/10 border-blue-500",
    },
    {
        id: "spai",
        name: "Tutorial SPAI",
        description: "Specialized Islamic Education tutorial programs.",
        members: [
            { name: "Rizky Pratama", role: "Ketua Divisi", avatar: "RP" },
            { name: "Dina Aulia", role: "Staff", avatar: "DA" },
        ],
        color: "bg-indigo-500/10 border-indigo-500",
    },
    {
        id: "bk",
        name: "Bina Kader",
        description: "Cadre development and training.",
        members: [
            { name: "Hasan Basri", role: "Ketua Divisi", avatar: "HB" },
            { name: "Umar Faruq", role: "Staff", avatar: "UF" },
        ],
        color: "bg-amber-500/10 border-amber-500",
    },
    {
        id: "syiar",
        name: "Syiar & Media",
        description: "Public relations and media management.",
        members: [
            { name: "Zahra Amalia", role: "Ketua Divisi", avatar: "ZA" },
            { name: "Tariq Ibrahim", role: "Creative Lead", avatar: "TI" },
        ],
        color: "bg-emerald-500/10 border-emerald-500",
    },
    {
        id: "rt",
        name: "Rumah Tangga",
        description: "Secretariat management and logistics.",
        members: [
            { name: "Siti Aminah", role: "Ketua Divisi", avatar: "SA" },
        ],
        color: "bg-pink-500/10 border-pink-500",
    },
];

export default function DivisiPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-bold tracking-tight text-foreground">Organizational Structure</h2>
                <p className="text-muted-foreground">
                    Al-FATH Cabinet 2025-2026 Structure and Divisions.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {divisions.map((division, index) => (
                    <motion.div
                        key={division.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                    >
                        <Card className={`h-full hover:shadow-lg transition-all duration-300 border-t-4 ${division.color}`}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <CardTitle className="text-xl">{division.name}</CardTitle>
                                        <CardDescription>{division.description}</CardDescription>
                                    </div>
                                    <Badge variant="secondary" className="bg-background/50">
                                        {division.members.length} Members
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Key Members</span>
                                    </div>
                                    <div className="flex flex-col gap-3">
                                        {division.members.map((member, i) => (
                                            <div key={i} className="flex items-center justify-between bg-background/50 p-2 rounded-md">
                                                <div className="flex items-center gap-3">
                                                    <Avatar className="h-8 w-8">
                                                        <AvatarFallback className="text-xs">{member.avatar}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="space-y-0.5">
                                                        <p className="text-sm font-medium leading-none">{member.name}</p>
                                                        <p className="text-xs text-muted-foreground">{member.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <Button variant="ghost" className="w-full mt-2 group text-primary">
                                        View Details
                                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
