import { Fragment, useMemo, useState } from "react";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

interface FollowLink {
  kind: "call" | "jump";
  label: string;
  fn?: string;
}

interface Ins {
  addr: string;
  m: string;
  o?: string;
  b: string;
  follow?: FollowLink;
}

interface Block {
  id: string;
  label: string;
  ins: Ins[];
  edges?: Array<{ to: string; type: "fall" | "loop" }>;
}

interface DemoFunction {
  id: "fn1" | "fn2";
  name: string;
  blocks: Block[];
  xrefs: Array<{ type: "call" | "jump"; ref: string }>;
}

const FN1: DemoFunction = {
  id: "fn1",
  name: "sub_140001000",
  blocks: [
    {
      id: "A",
      label: "loc_140001000",
      ins: [
        { addr: "140001000", m: "push", o: "rbp", b: "55" },
        { addr: "140001001", m: "mov", o: "rbp, rsp", b: "48 89 E5" },
        {
          addr: "140001004",
          m: "call",
          o: "sub_140001020",
          b: "E8 17 00 00 00",
          follow: { kind: "call", label: "sub_140001020", fn: "fn2" },
        },
      ],
      edges: [{ to: "C", type: "fall" }],
    },
    {
      id: "C",
      label: "loc_140001009",
      ins: [
        { addr: "140001009", m: "pop", o: "rbp", b: "5D" },
        { addr: "14000100A", m: "ret", o: "", b: "C3" },
      ],
    },
  ],
  xrefs: [{ type: "call", ref: "call sub_140001020 ← 140001004" }],
};

const FN2: DemoFunction = {
  id: "fn2",
  name: "sub_140001020",
  blocks: [
    {
      id: "A",
      label: "loc_140001020",
      ins: [
        { addr: "140001020", m: "push", o: "rbp", b: "55" },
        { addr: "140001021", m: "mov", o: "rbp, rsp", b: "48 89 E5" },
        { addr: "140001024", m: "xor", o: "eax, eax", b: "31 C0" },
      ],
      edges: [{ to: "B", type: "fall" }],
    },
    {
      id: "B",
      label: "loc_140001026",
      ins: [
        { addr: "140001026", m: "add", o: "eax, 1", b: "83 C0 01" },
        { addr: "140001029", m: "cmp", o: "eax, 5", b: "83 F8 05" },
        {
          addr: "14000102C",
          m: "jl",
          o: "short loc_140001026",
          b: "7C F8",
          follow: { kind: "jump", label: "loc_140001026" },
        },
      ],
      edges: [
        { to: "B", type: "loop" },
        { to: "C", type: "fall" },
      ],
    },
    {
      id: "C",
      label: "loc_14000102E",
      ins: [
        { addr: "14000102E", m: "pop", o: "rbp", b: "5D" },
        { addr: "14000102F", m: "ret", o: "", b: "C3" },
      ],
    },
  ],
  xrefs: [
    { type: "call", ref: "call sub_140001020 ← sub_140001000+4" },
    { type: "jump", ref: "jl loc_140001026 ← 14000102C" },
  ],
};

const FUNCS = [FN1, FN2];

const REGS = new Set([
  "rax", "rbx", "rcx", "rdx", "rsi", "rdi", "rsp", "rbp",
  "eax", "ebx", "ecx", "edx", "esi", "edi", "esp", "ebp",
]);

type TokenKind = "reg" | "hex" | "label" | "plain";

interface Token {
  t: string;
  k: TokenKind;
}

function colorOperands(o: string): Token[] {
  const tokens: Token[] = [];
  for (const part of o.split(/(,|\s+)/)) {
    if (!part) continue;
    if (/^\s+$|^,$/.test(part)) tokens.push({ t: part, k: "plain" });
    else if (REGS.has(part)) tokens.push({ t: part, k: "reg" });
    else if (/^\d+$/.test(part)) tokens.push({ t: part, k: "hex" });
    else if (/^(short|loc_|sub_)/.test(part)) tokens.push({ t: part, k: "label" });
    else tokens.push({ t: part, k: "plain" });
  }
  return tokens;
}

const TD_CLASSES: Record<TokenKind, string> = {
  reg: "text-signal-300",
  hex: "text-gilt-300",
  label: "text-gilt-300",
  plain: "text-ink-200",
};

const TS_FILL: Record<TokenKind, string> = {
  reg: "fill-signal-300",
  hex: "fill-gilt-300",
  label: "fill-gilt-300",
  plain: "fill-ink-300",
};

const HEAD_H = 30;
const ROW_H = 26;
const PAD_B = 12;
const BLOCK_X = 92;
const BLOCK_W = 268;
const GAP_Y = 86;

function blockHeight(block: Block) {
  return HEAD_H + block.ins.length * ROW_H + PAD_B;
}

interface BlockPos {
  id: string;
  y: number;
  h: number;
}

function layout(fn: DemoFunction): BlockPos[] {
  const positions: BlockPos[] = [];
  let y = 30;
  for (const block of fn.blocks) {
    const h = blockHeight(block);
    positions.push({ id: block.id, y, h });
    y += h + GAP_Y;
  }
  return positions;
}

function GraphPane({
  fn,
  selectedIns,
  onSelectIns,
}: {
  fn: DemoFunction;
  selectedIns: string;
  onSelectIns: (fnId: string, addr: string) => void;
}) {
  const positions = useMemo(() => layout(fn), [fn]);
  const byId = useMemo(() => new Map(positions.map((p) => [p.id, p])), [positions]);

  const selectedBlock = useMemo(() => {
    for (const b of fn.blocks) {
      if (b.ins.some((i) => i.addr === selectedIns)) return b.id;
    }
    return null;
  }, [fn, selectedIns]);

  return (
    <svg
      viewBox="0 0 480 560"
      className="h-auto w-full max-w-md"
      role="img"
      aria-label={`Illustrated control-flow graph of ${fn.name} with basic blocks joined by fall-through edges${fn.id === "fn2" ? " and a conditional loop edge" : ""}`}
    >
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 1 L9 5 L0 9 Z" fill="#6b7490" />
        </marker>
        <marker id="arrow-loop" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0 1 L9 5 L0 9 Z" fill="#d9b86a" />
        </marker>
      </defs>

      <g fill="none" strokeLinejoin="round" strokeLinecap="round">
        {fn.blocks.flatMap((block) =>
          (block.edges ?? []).map((edge) => {
            const from = byId.get(block.id);
            const to = byId.get(edge.to);
            if (!from || !to) return null;
            const isLoop = edge.type === "loop";
            const isActive = selectedBlock === block.id;
            const color = isLoop ? "#d9b86a" : isActive ? "#9d8df7" : "#4b5470";
            const d = isLoop
              ? `M ${BLOCK_X + BLOCK_W - 4} ${from.y + from.h - 14} H ${BLOCK_X + BLOCK_W + 60} V ${from.y + HEAD_H + 8} H ${BLOCK_X + BLOCK_W + 6}`
              : `M ${BLOCK_X + BLOCK_W / 2} ${from.y + from.h} V ${to.y - 6}`;
            return (
              <path
                key={`${block.id}-${edge.to}-${edge.type}`}
                d={d}
                stroke={color}
                strokeWidth={isActive || isLoop ? 1.75 : 1.25}
                strokeDasharray={isLoop ? "6 8" : undefined}
                markerEnd={isLoop ? "url(#arrow-loop)" : "url(#arrow)"}
                opacity={isLoop ? 0.95 : isActive ? 1 : 0.65}
                className={isLoop ? "edge-flow" : undefined}
              />
            );
          }),
        )}
      </g>

      {fn.blocks.map((block, bi) => {
        const pos = positions[bi];
        const isSel = selectedBlock === block.id;
        return (
          <g
            key={block.id}
            role="button"
            tabIndex={0}
            aria-label={`Basic block ${block.label}, ${block.ins.length} instructions`}
            onClick={() => onSelectIns(fn.id, block.ins[0].addr)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectIns(fn.id, block.ins[0].addr);
              }
            }}
            className={`cursor-pointer outline-none rounded-lg focus-visible:ring-2 focus-visible:ring-royal-400 transition-opacity hover:opacity-95`}
          >
            <rect
              x={BLOCK_X}
              y={pos.y}
              width={BLOCK_W}
              height={pos.h}
              rx="8"
              fill="#12151f"
              stroke={isSel ? "#9d8df7" : "#252b3d"}
              strokeWidth={isSel ? 1.5 : 1}
              style={isSel ? { filter: "drop-shadow(0 0 12px rgba(157,141,247,0.35))" } : undefined}
            />
            <text x={BLOCK_X + 12} y={pos.y + 19} fontSize="11" fontWeight="600" className="fill-ink-200 font-mono">
              {block.label}:
            </text>
            {block.ins.map((ins, i) => {
              const isSelected = selectedIns === ins.addr;
              return (
                <g
                  key={ins.addr}
                  role="button"
                  tabIndex={-1}
                  aria-label={`${ins.m} ${ins.o ?? ""}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectIns(fn.id, ins.addr);
                  }}
                  className="cursor-pointer"
                >
                  <rect
                    x={BLOCK_X + 6}
                    y={pos.y + HEAD_H + i * ROW_H}
                    width={BLOCK_W - 12}
                    height={ROW_H - 2}
                    rx="4"
                    fill={isSelected ? "rgba(115,100,226,0.30)" : "transparent"}
                  />
                  <text
                    x={BLOCK_X + 16}
                    y={pos.y + HEAD_H + i * ROW_H + 16}
                    fontSize="10.5"
                    fontFamily="var(--font-mono)"
                  >
                    <tspan className="fill-ink-50" fontWeight="600">
                      {ins.m}
                    </tspan>
                    {ins.o
                      ? colorOperands(ins.o).map((tok, ti) => (
                          <tspan key={ti} className={TS_FILL[tok.k]}>
                            {tok.t}
                          </tspan>
                        ))
                      : null}
                  </text>
                </g>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export function InteractiveDemo() {
  const [fnId, setFnId] = useState<DemoFunction["id"]>("fn2");
  const [fn1Sel, setFn1Sel] = useState("140001004");
  const [fn2Sel, setFn2Sel] = useState("14000102C");
  const selected = fnId === "fn1" ? fn1Sel : fn2Sel;
  const fn = FUNCS.find((f) => f.id === fnId) ?? FN2;

  const select = (targetFn: string, addr: string) => {
    if (targetFn === "fn1") {
      setFn1Sel(addr);
      setFnId("fn1");
    } else {
      setFn2Sel(addr);
      setFnId("fn2");
    }
  };

  const currentBlock = fn.blocks.find((b) => b.ins.some((i) => i.addr === selected));
  const xrefs = fn.xrefs.filter(
    (x) => x.type === "call" || (x.type === "jump" && currentBlock?.id === "B"),
  );

  return (
    <section id="demo" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Interactive"
          title={
            <>
              The workflow, <span className="text-gradient">in miniature</span>
            </>
          }
          lede="An interactive illustration modelled on the repository's deterministic two-function ura64.exe fixture — not live binary analysis. Select rows in the linear listing; the graph and xref strip follow, the way Space flips between views in the real application."
        />

        <Reveal className="mt-12" delay={0.05}>
          <div className="overflow-hidden rounded-2xl border border-ink-600/70 bg-ink-900 shadow-window">
            <div className="flex items-center gap-2 border-b border-ink-700/70 bg-ink-850 px-3.5 py-2.5">
              <span aria-hidden className="flex gap-1.5">
                <span className="size-2.5 rounded-full bg-ink-600" />
                <span className="size-2.5 rounded-full bg-ink-600" />
                <span className="size-2.5 rounded-full bg-royal-600/80" />
              </span>
              <span className="ml-1.5 font-mono text-[0.6875rem] text-ink-300">
                ura-native.exe — Linear | Graph
              </span>
              <span className="ml-auto hidden rounded border border-gilt-500/30 bg-gilt-500/10 px-2 py-0.5 font-mono text-[0.625rem] text-gilt-300/90 sm:block">
                Interactive illustration
              </span>
            </div>

            <div className="grid lg:grid-cols-[190px_minmax(0,1fr)_minmax(0,30.5rem)]">
              <div className="border-b border-ink-700/60 lg:border-r lg:border-b-0">
                <div className="border-b border-ink-700/60 bg-ink-850/70 px-3.5 py-2 font-mono text-[0.625rem] tracking-wider text-ink-400 uppercase">
                  Functions
                </div>
                <ul className="p-2" aria-label="Functions">
                  {FUNCS.map((f) => (
                    <li key={f.id}>
                      <button
                        type="button"
                        onClick={() => setFnId(f.id)}
                        aria-pressed={f.id === fnId}
                        className={`mb-1 w-full rounded-md px-2.5 py-2 text-left font-mono text-xs transition-colors ${
                          f.id === fnId
                            ? "bg-royal-600/25 text-ink-50 ring-1 ring-royal-500/50"
                            : "text-ink-300 hover:bg-ink-800 hover:text-ink-50"
                        }`}
                      >
                        <span aria-hidden className={f.id === fnId ? "text-signal-400" : "text-ink-500"}>
                          f{" "}
                        </span>
                        {f.name}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="hidden px-3.5 pb-3 text-[0.625rem] leading-4 text-ink-500 lg:block">
                  Follow the highlighted call target to hop between functions.
                </div>
              </div>

              <div className="border-b border-ink-700/60 lg:border-r lg:border-b-0">
                <div className="flex items-center justify-between border-b border-ink-700/60 bg-ink-850/70 px-3.5 py-2">
                  <span className="font-mono text-[0.625rem] tracking-wider text-ink-400 uppercase">
                    {fn.name} · linear
                  </span>
                  <span className="hidden font-mono text-[0.625rem] text-ink-500 md:block">
                    Space toggles graph in the app
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[27rem] border-collapse font-mono text-[0.75rem] leading-[1.8]">
                    <tbody>
                      {fn.blocks.map((block) => (
                        <Fragment key={block.id}>
                          <tr>
                            <td
                              colSpan={4}
                              className="border-t border-ink-700/50 bg-ink-850/50 px-3 pt-1.5 pb-0.5 font-mono text-[0.6875rem] font-semibold text-gilt-300"
                            >
                              {block.label}:
                            </td>
                          </tr>
                          {block.ins.map((ins) => {
                            const isSel = selected === ins.addr;
                            return (
                              <tr
                                key={ins.addr}
                                onClick={() => select(fn.id, ins.addr)}
                                className={`cursor-pointer border-t border-ink-800/60 transition-colors ${
                                  isSel ? "bg-royal-700/25" : "hover:bg-ink-850"
                                }`}
                              >
                                <td className="w-24 px-3 py-[3px] text-[0.6875rem] text-ink-500">
                                  {ins.addr}
                                </td>
                                <td className="w-14 py-[3px] font-semibold text-ink-50">{ins.m}</td>
                                <td className="py-[3px] pr-2">
                                  {ins.o ? (
                                    ins.follow?.fn ? (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          select(ins.follow!.fn!, ins.addr);
                                        }}
                                        className="rounded px-1 text-signal-300 underline decoration-signal-500/40 underline-offset-2 transition-colors hover:bg-signal-500/10"
                                        title="Follow call target"
                                      >
                                        {ins.o}
                                      </button>
                                    ) : (
                                      <span>
                                        {colorOperands(ins.o).map((tok, ti) => (
                                          <span key={ti} className={TD_CLASSES[tok.k]}>
                                            {tok.t}
                                          </span>
                                        ))}
                                      </span>
                                    )
                                  ) : null}
                                </td>
                                <td className="w-28 px-3 py-[3px] text-right text-[0.6875rem] text-ink-500">
                                  {ins.b}
                                </td>
                              </tr>
                            );
                          })}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex items-start justify-center bg-ink-850/30 p-4">
                <GraphPane fn={fn} selectedIns={selected} onSelectIns={select} />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 border-t border-ink-700/70 bg-ink-850 px-3.5 py-2.5 font-mono text-[0.6875rem]">
              <span className="text-ink-500">xrefs</span>
              {xrefs.map((x) => (
                <span
                  key={x.ref}
                  className={`rounded border px-2 py-0.5 ${
                    x.type === "call"
                      ? "border-signal-500/30 bg-signal-500/10 text-signal-300"
                      : "border-gilt-500/30 bg-gilt-500/10 text-gilt-300"
                  }`}
                >
                  {x.ref}
                </span>
              ))}
              <span className="ml-auto hidden text-ink-500 sm:block">
                2 functions · 2 xrefs · x86-64
              </span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.15}>
          <p className="mt-4 text-center text-xs text-ink-400">
            Geometry, bytes and flow are illustrative renderings of{" "}
            <a
              href="https://github.com/entrenchedosx/URA/tree/main/tests/fixtures"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-300 underline decoration-ink-600 underline-offset-2 transition-colors hover:text-royal-300"
            >
              tests/fixtures/ura64.exe
            </a>
            . Run the real app on your own samples — nothing is uploaded, nothing is executed by
            URA.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
