"use client";

import { useEffect, useState } from "react";
import { courseApiUrl } from "@/lib/api";

export default function usePublicCourseSettings() {
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch(courseApiUrl(), { signal: controller.signal, cache: "no-store" })
      .then((response) => response.ok ? response.json() : { published: false })
      .then(setSettings)
      .catch(() => {
        if (!controller.signal.aborted) setSettings({ published: false });
      });
    return () => controller.abort();
  }, []);

  return settings;
}
