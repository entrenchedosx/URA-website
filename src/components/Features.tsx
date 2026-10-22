import {
  Binary,
  Cpu,
  Database,
  GitFork,
  SquareDashedBottom,
  Terminal,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

interface Feature {
  icon: LucideIcon;
  title: string;
  body: string;
  foot: string;
}

const FEATURES: Feature[] = [
  {
    icon: Cpu,
    title: "Native Rust engine",
    body: "Desktop, CLI and MCP server all sit on one shared analysis engine — nothing is duplicated. The eframe/egui desktop renders through OpenGL with no WebView dependency, and resources stay bounded during analysis and string scanning.",
    foot: "crates: ura-core · ura-native · ura-service",
  },
  {
    icon: Binary,
    title: "Binary exploration",
    body: "Executable metadata, SHA-256 identity, sections, symbols, imports and exports for PE, ELF and Mach-O — loaded through the object crate. ASCII and UTF-16LE string scans and bounded hex reads complete the inspector workflow.",
    foot: "512 MiB maximum input size",
  },
  {
    icon: SquareDashedBottom,
    title: "x86 & x86-64 disassembly",
    body: "Linear disassembly with bytes, flow classification and direct targets. Walk the listing by keyboard, follow direct branches and calls with Enter, and export the same data as structured JSON from headless modes.",
    foot: "iced-x86 based decoding",
  },
  {
    icon: GitFork,
    title: "Functions & control flow",
    body: "Recursive discovery from entry points, exports, symbols and call targets. Basic blocks with conditional and loop edges, incoming/outgoing code references, and data references for provable RIP-relative or absolute operands — unresolved indirect transfers are labelled, never guessed.",
    foot: "CFG, dominators-ready structure",
  },
  {
    icon: Database,
    title: "Persistent projects",
    body: "SQLite .ura projects keep annotations, renamed functions and manual seeds across sessions, with navigation history and saved workspace state. Older project schemas migrate forward; headless attachment is read-only and hash-verified.",
    foot: "schema v1–v5 handled explicitly",
  },
  {
    icon: Terminal,
    title: "Desktop · CLI · MCP",
    body: "The CLI answers info, analyze, functions, disasm, strings, xrefs, cfg and hex in text or JSON. A local stdio MCP server exposes read-only queries for AI-assisted workflows, with project writes gated behind an explicit --enable-writes option.",
    foot: "paths constrained by --allow roots",
  },
];

const LIMITS = [
  "No debugger, no PDB loader, no public plugin API",
  "Decompiler foundations are experimental (0.8 checkpoints)",
  "Non-x86 architectures: metadata only",
  "No semantic IR or type recovery on main",
  "Indirect transfers stay unresolved",
  "Conservative discovery can miss code",
];

export function Features() {
  return (
    <section id="features" className="relative scroll-mt-24 py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-96 w-[60rem] -translate-x-1/2 rounded-full bg-royal-700/[0.08] blur-[120px]"
      />
      <div className="container-site relative">
        <SectionHeading
          eyebrow="Features"
          title={
            <>
              One engine, <span className="text-gradient">honest boundaries</span>
            </>
          }
          lede="URA is an early engineering release with explicitly stated analysis limits. Everything below is implemented and verified by the repository's test suite — nothing here is aspirational."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={0.05 * (i % 3)}>
              <article className="group relative h-full overflow-hidden rounded-2xl hairline bg-ink-900/50 p-6 shadow-card backdrop-blur-sm transition-colors duration-300 hover:border-royal-500/40">
                <div
                  aria-hidden
                  className="absolute -top-16 -right-16 size-40 rounded-full bg-royal-500/0 blur-3xl transition-colors duration-500 group-hover:bg-royal-500/15"
                />
                <f.icon
                  className="size-10 text-royal-300/90 transition-transform duration-300 group-hover:-translate-y-0.5"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <h3 className="mt-5 text-[1.0625rem] font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-ink-300">{f.body}</p>
                <p className="mt-4 border-t border-ink-700/50 pt-3 font-mono text-[0.6875rem] text-ink-500">
                  {f.foot}
                </p>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 overflow-hidden rounded-2xl hairline bg-ink-850/60">
            <div className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
              <div className="max-w-xl">
                <h3 className="text-[1.0625rem] font-semibold tracking-tight text-gilt-300">
                  What URA doesn't do — yet
                </h3>
                <p className="mt-2 text-sm text-ink-300">
                  Stated in the README, verbatim in spirit. Ambition is reviewed against a
                  documented feature matrix rather than implied.
                </p>
              </div>
              <ul className="grid flex-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {LIMITS.map((limit) => (
                  <li
                    key={limit}
                    className="flex items-start gap-2 font-mono text-[0.6875rem] leading-4 text-ink-400"
                  >
                    <span aria-hidden className="mt-px text-gilt-500">
                      ×
                    </span>
                    {limit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
