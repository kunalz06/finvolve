"use client";

import ProjectWizard from '@/components/wizard/ProjectWizard';

export default function RequestPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div id="project-wizard" className="container scroll-mt-24">
        <ProjectWizard />
      </div>
    </div>
  );
}
