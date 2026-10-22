import type { ReactNode } from "react";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  align?: "left" | "center";
  id?: string;
}

export function SectionHeading({ eyebrow, title, lede, align = "center", id }: SectionHeadingProps) {
  const alignCls = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  return (
    <Reveal className={`flex max-w-2xl flex-col gap-3 ${align === "center" ? "mx-auto" : ""}`}>
      <span
        className={`inline-flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.22em] text-royal-300 uppercase ${alignCls.split(" ").pop() ?? ""}`}
      >
        <span aria-hidden className="h-px w-6 bg-royal-500/60" />
        {eyebrow}
        {align === "center" && <span aria-hidden className="h-px w-6 bg-royal-500/60" />}
      </span>
      <h2 id={id} className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
        {title}
      </h2>
      {lede && <p className="text-base leading-relaxed text-ink-200">{lede}</p>}
    </Reveal>
  );
}
