"use client";

import { motion } from "framer-motion";
import { Activity, Server, Cpu, Globe, Wifi, Database } from "lucide-react";
import RaceCard from "@/components/ui/RaceCard";
import RaceButton from "@/components/ui/RaceButton";

const stats = [
    { label: "System Uptime", value: "99.9%", icon: Server, color: "text-green-500" },
    { label: "Network Latency", value: "24ms", icon: Wifi, color: "text-blue-500" },
    { label: "CPU Load", value: "12%", icon: Cpu, color: "text-orange-500" },
    { label: "Active Sessions", value: "1,204", icon: Globe, color: "text-primary" },
];

export default function TelemetryPage() {
    return (
        <div className="min-h-screen pt-24 pb-20 container mx-auto px-6">
            <div className="mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-primary/30 bg-primary/10 mb-4 skew-x-[-12deg]">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse skew-x-[12deg]" />
                    <span className="text-primary font-mono text-xs uppercase tracking-widest skew-x-[12deg]">Live Data Stream</span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold font-heading italic uppercase text-white mb-4">
                    Mission Control
                </h1>
                <p className="text-xl text-gray-400 max-w-2xl border-l-4 border-primary pl-6">
                    Real-time performance metrics and system status. Finvolve engineering monitors every pixel to ensure maximum velocity.
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                {stats.map((stat, i) => (
                    <RaceCard key={i} className="p-6 flex flex-col items-center text-center border-white/10">
                        <stat.icon className={`mb-4 ${stat.color}`} size={32} />
                        <div className="text-3xl font-bold font-heading italic text-white mb-1">{stat.value}</div>
                        <div className="text-xs font-mono text-gray-500 uppercase tracking-wider">{stat.label}</div>
                    </RaceCard>
                ))}
            </div>

            {/* Main Dashboard Area */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Column: Log */}
                <div className="lg:col-span-1">
                    <RaceCard className="h-full border-primary/20">
                        <h3 className="text-xl font-bold font-heading italic uppercase mb-6 flex items-center gap-2">
                            <Activity size={20} className="text-primary" /> System Logs
                        </h3>
                        <div className="space-y-4 font-mono text-xs text-gray-400 max-h-[400px] overflow-y-auto custom-scrollbar">
                            {[...Array(10)].map((_, i) => (
                                <div key={i} className="flex gap-3 border-b border-white/5 pb-2">
                                    <span className="text-primary">[10:{24 + i}:05]</span>
                                    <span>System check complete. All systems green. Optimization algorithms active.</span>
                                </div>
                            ))}
                        </div>
                    </RaceCard>
                </div>

                {/* Right Column: Visualization placeholder */}
                <div className="lg:col-span-2">
                    <RaceCard className="h-full min-h-[400px] flex items-center justify-center relative overflow-hidden group">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                        <div className="relative z-10 text-center">
                            <Database size={64} className="mx-auto text-gray-600 mb-4 group-hover:text-primary transition-colors duration-500" />
                            <h3 className="text-2xl font-bold font-heading italic uppercase text-white mb-2">Core Database</h3>
                            <p className="text-gray-500 font-mono text-sm">Encrypted • Distributed • Fast</p>
                        </div>
                        {/* Decorative scanning line */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-primary/50 shadow-[0_0_15px_rgba(255,24,1,0.5)] animate-scan-down" />
                    </RaceCard>
                </div>
            </div>

            <div className="mt-12 text-center">
                <RaceButton href="/finvolve/contact" variant="primary">
                    Request Access
                </RaceButton>
            </div>
        </div>
    );
}
