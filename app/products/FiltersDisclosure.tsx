"use client";

import { useEffect, useRef } from "react";

/** Filters fold away on phones and stay open beside the grid on wide screens. */
export function FiltersDisclosure({
  summary,
  className,
  summaryClassName,
  children,
}: {
  summary: string;
  className?: string;
  summaryClassName?: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => {
      if (ref.current && mq.matches) ref.current.open = true;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return (
    <details ref={ref} className={className}>
      <summary className={summaryClassName}>{summary}</summary>
      {children}
    </details>
  );
}
