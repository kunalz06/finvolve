"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import Button from "./ui/Button";

const STORAGE_KEY = "dev-theme";

function getInitialTheme() {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function ThemeToggle({ compact = false }) {
  const [theme, setTheme] = useState("light");
  const isDark = theme === "dark";
  const Icon = isDark ? Sun : Moon;

  useEffect(() => {
    const initialTheme = getInitialTheme();
    setTheme(initialTheme);
    document.documentElement.dataset.theme = initialTheme;
  }, []);

  const toggleTheme = () => {
    const nextTheme = isDark ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  };

  return (
    <Button
      type="button"
      onClick={toggleTheme}
      variant="secondary"
      size="small"
      className={`theme-toggle rounded-full ${compact ? "h-11 w-11 justify-center px-0" : "px-3 py-2 text-xs font-bold uppercase"}`}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      <Icon size={17} />
      {!compact && <span>{isDark ? "Light" : "Dark"}</span>}
    </Button>
  );
}
