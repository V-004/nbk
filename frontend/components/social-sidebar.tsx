"use client";

import {
    Facebook,
    Twitter,
    Linkedin,
    Share2,
    Link2,
    Check
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function SocialSidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const currentUrl = window.location.href;
    const shareText = "Check out NexusBank - The Future of Contactless Banking!";

    const handleCopy = () => {
        navigator.clipboard.writeText(currentUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const socialLinks = [
        {
            icon: Facebook,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
            color: "bg-[#1877F2] hover:bg-[#1877F2]/90",
            label: "Facebook"
        },
        {
            icon: Twitter,
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`,
            color: "bg-[#1DA1F2] hover:bg-[#1DA1F2]/90",
            label: "Twitter"
        },
        {
            icon: Linkedin,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
            color: "bg-[#0A66C2] hover:bg-[#0A66C2]/90",
            label: "LinkedIn"
        },
    ];

    return (
        <div className={cn(
            "fixed right-0 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3 transition-transform duration-500 ease-spring",
            isOpen ? "translate-x-0" : "translate-x-[calc(100%-12px)]" // Peek out slightly
        )}>
            {/* Toggle Handle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="absolute left-0 top-1/2 -translate-x-full -translate-y-1/2 bg-background/80 backdrop-blur-md border border-r-0 border-border p-3 rounded-l-xl shadow-lg hover:bg-accent transition-colors group"
                aria-label="Toggle Sharing"
            >
                <Share2 className={cn("h-5 w-5 text-primary transition-transform duration-500", isOpen && "rotate-180")} />
            </button>

            {/* Icons Container */}
            <div className="flex flex-col gap-3 p-4 bg-background/90 backdrop-blur-xl border-l border-y border-border rounded-l-2xl shadow-2xl relative overflow-hidden group/container">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

                {socialLinks.map((social) => (
                    <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                            "relative p-3 rounded-full text-white shadow-md transition-all duration-300 hover:scale-110 hover:-translate-x-1 hover:shadow-xl flex items-center justify-center group",
                            social.color
                        )}
                        title={`Share on ${social.label}`}
                    >
                        <social.icon className="h-5 w-5 relative z-10" />
                        <span className="absolute right-full mr-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-sm font-medium border">
                            {social.label}
                        </span>
                    </a>
                ))}

                {/* Copy Link Button */}
                <button
                    onClick={handleCopy}
                    className="relative p-3 rounded-full bg-zinc-700 dark:bg-zinc-800 text-white shadow-md transition-all duration-300 hover:scale-110 hover:-translate-x-1 hover:shadow-xl flex items-center justify-center group"
                    title="Copy Link"
                >
                    {copied ? <Check className="h-5 w-5 text-green-400" /> : <Link2 className="h-5 w-5" />}
                    <span className="absolute right-full mr-3 px-2 py-1 bg-popover text-popover-foreground text-xs rounded opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap shadow-sm font-medium border">
                        {copied ? "Copied!" : "Copy Link"}
                    </span>
                </button>
            </div>
        </div>
    );
}
