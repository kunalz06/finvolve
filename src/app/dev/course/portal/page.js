import { Suspense } from "react";
import StudentPortal from "@/components/course/StudentPortal";

export const metadata = { title: "Student Portal | DEV Infinity", robots: { index: false, follow: false } };

export default function StudentPage() {
    return <Suspense fallback={<p role="status">Loading student portal…</p>}><StudentPortal /></Suspense>;
}
