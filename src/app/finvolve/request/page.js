"use client";

import ProjectWizard from '@/components/wizard/ProjectWizard';
import styles from './page.module.css';

export default function RequestPage() {
    return (
        <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-[url('/bg-grid.svg')] bg-fixed">
            <div className="deep-space-bg" />
            <div className="container mx-auto px-4">
                <ProjectWizard />
            </div>
        </div>
    );
}
