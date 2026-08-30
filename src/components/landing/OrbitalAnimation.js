"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Code, Database, Globe, Smartphone, Zap } from "lucide-react";
import { useEffect } from "react";

const Nodes = [
    { id: 1, icon: Code, label: "Frontend", color: "#6366F1", delay: 0 },
    { id: 2, icon: Database, label: "Backend", color: "#A855F7", delay: 1.5 },
    { id: 3, icon: Smartphone, label: "Mobile", color: "#EC4899", delay: 3 },
    { id: 4, icon: Globe, label: "Web", color: "#10B981", delay: 4.5 },
    { id: 5, icon: Zap, label: "Performance", color: "#F59E0B", delay: 6 },
];

export default function OrbitalAnimation() {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 20, stiffness: 50 };
    const rotateX = useSpring(useTransform(mouseY, [-1, 1], [10, -10]), springConfig);
    const rotateY = useSpring(useTransform(mouseX, [-1, 1], [-10, 10]), springConfig);

    useEffect(() => {
        const handleMouseMove = (e) => {
            // Normalize coordinates to -1 to 1
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = (e.clientY / window.innerHeight) * 2 - 1;

            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <div className="relative w-full h-[350px] md:h-[500px] flex items-center justify-center perspective-1000 overflow-hidden">
            {/* Background Glows */}
            <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent opacity-50 blur-3xl animate-pulse-slow" />

            <motion.div
                className="relative w-[400px] h-[400px] preserve-3d scale-[0.6] sm:scale-[0.8] md:scale-100 origin-center"
                style={{
                    rotateX,
                    rotateY,
                }}
            >
                {/* Central Core */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full blur-md opacity-50 animate-pulse" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.5)] z-10">
                    <span className="text-2xl">🚀</span>
                </div>

                {/* Orbit Path Visuals */}
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 animate-[spin_20s_linear_infinite]">
                    <ellipse cx="200" cy="200" rx="180" ry="80" fill="none" stroke="url(#orbitGradient)" strokeWidth="1" />
                    <ellipse cx="200" cy="200" rx="180" ry="80" fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 20" transform="rotate(60 200 200)" />
                    <ellipse cx="200" cy="200" rx="180" ry="80" fill="none" stroke="white" strokeWidth="1" strokeDasharray="5 15" transform="rotate(-60 200 200)" />
                    <defs>
                        <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#6366F1" stopOpacity="0" />
                            <stop offset="50%" stopColor="#A855F7" stopOpacity="1" />
                            <stop offset="100%" stopColor="#EC4899" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                </svg>

                {/* Orbiting Nodes */}
                {Nodes.map((node, i) => (
                    <OrbitingNode key={node.id} node={node} index={i} total={Nodes.length} />
                ))}
            </motion.div>
        </div>
    );
}

function OrbitingNode({ node, index, total }) {
    // Simple circular orbit logic for demonstration, enhanced with Framer Motion layout
    // In a real sophisticated version, we'd use Lissajous or true 3D coordinates.
    // Here we use CSS animation on a wrapper for the orbit, and counter-rotation for the child.

    const angle = (360 / total) * index;

    return (
        <motion.div
            className="absolute top-1/2 left-1/2 w-[360px] h-[360px] -ml-[180px] -mt-[180px] pointer-events-none"
            initial={{ rotate: angle }}
            animate={{ rotate: angle + 360 }}
            transition={{ duration: 20, ease: "linear", repeat: Infinity }}
        >
            <motion.div
                className="absolute top-0 left-1/2 -ml-6 -mt-6 w-12 h-12"
                initial={{ rotate: -angle }}
                animate={{ rotate: -(angle + 360) }}
                transition={{ duration: 20, ease: "linear", repeat: Infinity }}
            >
                <motion.div
                    className="group relative w-12 h-12 bg-gray-900/80 backdrop-blur-md border border-white/10 rounded-full flex items-center justify-center cursor-pointer pointer-events-auto hover:scale-125 transition-transform duration-300"
                    style={{ boxShadow: `0 0 15px ${node.color}40`, borderColor: node.color }}
                    whileHover={{ scale: 1.2, borderColor: '#fff' }}
                >
                    <node.icon size={20} color={node.color} />

                    {/* Tooltip */}
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs font-mono bg-black/80 px-2 py-1 rounded border border-white/10 whitespace-nowrap">
                        {node.label}
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
