const preview = process.env.VERCEL_ENV === "preview";

export function courseCollection(name) {
    return preview ? `preview_${name}` : name;
}

export const courseFilesRoot = preview ? "course-preview" : "course";
