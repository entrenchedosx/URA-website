import {
  Ban,
  CheckCircle2,
  FileCode2,
  FolderGit2,
  Gauge,
  GitBranch,
  ShieldAlert,
  Timer,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import {
  PARITY_CAPABILITIES,
  PARITY_FAMILIES,
  PARITY_GAP_PICKS,
  PARITY_NOTE,
  PARITY_SUPPORTED_PICKS,
  PARITY_TOTALS,
  V09,
} from "../lib/parity";
import type { ParityStatus } from "../lib/parity";
import { shortHash } from "../lib/format";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const SHIPPED: Array<{ title: string; body: string }> = [
  {
    title: "Deterministic C-like AST",
    body: "A version-1 typed AST is built from semantic HIR — never from rendered strings. Typed scalar expressions, ordered loads and stores, calls and explicit unknown effects, rendered to reconstructed C-like pseudocode.",
  },
  {
    title: "SSA destruction that survives cycles",
    body: "Every phi becomes edge-specific parallel copies; copy cycles save a width-correct scratch and substitute remaining uses. Verified against 1024 simultaneous-copy cases across four widths.",
  },
  {
    title: "Bounded control-flow reduction",
    body: "Uniquely entered linear blocks, closed two-arm diamonds and exact self-loop regions reduce repeatedly; loops emit while (true) with explicit exits. Everything unproved keeps labels and gotos.",
  },
  {
    title: "Native Pseudocode panel (F5)",
    body: "A virtualized, colored view with line numbers — opening on F5 with the legacy dock identity preserved. Line selection navigates to assembly; assembly selection scrolls mapped source back into view.",
  },
  {
    title: "Editors wired into the pipeline",
    body: "Signature overrides, physical stack name/type edits and structure fields refresh pseudocode, exports and project persistence — same schema 5, no migration needed.",
  },
  {
    title: "Headless decompilation",
    body: "ura-cli decompile and ura_decompile_function serve paged text/JSON lines (1–2000), optional AST capped at 2 MiB, and whole-function exports that honor --allow roots and refuse truncated output.",
  },
];

const STATS: Array<{ icon: LucideIcon; value: string; label: string; note: string }> = [
  { icon: CheckCircle2, value: "251", label: "workspace tests passed", note: "237 retained + final checkpoint runs, 0 failed" },
  { icon: FileCode2, value: "32", label: "MCP stdio tools", note: "C-like decompile pages/AST/export included" },
  { icon: Gauge, value: "1,280", label: "independent executor cases", note: "Arithmetic/partial-register corpus + Clang O0–O3 fixtures" },
  { icon: Ban, value: "0", label: "public ZIP artifacts", note: "Deliberate — open gates block acceptance, source only" },
];

const PERF_ROWS: Array<{ m: string; a: string; b: string }> = [
  { m: "Legacy HIR construction", a: "10.29 ms", b: "9.83 ms" },
  { m: "Semantic HIR lowering", a: "8.75 ms", b: "8.37 ms" },
  { m: "Program/type propagation", a: "117.22 ms", b: "107.85 ms" },
  { m: "Full function pipeline", a: "171.61 ms", b: "188.88 ms" },
  { m: "C-like construction incl. formatting", a: "—", b: "24.55 ms" },
  { m: "Formatting existing C-like AST", a: "—", b: "7.43 ms" },
  { m: "Observed peak working set", a: "169.52 MiB", b: "181.91 MiB" },
];

const GATES: Array<{ title: string; body: string }> = [
  {
    title: "Actual OS 150% DPI check",
    body: "The host's supported Settings surface could not be driven, so the manual qualification checklist remains open — no current 150% native gate exists.",
  },
  {
    title: "Live large-function acceptance",
    body: "A native attempt on the selected 1768-instruction function reached recovery but the verification window closed before the final pseudocode/scrolling check. Bounded renderer latency is unproven live.",
  },
  {
    title: "Cancellation during expensive live work",
    body: "Automated worker/budget checks stayed green, but a full live cancellation pass was not completed for this checkpoint.",
  },
  {
    title: "Compiler coverage beyond Clang",
    body: "The semantic corpus spans Clang C/C++ PE/ELF at O0–O3. MSVC/GCC and debug-symbol oracles remain unverified.",
  },
];

const STATUS_BAR: Record<ParityStatus, { label: string; fill: string; text: string }> = {
  supported: { label: "Supported", fill: "bg-emerald-500/70", text: "text-emerald-300" },
  partial: { label: "Partial", fill: "bg-signal-500/60", text: "text-signal-300" },
  missing: { label: "Missing", fill: "bg-ink-600/70", text: "text-ink-300" },
  unverified: { label: "Unverified", fill: "bg-gilt-500/60", text: "text-gilt-300" },
};

export function Progress() {
  return (
    <section id="progress" className="relative scroll-mt-24 py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_55%_100%_at_50%_0%,rgb(200,162,78,0.07),transparent_70%)]"
      />
      <div className="container-site relative">
        <SectionHeading
          eyebrow="Engineering progress"
          title={
            <>
              The decompiler checkpoint, <span className="text-gradient">measured honestly</span>
            </>
          }
          lede="v0.9.0-dev is a verified source checkpoint — published to its development branch, gated by 251 tests and an independent review, and deliberately without a public ZIP until open acceptance gates close. Here is exactly what exists and what still doesn't."
        />

        {/* checkpoint status card */}
        <Reveal className="mt-12" delay={0.05}>
          <div className="overflow-hidden rounded-2xl hairline bg-ink-900/60">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gilt-500/30 bg-gilt-500/10 px-2.5 py-0.5 font-mono text-[0.6875rem] text-gilt-300">
                    <GitBranch className="size-3.5" aria-hidden />
                    {V09.branch}
                  </span>
                  <span className="font-mono text-[0.6875rem] text-ink-400">
                    commit <span className="text-ink-200">{shortHash(V09.commit, 8, 4)}</span>
                  </span>
                  <span className="font-mono text-[0.6875rem] text-ink-400">·</span>
                  <span className="font-mono text-[0.6875rem] text-ink-400">verified 2026-10-22</span>
                </div>
                <h3 className="mt-3 text-xl font-semibold tracking-tight text-ink-50">
                  {`URA ${V09.version} — the C-like decompiler milestone`}
                </h3>
                <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-300">
                  The source checkpoint is complete and publishable to its development branch —
                  but the v0.9 milestone and public prerelease are explicitly{" "}
                  <strong className="text-ink-100">not accepted as complete</strong>. No release,
                  tag or asset is replaced, and no ZIP is offered here. The published{" "}
                  <span className="font-mono text-ink-200">v0.8.0-dev</span> release is preserved
                  untouched; resume past the open gates, then publish an accepted artifact.
                </p>
              </div>
              <div className="flex flex-col gap-2 lg:w-64">
                <a
                  href={`https://github.com/entrenchedosx/URA/tree/${V09.branch}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-600/80 bg-ink-800/60 px-4 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:border-royal-500/50 hover:text-ink-50"
                >
                  <FolderGit2 className="size-4 text-royal-300" aria-hidden />
                  Browse the branch
                </a>
                <a
                  href={V09.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-600/80 bg-ink-800/60 px-4 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:border-royal-500/50 hover:text-ink-50"
                >
                  <ShieldAlert className="size-4 text-gilt-300" aria-hidden />
                  VERIFICATION-0.9.md
                </a>
                <a
                  href={V09.featureParityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-600/80 bg-ink-800/60 px-4 py-2.5 text-sm font-medium text-ink-100 transition-colors hover:border-royal-500/50 hover:text-ink-50"
                >
                  <Timer className="size-4 text-signal-300" aria-hidden />
                  FEATURE-PARITY.md
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        {/* stats */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={0.03 * i}>
              <div className="h-full rounded-2xl hairline bg-ink-900/50 p-5">
                <s.icon className="size-5 text-royal-300/90" aria-hidden />
                <p className="mt-3 font-mono text-3xl font-semibold tracking-tight text-ink-50">
                  {s.value}
                </p>
                <p className="text-sm font-medium text-ink-200">{s.label}</p>
                <p className="mt-1 text-xs leading-4 text-ink-500">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* shipped */}
        <Reveal className="mt-10" delay={0.05}>
          <h3 className="text-sm font-semibold tracking-wide text-ink-200 uppercase">
            What shipped in the checkpoint
          </h3>
        </Reveal>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {SHIPPED.map((f, i) => (
            <Reveal key={f.title} delay={0.03 * (i % 3)}>
              <article className="h-full rounded-xl hairline bg-ink-900/50 p-5 transition-colors hover:border-royal-500/40">
                <h4 className="flex items-center gap-2 text-sm font-semibold text-ink-50">
                  <CheckCircle2 className="size-4 shrink-0 text-emerald-400/90" aria-hidden />
                  {f.title}
                </h4>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-300">{f.body}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* perf + gates */}
        <div className="mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)]">
          <Reveal delay={0.05}>
            <div className="flex h-full flex-col overflow-hidden rounded-2xl hairline bg-ink-900/60">
              <div className="flex items-center justify-between border-b border-ink-700/50 px-6 py-4">
                <h3 className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-ink-50">
                  <Timer className="size-4 text-royal-300" aria-hidden />
                  Measured before and after — one fixture, no averages
                </h3>
                <a
                  href={V09.benchmarkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden font-mono text-[0.6875rem] text-ink-400 underline decoration-ink-600 underline-offset-2 hover:text-royal-300 sm:block"
                >
                  raw benchmark JSON
                </a>
              </div>
              <table className="w-full text-left font-mono text-[0.75rem]">
                <thead>
                  <tr className="border-b border-ink-700/50 text-[0.625rem] tracking-wider text-ink-500 uppercase">
                    <th className="px-6 py-2.5 font-semibold">Measurement</th>
                    <th className="px-3 py-2.5 text-right font-semibold">v0.8 retained</th>
                    <th className="px-6 py-2.5 text-right font-semibold">v0.9</th>
                  </tr>
                </thead>
                <tbody>
                  {PERF_ROWS.map((row) => (
                    <tr key={row.m} className="border-t border-ink-800/60">
                      <td className="px-6 py-2 text-ink-300">{row.m}</td>
                      <td className="px-3 py-2 text-right text-ink-500">{row.a}</td>
                      <td className="px-6 py-2 text-right text-ink-100">{row.b}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-auto border-t border-ink-700/50 px-6 py-3.5 text-xs leading-5 text-ink-400">
                The same <span className="text-ink-300">NTDLL function 0x1800AA290</span> — 1,768
                instructions across 440 blocks, three repetitions, warm caches, identical sample
                hashes. The pipeline grew ≈10.1% absorbing the new C-like pass; peak working set
                ≈7.3%. It produced 15,585 C-like lines and a 7.86 MB serialized AST.{" "}
                <span className="text-gilt-300">Fixture-specific figures, not product claims</span>{" "}
                — the bounded interprocedural solver remains the largest measured cost, and no
                speed or memory improvement is claimed.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="h-full rounded-2xl hairline bg-ink-900/60 p-6">
              <h3 className="flex items-center gap-2.5 text-sm font-semibold tracking-tight text-ink-50">
                <ShieldAlert className="size-4 text-amber-warn" aria-hidden />
                Open gates before any artifact
              </h3>
              <p className="mt-1.5 text-xs text-ink-500">
                Why this checkpoint ships as source, deliberately.
              </p>
              <ul className="mt-4 flex flex-col gap-4">
                {GATES.map((g) => (
                  <li key={g.title}>
                    <p className="text-sm font-semibold text-ink-100">{g.title}</p>
                    <p className="mt-0.5 text-[0.8125rem] leading-relaxed text-ink-300">{g.body}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>

        {/* parity dashboard */}
        <Reveal className="mt-10" delay={0.05}>
          <div className="overflow-hidden rounded-2xl hairline bg-ink-900/60">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700/50 px-6 py-4">
              <h3 className="text-sm font-semibold tracking-tight text-ink-50">
                Capability ledger — {PARITY_CAPABILITIES} audited rows
              </h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-[0.6875rem]">
                {PARITY_TOTALS.map((t) => (
                  <span key={t.status} className={STATUS_BAR[t.status].text}>
                    {STATUS_BAR[t.status].label} {t.count}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-6">
              <div className="flex flex-col gap-3.5">
                {PARITY_FAMILIES.map((f) => (
                  <div key={f.name}>
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <p className="text-sm font-medium text-ink-100">{f.name}</p>
                      <p className="font-mono text-[0.625rem] text-ink-500">
                        {f.supported}·{f.partial}·{f.missing}
                        {f.unverified ? `·${f.unverified}` : ""} / {f.rows}
                      </p>
                    </div>
                    <div className="mt-1.5 flex h-2 w-full overflow-hidden rounded-full bg-ink-800">
                      {(["supported", "partial", "missing", "unverified"] as const).map((status) => {
                        const count = f[status === "supported" ? "supported" : status];
                        const width = (count / f.rows) * 100;
                        if (!count) return null;
                        return (
                          <span
                            key={status}
                            title={`${STATUS_BAR[status].label}: ${count}`}
                            className={STATUS_BAR[status].fill}
                            style={{ width: `${width}%` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 grid gap-5 border-t border-ink-700/50 pt-5 sm:grid-cols-2">
                <div>
                  <p className="font-mono text-[0.625rem] font-semibold tracking-wider text-emerald-300 uppercase">
                    Audited supported (sample)
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5 font-mono text-[0.6875rem] leading-4 text-ink-300">
                    {PARITY_SUPPORTED_PICKS.map((pick) => (
                      <li key={pick} className="flex items-start gap-2">
                        <CheckCircle2 className="mt-px size-3 shrink-0 text-emerald-400/80" aria-hidden />
                        {pick}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-mono text-[0.625rem] font-semibold tracking-wider text-gilt-300 uppercase">
                    Named gaps, verbatim rows
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5 font-mono text-[0.6875rem] leading-4 text-ink-300">
                    {PARITY_GAP_PICKS.map((pick) => (
                      <li key={pick} className="flex items-start gap-2">
                        <Ban className="mt-px size-3 shrink-0 text-gilt-500/70" aria-hidden />
                        {pick}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <p className="mt-5 text-xs leading-5 text-ink-400">
                {PARITY_NOTE}{" "}
                <a
                  href={V09.featureParityUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-ink-300 underline decoration-ink-600 underline-offset-2 transition-colors hover:text-royal-300"
                >
                  Read the full 129-row ledger
                </a>{" "}
                with competitor-family documentation links, evidence paths and per-row targets.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
