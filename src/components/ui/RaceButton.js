"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Button({
    href,
    children,
    className = "",
    onClick,
    variant = "primary",
    size = "default",
    icon: Icon,
    ...props
}) {
    const baseStyles = "relative inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-300";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover shadow-button hover:shadow-lg",
        secondary: "bg-white text-gray-900 border border-gray-200 hover:border-primary hover:text-primary",
        outline: "bg-transparent text-primary border-2 border-primary hover:bg-primary hover:text-white",
        ghost: "bg-transparent text-gray-600 hover:text-primary hover:bg-gray-100",
    };

    const sizes = {
        small: "px-4 py-2 text-sm",
        default: "px-6 py-3 text-base",
        large: "px-8 py-4 text-lg",
    };

    const content = (
        <>
            {Icon && <Icon size={size === "small" ? 16 : size === "large" ? 24 : 20} />}
            <span>{children}</span>
        </>
    );

    const combinedClassName = cn(baseStyles, variants[variant], sizes[size], className);

    if (href) {
        return (
            <Link href={href} className={combinedClassName} {...props}>
                {content}
            </Link>
        );
    }

    return (
        <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={combinedClassName}
            {...props}
        >
            {content}
        </motion.button>
    );
}
