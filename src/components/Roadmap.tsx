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
  { tag: "v0.7", title: "Typed IR & verified SSA", note: "Scalar lifting, dominators/frontiers, 19 MCP tools" },
  { tag: "v0.8", title: "Decompiler foundations", note: "ABI/stack recovery, type system, call graphs — audited" },
] as const;

type Status = "supported" | "partial" | "experimental" | "planned" | "deferred";

const STATUS_STYLE: Record<Status, { label: string; cls: string; icon: LucideIcon }> = {
  supported: { label: "Supported", cls: "border-emerald-500/30 bg-emerald-500/[0.08] text-emerald-300", icon: Check },
  partial: { label: "Partial", cls: "border-signal-500/30 bg-signal-500/[0.08] text-signal-300", icon: MinusCircle },
  experimental: { label: "Experimental", cls: "border-gilt-500/30 bg-gilt-500/[0.08] text-gilt-300", icon: FlaskConical },
  planned: { label: "Planned", cls: "border-royal-500/30 bg-royal-500/[0.08] text-royal-300", icon: Clock3 },
  deferred: { label: "Deferred", cls: "border-ink-500/40 bg-ink-700/40 text-ink-300", icon: CircleDashed },
};

const CURRENT = {
  tag: "v0.9.0-dev · source checkpoint",
  branch: "v0.9-c-decompiler",
  note: "C-like decompiler shipped and verified in source — 251 tests, strict Clippy, independent review. No public artifact is published while acceptance gates remain open.",
};

const BOARD: Array<{ area: string; status: Status; note: string }> = [
  { area: "Inspection & navigation", status: "supported", note: "Metadata, sections, symbols, imports/exports, strings, hex, go-to, history" },
  { area: "x86 / x86-64 analysis", status: "supported", note: "Decoding, function discovery, blocks and edges, code/data references" },
  { area: "Persistent projects", status: "supported", note: "Annotations, renames, manual starts, workspace state; schema 5 without migration" },
  { area: "Desktop / CLI / MCP", status: "supported", note: "One engine, three surfaces; decompile + paged AST export; 32 MCP tools; sandboxed writes" },
  { area: "C-like decompiler", status: "experimental", note: "v0.9 source checkpoint: deterministic C-like AST, SSA destruction, bounded reduction, F5 sync — 4 rows audited Supported, 17 Partial behind them" },
  { area: "Pseudocode workflow", status: "partial", note: "Virtualized F5 panel, line↔assembly cross-linking, signature/stack editors — no token-level navigation yet" },
  { area: "CFG & reference hardening", status: "planned", note: "Relocation-aware import references, switch-hint promotion, exhaustive indirect flows (v0.10 targets)" },
  { area: "Decompiler refinement", status: "planned", note: "Named structure fields, canonical loop/switch syntax, alias sets, idiom and ABI coverage (v0.10)" },
  { area: "Verified binary patching", status: "planned", note: "Transactional edits, expected-byte application, post-patch invalidation (v0.11)" },
  { area: "Native debugging & tracing", status: "planned", note: "Static analysis only today; debugger backend is a later architecture (v0.12)" },
  { area: "Proof-backed deobfuscation", status: "planned", note: "Semantic rewrite evidence before opaque-predicate removal (v0.13)" },
  { area: "PDB, DWARF, C++ classes, scripting", status: "deferred", note: "Loaders, class/vtable recovery and a public SDK follow verified core capabilities" },
  { area: "Jump-table switch promotion", status: "deferred", note: "Would fabricate targets without a bounded data reader — indirect transfers stay labelled" },
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
            <ol className="relative grid gap-6 sm:grid-cols-4 lg:grid-cols-8">
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

        {/* current checkpoint banner */}
        <Reveal className="mt-10" delay={0.08}>
          <div className="flex flex-col gap-3 rounded-2xl border border-gilt-500/25 bg-gilt-500/[0.05] p-5 sm:flex-row sm:items-center sm:gap-6">
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-gilt-500/40 bg-ink-900 px-3 py-1.5 font-mono text-[0.6875rem] text-gilt-300">
              <CircleDashed className="size-3.5" aria-hidden />
              {CURRENT.tag}
            </span>
            <p className="text-sm leading-relaxed text-ink-300">
              <span className="font-mono text-[0.8125rem] text-ink-100">{CURRENT.branch}</span>
              {" — "}
              {CURRENT.note}
            </p>
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
            Progress tracks through the auditable 129-row ledger in{" "}
            <a
              href="https://github.com/entrenchedosx/URA/blob/v0.9-c-decompiler/docs/FEATURE-PARITY.md"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-300 underline decoration-ink-600 underline-offset-2 transition-colors hover:text-royal-300"
            >
              FEATURE-PARITY.md
            </a>{" "}
            — 17 Supported, 51 Partial, 57 Missing, 4 Unverified: ledger counts, never a parity
            percentage. <Hammer className="mb-0.5 inline size-3" aria-hidden />
          </p>
        </Reveal>
      </div>
    </section>
  );
}
