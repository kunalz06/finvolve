import CourseLanding from "@/components/course/CourseLanding";

export const metadata = {
    title: "Professional Technology Training Program | DEV Infinity",
    description: "Learn Machine Learning, Cybersecurity, and Software Stack through live classes, recordings, assignments, and practical projects.",
};

export default function CoursePage() {
    const allowDraft = process.env.NODE_ENV === "development" || process.env.VERCEL_ENV === "preview";
    return <CourseLanding allowDraft={allowDraft} />;
}
