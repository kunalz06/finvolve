import { motion } from "framer-motion";
import Link from "next/link";

export default function RaceButton({ href, children, className = "", onClick, variant = "primary" }) {
    const baseStyles = "f1-btn relative inline-flex items-center justify-center px-8 py-3 font-bold text-sm tracking-widest uppercase transition-all duration-300";

    const variants = {
        primary: "bg-primary text-white hover:bg-white hover:text-black hover:shadow-neon-red",
        secondary: "bg-transparent border border-white/20 text-white hover:border-primary hover:text-primary hover:shadow-neon-red",
        accent: "bg-accent text-black hover:bg-white hover:shadow-neon-yellow"
    };

    const content = (
        <>
            <span className="relative z-10 block skew-x-[12deg]">{children}</span>
            {/* Speed Line Effect on Hover */}
            <div className="absolute inset-0 overflow-hidden skew-x-[12deg]">
                <div className="absolute top-0 left-[-100%] w-full h-full bg-white/20 -skew-x-12 transform group-hover:translate-x-[200%] transition-transform duration-500 ease-out" />
            </div>
        </>
    );

    if (href) {
        return (
            <Link href={href} className={`${baseStyles} ${variants[variant]} ${className} group`}>
                {content}
            </Link>
        );
    }

    return (
        <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className} group`}
        >
            {content}
        </motion.button>
    );
}
