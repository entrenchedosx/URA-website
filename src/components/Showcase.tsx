import { AnimatePresence, motion } from "framer-motion";
import { Camera } from "lucide-react";
import { useState } from "react";
import { REPO, asset } from "../lib/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { EASE } from "./ui/Reveal";

const SHOTS = [
  {
    id: "dark-graph",
    src: asset("/screenshots/dark-graph.png"),
    tab: "Dark · Graph",
    title: "Professional dark theme — graph view",
    body: "The modern dark theme with the CFG built from actual analysis blocks. Pan, zoom, fit and inspect blocks alongside the docked Functions, Graph overview, Output and Inspector panels.",
    points: [
      "Real analysis blocks — not a static illustration",
      "Pan / zoom / fit with an interactive graph overview",
      "Tabbed panels: Disassembly, Graph, Hex View, Strings, Xrefs, Inspector",
    ],
  },
  {
    id: "classic-graph",
    src: "/screenshots/classic-graph.png",
    tab: "Classic · Graph",
    title: "Classic light theme — graph view",
    body: "The compact classic theme. Variable-width CFG blocks show instructions with addresses, mnemonics and operands; loop edges and taken/not-taken arcs are drawn from the real control-flow result.",
    points: [
      "Both themes share one rendering implementation",
      "Selected block highlights flow through the function",
      "Dense function browser with search and origin badges",
    ],
  },
  {
    id: "classic-disasm",
    src: "/screenshots/classic-disassembly.png",
    tab: "Classic · Linear",
    title: "Classic light theme — linear disassembly",
    body: "The linear listing with bytes, flow classification and direct targets. Keyboard-first: navigate with arrows, follow a direct branch or call with Enter, and toggle to the graph with Space.",
    points: [
      "Bytes, flow classification and direct targets per instruction",
      "Branch following, navigation history and go-to anywhere",
      "Status bar reports the live selection and xref counts",
    ],
  },
] as const;

export function Showcase() {
  const [shot, setShot] = useState<(typeof SHOTS)[number]["id"]>("dark-graph");
  const current = SHOTS.find((s) => s.id === shot) ?? SHOTS[0];

  return (
    <section id="showcase" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Showcase"
          title={
            <>
              This is <span className="text-gradient">the actual workbench</span>
            </>
          }
          lede="Captures of URA's native renderer running the deterministic regression fixture — the same images committed to the repository's documentation. What you see is what the engine produced."
        />

        <Reveal className="mt-12" delay={0.05}>
          <div
            role="tablist"
            aria-label="Showcase views"
            className="mx-auto flex w-fit max-w-full flex-wrap justify-center gap-1 rounded-xl border border-ink-700/70 bg-ink-900/70 p-1 backdrop-blur"
          >
            {SHOTS.map((s) => {
              const selected = s.id === shot;
              return (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="showcase-panel"
                  onClick={() => setShot(s.id)}
                  className={`relative rounded-lg px-4 py-2 text-[0.8125rem] font-medium whitespace-nowrap transition-colors ${
                    selected ? "text-ink-50" : "text-ink-300 hover:text-ink-50"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="showcase-pill"
                      className="absolute inset-0 rounded-lg bg-ink-700/90 ring-1 ring-ink-600/60"
                      transition={{ type: "spring", stiffness: 460, damping: 38 }}
                    />
                  )}
                  <span className="relative z-10 font-mono">{s.tab}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal className="mt-8" delay={0.1}>
          <div
            id="showcase-panel"
            role="tabpanel"
            aria-label={`Showcase: ${current.tab}`}
            className="relative overflow-hidden rounded-2xl border border-ink-700/70 bg-ink-900/60 shadow-card"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.985 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_360px]"
              >
                <div className="border-b border-ink-700/60 lg:border-r lg:border-b-0">
                  <img
                    src={current.src}
                    alt={`URA desktop — ${current.title}`}
                    width={1440}
                    height={900}
                    loading="lazy"
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </div>
                <div className="flex flex-col gap-5 p-6 lg:p-7">
                  <div>
                    <p className="mb-2 flex items-center gap-2 text-[0.6875rem] font-semibold tracking-[0.2em] text-signal-400/90 uppercase">
                      <Camera className="size-3.5" aria-hidden />
                      Actual capture
                    </p>
                    <h3 className="text-lg font-semibold tracking-tight">{current.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-300">{current.body}</p>
                  </div>
                  <ul className="flex flex-col gap-2.5 text-sm text-ink-200">
                    {current.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-royal-400" />
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-auto text-xs text-ink-400">
                    Fixture-driven capture, committed in{" "}
                    <a
                      href={`${REPO.url}/tree/main/docs/screenshots`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-ink-300 underline decoration-ink-600 underline-offset-2 transition-colors hover:text-royal-300"
                    >
                      docs/screenshots
                    </a>
                    .
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
