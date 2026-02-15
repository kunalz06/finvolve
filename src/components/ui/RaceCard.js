import { motion } from "framer-motion";

export default function RaceCard({ children, className = "", delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay }}
            viewport={{ once: true }}
            className={`relative group bg-[#111] border-t-2 border-primary border-b border-l border-r border-white/10 p-6 overflow-hidden ${className}`}
            style={{
                clipPath: "polygon(20px 0, 100% 0, 100% calc(100% - 20px), calc(100% - 20px) 100%, 0 100%, 0 20px)"
            }}
        >
            {/* Carbon Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(black_15%,transparent_16%)_0_0,radial-gradient(black_15%,transparent_16%)_8px_8px,radial-gradient(rgba(255,255,255,.1)_15%,transparent_20%)_0_1px,radial-gradient(rgba(255,255,255,.1)_15%,transparent_20%)_8px_9px] bg-[length:16px_16px] pointer-events-none" />

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

            {/* Content */}
            <div className="relative z-10 text-foreground">
                {children}
            </div>

            {/* Corner Accents */}
            <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-primary/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-primary/50" />
        </motion.div>
    );
}
