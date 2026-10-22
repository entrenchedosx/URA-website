import { useEffect, useMemo, useRef, useState } from "react";
import type { Interaction } from "../lib/decompiler-sample";
import { DECOMPILER_SAMPLES } from "../lib/decompiler-sample";
import { Code2, Repeat2, ScrollText, Waypoints } from "lucide-react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const REG_CLASSES = new Set([
  "rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rsp", "rbp",
  "eax", "ebx", "ecx", "edx", "esi", "edi", "esp", "ebp",
]);

function operandClasses(o: string): Array<{ text: string; cls: string }> {
  return o
    .split(/(,\s*|\s+)/)
    .filter(Boolean)
    .map((part) => {
      if (REG_CLASSES.has(part)) return { text: part, cls: "text-signal-300" };
      if (/^\d+$/.test(part) || /^(short|loc_|sub_|lbl_)/.test(part))
        return { text: part, cls: "text-gilt-300" };
      return { text: part, cls: "text-ink-200" };
    });
}

interface Morphology {
  headline: string;
  chips: Array<{ title: string; items: string[] }>;
}

const MORPHOLOGY: Morphology = {
  headline: "What the v0.9 emitter guarantees on this function",
  chips: [
    {
      title: "Provenance",
      items: [
        "Every line carries its contributing instruction addresses",
        "Synthetic declarations never invent an address",
        "Physical jumps removed by reduction keep markers",
      ],
    },
    {
      title: "Control flow",
      items: [
        "Proved loops emit while (true) with explicit exits",
        "Irreducible regions keep labels and gotos",
        "No guessed for / switch / short-circuit syntax",
      ],
    },
    {
      title: "Scalar semantics",
      items: [
        "Unsigned bit-vector storage domain throughout",
        "Signed forms printed explicitly, never assumed",
        "Loads stay ordered; calls keep their clobbers",
      ],
    },
  ],
};

export function Decompiler() {
  const [sampleId, setSampleId] = useState(DECOMPILER_SAMPLES[1].id);
  const [selAsm, setSelAsm] = useState<string>(DECOMPILER_SAMPLES[1].selection);
  const [selLine, setSelLine] = useState<number | null>(null);
  const [lastSide, setLastSide] = useState<Interaction>("asm");
  const sample = useMemo(
    () => DECOMPILER_SAMPLES.find((s) => s.id === sampleId) ?? DECOMPILER_SAMPLES[0],
    [sampleId],
  );

  const asmRefs = useRef(new Map<string, HTMLElement>());
  const lineRefs = useRef(new Map<number, HTMLElement>());

  useEffect(() => {
    if (!selAsm) return;
    asmRefs.current.get(selAsm)?.scrollIntoView({ block: "nearest" });
  }, [selAsm, sampleId]);

  useEffect(() => {
    if (selLine == null) return;
    lineRefs.current.get(selLine)?.scrollIntoView({ block: "nearest" });
  }, [selLine, sampleId]);

  const linkedLines = useMemo(
    () => (selAsm ? sample.lines.filter((l) => l.asm?.includes(selAsm)).map((l) => l.n) : []),
    [sample, selAsm],
  );

  const selectAsm = (addr: string) => {
    setLastSide("asm");
    setSelAsm((cur) => (cur === addr && linkedLines.length ? "" : addr));
    setSelLine(null);
  };

  const selectLine = (n: number, asm: string[] | undefined) => {
    setLastSide("line");
    setSelLine((cur) => {
      if (cur === n) {
        setSelAsm(sample.selection);
        return null;
      }
      setSelAsm(asm?.[0] ?? "");
      return n;
    });
  };

  const followCall = (target: string) => {
    const next = DECOMPILER_SAMPLES.find((s) => s.id === target);
    if (!next) return;
    setSampleId(next.id);
    setSelAsm(next.selection);
    setSelLine(null);
  };

  const pseudoSel = lastSide === "line" ? [selLine ?? -1] : linkedLines;

  return (
    <section id="decompiler" className="relative scroll-mt-24 py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 left-1/2 h-96 w-[62rem] -translate-x-1/2 rounded-full bg-gilt-600/[0.06] blur-[120px]"
      />
      <div className="container-site relative">
        <SectionHeading
          eyebrow="F5 — Pseudocode"
          title={
            <>
              Assembly in, <span className="text-gradient">C-like structure out</span>
            </>
          }
          lede="The v0.9 source checkpoint adds a native Pseudocode panel: press F5, click an assembly row, and every reconstructed source line that contributed lights up — then click a source line and the machine evidence responds in kind. Engine-reconstructed and deterministic; no LLM anywhere in the pipeline."
        />

        {/* function switcher */}
        <Reveal className="mt-10 flex flex-wrap items-center justify-center gap-2" delay={0.05}>
          {DECOMPILER_SAMPLES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => {
                setSampleId(s.id);
                setSelAsm(s.selection);
                setSelLine(null);
              }}
              aria-pressed={s.id === sampleId}
              className={`rounded-lg border px-3.5 py-2 font-mono text-xs transition-colors ${
                s.id === sampleId
                  ? "border-royal-500/60 bg-royal-600/20 text-ink-50"
                  : "border-ink-700/70 bg-ink-900/60 text-ink-300 hover:border-ink-500 hover:text-ink-50"
              }`}
            >
              <span aria-hidden className={s.id === sampleId ? "text-signal-300" : "text-ink-500"}>
                f{" "}
              </span>
              {s.name}
            </button>
          ))}
        </Reveal>

        <Reveal className="mt-6" delay={0.1}>
          <div className="overflow-hidden rounded-2xl border border-ink-600/70 bg-ink-900 shadow-window">
            {/* chrome */}
            <div className="flex items-center gap-2 border-b border-ink-700/70 bg-ink-850 px-3.5 py-2.5">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-ink-600" />
                <span className="size-2.5 rounded-full bg-ink-600" />
                <span className="size-2.5 rounded-full bg-royal-600/80" />
              </span>
              <span className="ml-1.5 font-mono text-[0.6875rem] text-ink-300">
                ura-native.exe — Pseudocode | Disassembly
              </span>
              <span className="ml-auto hidden rounded border border-gilt-500/30 bg-gilt-500/10 px-2 py-0.5 font-mono text-[0.625rem] text-gilt-300/90 sm:block">
                v0.9.0-dev source checkpoint
              </span>
            </div>

            {/* panes */}
            <div className="grid lg:grid-cols-2 lg:divide-x lg:divide-ink-700/60">
              {/* assembly */}
              <div className="min-w-0 border-b border-ink-700/60 lg:border-b-0">
                <div className="flex items-center justify-between border-b border-ink-700/60 bg-ink-850/70 px-3.5 py-2">
                  <span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-wider text-ink-400 uppercase">
                    <Waypoints className="size-3.5 text-signal-400" aria-hidden />
                    {sample.name} · x86-64 disassembly
                  </span>
                  <span className="hidden font-mono text-[0.625rem] text-ink-500 sm:block">
                    click ↔ maps source
                  </span>
                </div>
                <div className="h-[26rem] overflow-y-auto">
                  <table className="w-full border-collapse font-mono text-[0.75rem] leading-[1.8]">
                    <tbody>
                      {sample.asm.map((ins) => {
                        const isSel = selAsm === ins.addr;
                        return (
                          <tr
                            key={ins.addr}
                            ref={(el) => {
                              if (el) asmRefs.current.set(ins.addr, el);
                              else asmRefs.current.delete(ins.addr);
                            }}
                            onClick={() => selectAsm(ins.addr)}
                            className={`cursor-pointer border-t border-ink-800/60 transition-colors ${
                              isSel ? "bg-royal-700/25" : "hover:bg-ink-850"
                            }`}
                          >
                            <td className="w-[6.5rem] px-3 py-[3px] text-[0.6875rem] text-ink-500 select-none">
                              {ins.addr}
                            </td>
                            <td className="w-14 py-[3px] font-semibold text-ink-50">{ins.m}</td>
                            <td className="py-[3px] pr-2">
                              {ins.o ? (
                                operandClasses(ins.o).map((t, i) => (
                                  <span key={i} className={t.cls}>
                                    {t.text}
                                  </span>
                                ))
                              ) : null}
                            </td>
                            <td className="w-16 px-3 py-[3px] text-right text-[0.6875rem] text-ink-600">
                              {ins.b}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* pseudocode */}
              <div className="min-w-0">
                <div className="flex items-center justify-between border-b border-ink-700/60 bg-ink-850/70 px-3.5 py-2">
                  <span className="flex items-center gap-2 font-mono text-[0.625rem] tracking-wider text-ink-400 uppercase">
                    <Code2 className="size-3.5 text-royal-300" aria-hidden />
                    reconstructed C-like · function pseudocode
                  </span>
                  <span className="hidden font-mono text-[0.625rem] text-ink-500 sm:block">
                    F5 opens this pane in the app
                  </span>
                </div>
                <div className="h-[26rem] overflow-y-auto">
                  <div
                    key={sampleId}
                    className="min-w-0 py-2 font-mono text-[0.75rem] leading-[1.9]"
                    aria-label={`Reconstructed pseudocode of ${sample.name}`}
                  >
                    {sample.lines.map((line) => {
                      const linked = pseudoSel.includes(line.n) && line.asm?.length !== 0;
                      const isSel = lastSide === "line" && selLine === line.n;
                      return (
                        <button
                          key={line.n}
                          type="button"
                          ref={(el) => {
                            if (el) lineRefs.current.set(line.n, el);
                            else lineRefs.current.delete(line.n);
                          }}
                          onClick={() => selectLine(line.n, line.asm)}
                          aria-label={
                            line.asm?.length
                              ? `Line ${line.n} maps to instruction ${line.asm.join(", ")}`
                              : `Line ${line.n} — synthetic line`
                          }
                          className={`group flex w-full items-baseline gap-3 px-2 text-left transition-colors ${
                            isSel
                              ? "bg-royal-700/30"
                              : linked
                                ? "bg-royal-600/12"
                                : "hover:bg-ink-850"
                          }`}
                        >
                          <span
                            className={`w-7 shrink-0 text-right text-[0.625rem] ${
                              line.asm?.length
                                ? "text-gilt-500/80"
                                : "text-ink-700"
                            }`}
                          >
                            {line.n}
                          </span>
                          <span
                            className={`min-w-0 whitespace-pre ${
                              line.synthetic ? "text-ink-500" : "text-ink-100"
                            }`}
                          >
                            {line.text || "\u00A0"}
                            {line.callTarget && (
                              <>
                                {" "}
                                <span
                                  role="button"
                                  tabIndex={0}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    followCall(line.callTarget!.fn);
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter" || e.key === " ") {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      followCall(line.callTarget!.fn);
                                    }
                                  }}
                                  className="rounded px-0.5 text-signal-300 underline decoration-signal-500/40 underline-offset-2 hover:bg-signal-500/10"
                                  title="Follow callee"
                                >
                                  {line.callTarget.label}
                                </span>
                              </>
                            )}
                          </span>
                          <span className="ml-auto hidden shrink-0 pl-3 text-[0.625rem] text-ink-600 group-hover:inline sm:inline">
                            {line.asm?.length ? line.asm[0] : "synthetic"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* status rail */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-ink-700/70 bg-ink-850 px-3.5 py-2.5 font-mono text-[0.6875rem]">
              {selAsm ? (
                <>
                  <span className="text-signal-300">{selAsm}</span>
                  <span className="text-ink-500">
                    {linkedLines.length
                      ? `${linkedLines.length} mapped source line${linkedLines.length > 1 ? "s" : ""}`
                      : "no source line maps here (unsupported or reduced effect)"}
                  </span>
                  {selLine != null && lastSide === "line" && (
                    <span className="text-royal-300">source line {selLine} selected</span>
                  )}
                </>
              ) : (
                <span className="text-ink-500">Select any row above to trace the mapping.</span>
              )}
              <span className="ml-auto hidden text-ink-500 md:block">
                {sample.name} · deterministic reconstruction · no fabricated source
              </span>
            </div>
          </div>
        </Reveal>

        {/* emitter contract */}
        <Reveal className="mt-4" delay={0.15}>
          <div className="overflow-hidden rounded-2xl hairline bg-ink-900/50">
            <div className="flex items-center gap-2.5 border-b border-ink-700/50 px-6 py-4">
              <ScrollText className="size-4 text-gilt-300" aria-hidden />
              <h3 className="text-sm font-semibold tracking-tight text-gilt-300">
                {MORPHOLOGY.headline}
              </h3>
              <Repeat2 className="ml-auto hidden size-3.5 text-ink-600 sm:block" aria-hidden />
            </div>
            <div className="grid gap-x-8 gap-y-5 p-6 sm:grid-cols-3">
              {MORPHOLOGY.chips.map((chip) => (
                <div key={chip.title}>
                  <p className="font-mono text-[0.625rem] font-semibold tracking-wider text-ink-400 uppercase">
                    {chip.title}
                  </p>
                  <ul className="mt-2 flex flex-col gap-1.5">
                    {chip.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2 text-[0.8125rem] leading-5 text-ink-300"
                      >
                        <span aria-hidden className="mt-1.5 size-1 shrink-0 rounded-full bg-royal-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <p className="border-t border-ink-700/50 px-6 py-3.5 text-xs leading-5 text-ink-400">
              Renderings follow the documented v0.9 emitter contract over the repository's{" "}
              <a
                href="https://github.com/entrenchedosx/URA/tree/main/tests/fixtures"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-300 underline decoration-ink-600 underline-offset-2 transition-colors hover:text-royal-300"
              >
                ura64.exe fixture
              </a>{" "}
              — they are not a live capture of a released build. Impossible things are still
              impossible on purpose: no canonical for/do-while, no complete source switch, no
              short-circuit operators, no floating-point semantics, and unresolved effects stay
              explicit.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
