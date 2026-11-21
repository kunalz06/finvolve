"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProjectWizard from "@/components/wizard/ProjectWizard";

function RequestWizard() {
  const service = useSearchParams().get("service");
  return <ProjectWizard key={service} service={service} />;
}

export default function RequestPage() {
  return (
    <div className="min-h-screen px-6 py-12">
      <div id="project-wizard" className="container scroll-mt-24">
        <Suspense fallback={<p role="status">Loading project request…</p>}>
          <RequestWizard />
        </Suspense>
      </div>
    </div>
  );
}
