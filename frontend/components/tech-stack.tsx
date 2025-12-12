"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScanFace, Mic, ShieldCheck, FileText, CloudCog, Cpu } from "lucide-react";
import { motion } from "framer-motion";

const technologies = [
    {
        title: "Touch-Free ID",
        description: "Secure biometric authentication using advanced face recognition technology.",
        icon: ScanFace,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
    },
    {
        title: "AI Interaction",
        description: "Smart voice commands and intuitive conversational interfaces.",
        icon: Mic,
        color: "text-purple-500",
        bg: "bg-purple-500/10",
    },
    {
        title: "Core Banking",
        description: "Robust and scalable ledger management for real-time transactions.",
        icon: Cpu,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
    },
    {
        title: "Paperless Ops",
        description: "Complete digital transformation with automated document processing.",
        icon: FileText,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
    },
    {
        title: "Cloud & Security",
        description: "Enterprise-grade encryption and distributed cloud infrastructure.",
        icon: ShieldCheck,
        color: "text-red-500",
        bg: "bg-red-500/10",
    },
    {
        title: "Smart Analytics",
        description: "Real-time insights and predictive modeling for better financial decisions.",
        icon: CloudCog,
        color: "text-cyan-500",
        bg: "bg-cyan-500/10",
    },
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
        },
    },
};

const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
    },
};

export function TechStack() {
    return (
        <section className="container px-4 md:px-6 py-12 md:py-24 space-y-8">
            <div className="text-center space-y-4 max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                    Powered by Next-Gen Technology
                </h2>
                <p className="text-lg text-muted-foreground">
                    Experience the future of banking with our cutting-edge technology stack designed for security, speed, and seamless interaction.
                </p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
                {technologies.map((tech) => (
                    <motion.div key={tech.title} variants={itemVariants}>
                        <Card className="h-full border-muted/50 transition-all duration-300 hover:shadow-lg hover:border-primary/50 group overflow-hidden">
                            <CardHeader>
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-colors ${tech.bg} group-hover:scale-110 duration-300`}>
                                    <tech.icon className={`h-6 w-6 ${tech.color}`} />
                                </div>
                                <CardTitle className="text-xl group-hover:text-primary transition-colors">
                                    {tech.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground leading-relaxed">
                                    {tech.description}
                                </p>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
