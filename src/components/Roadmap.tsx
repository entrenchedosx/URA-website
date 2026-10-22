import { Check, CircleDashed, CircleOff, Clock3, FlaskConical, Hammer, MinusCircle, ShieldX } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const MILESTONES = [
  { tag: "v0.1", title: "Read-only inspection loop", note: "PE/ELF/Mach-O loading, disassembly, hex, strings, first projects" },
  { tag: "v0.2", title: "Dockable workbench", note: "Simultaneous views at any window size, layout persistence" },
  { tag: "v0.3", title: "Function analysis", note: "Recursive discovery, blocks and edges, xrefs, rename persistence" },
  { tag: "v0.4", title: "Navigation & workflow", note: "History, rich go-to, manual functions, proven data references" },
  { tag: "v0.5", title: "Native desktop", note: "Entirely Rust/egui application with ten dockable views" },
  { tag: "v0.6", title: "Headless + native workspace", note: "Compact native UI, CLI, 15-tool stdio MCP server" },
] as const;

type Status = "supported" | "partial" | "experimental" | "planned" | "deferred";

const STATUS_STYLE: Record<Status, { label: string; cls: string; icon: LucideIcon }> = {
  supported: { label: "Supported", cls: "border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-300", icon: Check },
  partial: { label: "Partial", cls: "border-signal-500/30 bg-signal-500/[0.08] text-signal-300", icon: MinusCircle },
  experimental: { label: "Experimental", cls: "border-gilt-500/30 bg-gilt-500/[0.08] text-gilt-300", icon: FlaskConical },
  planned: { label: "Planned", cls: "border-royal-500/30 bg-royal-500/[0.08] text-royal-300", icon: Clock3 },
  deferred: { label: "Deferred", cls: "border-ink-500/40 bg-ink-700/40 text-ink-300", icon: CircleDashed },
};

const BOARD: Array<{ area: string; status: Status; note: string }> = [
  { area: "Inspection & navigation", status: "supported", note: "Metadata, sections, symbols, imports/exports, strings, hex, go-to, history" },
  { area: "x86 / x86-64 analysis", status: "supported", note: "Decoding, function discovery, blocks and edges, code/data references" },
  { area: "Persistent projects", status: "supported", note: "Annotations, renames, manual starts, workspace state; schema migrations" },
  { area: "Desktop / CLI / MCP", status: "supported", note: "One engine, three surfaces; JSON DTOs; sand-boxed --allow path policy" },
  { area: "Typed IR & SSA", status: "partial", note: "Scalar x86/x64 lifting, dominators, def-use — delivered in 0.7 checkpoints, not in a stable release" },
  { area: "Signature & stack recovery", status: "experimental", note: "Win64/SysV/etc. conventions and frame slots — audit found convergence defects; repairs are in source, ahead of any artifact" },
  { area: "Decompiler output", status: "experimental", note: "C-like rendering from verified SSA — explicitly structural, never claimed to be source" },
  { area: "CFG & reference hardening", status: "planned", note: "Validation under resource limits, bounded data reads, relocation-aware import references" },
  { area: "Architecture-neutral semantics", status: "planned", note: "Prerequisite for SSA, type inference and decompilation at parity ambitions" },
  { area: "Broader formats & ISAs", status: "planned", note: "ARM/AArch64/RISC-V/MIPS/PowerPC are metadata-only today; ELF UI parity review queued" },
  { area: "PDB loading, diffing, scripting", status: "planned", note: "Long-term candidates behind capabilities verified first in the feature matrix" },
  { area: "Jump-table recovery", status: "deferred", note: "Would fabricate targets without a bounded data reader — indirect transfers stay labelled instead" },
  { area: "Plugin / scripting API", status: "deferred", note: "Deliberately after a stable internal pass contract — no public surface yet" },
];

const NON_GOALS = [
  "Running, unpacking or patching samples — URA reads, never executes",
  "Debugger backend (development menu disabled)",
  "Kernel drivers or anti-cheat bypass functionality",
  "Uploading or transmitting binaries to remote services",
];

export function Roadmap() {
  return (
    <section id="roadmap" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Roadmap"
          title={
            <>
             Development that <span className="text-gradient">shows its work</span>
            </>
          }
          lede="Statuses below mirror the repository's documented feature matrix and release audit notes. Nothing is marked done because it sounds good."
        />

        {/* shipped timeline */}
        <Reveal className="mt-14" delay={0.05}>
          <div className="relative">
            <div aria-hidden className="absolute top-[1.35rem] left-4 h-px w-[calc(100%-2rem)] bg-gradient-to-r from-emerald-500/30 via-royal-500/25 to-ink-600" />
            <ol className="relative grid gap-6 sm:grid-cols-3 lg:grid-cols-6">
              {MILESTONES.map((m) => (
                <li key={m.tag} className="relative flex flex-col items-start gap-2">
                  <span
                    aria-hidden
                    className="z-10 flex size-4 items-center justify-center rounded-full border border-emerald-500/40 bg-ink-900"
                  >
                    <span className="size-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span className="font-mono text-xs font-semibold text-emerald-300">{m.tag}</span>
                  <span className="text-[0.8125rem] font-semibold leading-tight text-ink-50">{m.title}</span>
                  <span className="text-[0.6875rem] leading-4 text-ink-500">{m.note}</span>
                </li>
              ))}
            </ol>
          </div>
        </Reveal>

        {/* status board */}
        <div className="mt-12 grid gap-3 md:grid-cols-2">
          {BOARD.map((row, i) => {
            const s = STATUS_STYLE[row.status];
            return (
              <Reveal key={row.area} delay={0.03 * (i % 4)}>
                <div className="flex h-full items-start gap-3.5 rounded-xl hairline bg-ink-900/50 p-4 transition-colors hover:border-ink-500/50">
                  <span className={`mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.625rem] font-semibold tracking-wider uppercase ${s.cls}`}>
                    <s.icon className="size-3" aria-hidden />
                    {s.label}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-ink-50">{row.area}</h3>
                    <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-300">{row.note}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* non-goals */}
        <Reveal delay={0.1}>
          <div className="mt-4 rounded-2xl border border-ink-700/70 bg-ink-850/50 p-6 sm:p-7">
            <h3 className="flex items-center gap-2.5 text-sm font-semibold tracking-wide text-ink-200 uppercase">
              <ShieldX className="size-4.5 text-ink-400" aria-hidden />
              Explicit non-goals
            </h3>
            <p className="mt-2 max-w-3xl text-sm text-ink-400">
              Documented in the repository's roadmap so expectations stay aligned across the
              project.
            </p>
            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {NON_GOALS.map((goal) => (
                <li key={goal} className="flex items-start gap-2.5 text-sm text-ink-300">
                  <CircleOff className="mt-0.5 size-3.5 shrink-0 text-ink-500" aria-hidden />
                  {goal}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs text-ink-400">
            Long-term ambition: comprehensive coverage of IDA Pro- and Ghidra-class workflows.
            Parity is pursued through the auditable feature matrix in{" "}
            <a
              href="https://github.com/entrenchedosx/URA/blob/main/docs/GHIDRA-RESEARCH.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-300 underline decoration-ink-600 underline-offset-2 transition-colors hover:text-royal-300"
            >
              GHIDRA-RESEARCH.md
            </a>{" "}
            — it is not claimed today. <Hammer className="mb-0.5 inline size-3" aria-hidden />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
