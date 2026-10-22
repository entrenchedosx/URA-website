import { motion, useReducedMotion, useSpring } from "framer-motion";
import { Download, FlaskConical, Scale, ShieldCheck, Terminal } from "lucide-react";
import { useEffect, useRef } from "react";
import { asset, REPO } from "../lib/site";
import { EASE } from "./ui/Reveal";

const CHIPS = [
  { icon: Terminal, label: "Windows x64 builds" },
  { icon: FlaskConical, label: "F5 pseudocode in v0.9 dev" },
  { icon: Scale, label: "MIT license" },
  { icon: ShieldCheck, label: "Local-only analysis" },
] as const;

export function Hero() {
  const reduce = useReducedMotion();
  const windowRef = useRef<HTMLDivElement>(null);
  const rx = useSpring(0, { stiffness: 120, damping: 18 });
  const ry = useSpring(0, { stiffness: 120, damping: 18 });
  const tilt = useRef(false);

  useEffect(() => {
    tilt.current = !reduce && window.matchMedia("(pointer: fine)").matches;
  }, [reduce]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!tilt.current || !windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ry.set(px * 2.6);
    rx.set(py * -2.2);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-20 sm:pt-40">
      {/* atmosphere */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black_35%,transparent_78%)]" />
        <div className="absolute -top-40 left-1/2 h-[34rem] w-[52rem] -translate-x-1/2 rounded-full bg-royal-600/[0.13] blur-[110px]" />
        <div className="absolute top-64 left-[12%] h-72 w-72 rounded-full bg-signal-500/[0.07] blur-[100px]" />
        <div className="absolute top-80 right-[10%] h-72 w-72 rounded-full bg-gilt-500/[0.05] blur-[100px]" />
      </div>

      <div className="container-site relative">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          {/* icon */}
          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.86, y: 10 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
            className="relative mb-8"
          >
            <div aria-hidden className="absolute -inset-6 rounded-[2rem] bg-royal-500/15 blur-2xl" />
            <div className="relative rounded-2xl p-[3px]">
              <img
                src={asset("/icon.webp")}
                alt="Official URA artwork — a 19th-century portrait"
                width={112}
                height={112}
                className="relative size-24 rounded-2xl object-cover ring-1 ring-white/20 sm:size-28"
                loading="eager"
                decoding="async"
              />
              <span
                aria-hidden
                className="absolute inset-x-6 -bottom-px h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
              />
            </div>
          </motion.div>

          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: EASE }}
            className="mb-5 text-[0.6875rem] font-semibold tracking-[0.28em] text-royal-300 uppercase"
          >
            URA — Ultimate Reverse Engineer
          </motion.p>

          <motion.h1
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.16, ease: EASE }}
            className="text-[clamp(2.75rem,7vw,4.75rem)] leading-[1.02] font-semibold tracking-[-0.03em]"
          >
            <span className="text-ink-50">See beyond</span>{" "}
            <span className="text-gradient">the binary.</span>
          </motion.h1>

          <motion.p
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.26, ease: EASE }}
            className="mt-6 max-w-2xl text-base leading-relaxed text-ink-200 sm:text-lg"
          >
            A native Rust static-analysis workbench for executable files. Inspect binaries,
            discover functions, and walk control flow from a compact native desktop — and with the{" "}
            <a
              href="#decompiler"
              className="text-royal-300 underline decoration-royal-500/30 underline-offset-2 transition-colors hover:text-royal-200"
            >
              v0.9.0-dev source checkpoint
            </a>
            , press F5 for reconstructed C-like pseudocode. The same engine runs headless through a
            text/JSON CLI and an MCP server; samples are read locally and never executed.
          </motion.p>

          <motion.div
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 22 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.36, ease: EASE }}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row"
          >
            <a
              href="#downloads"
              className="group inline-flex items-center gap-2.5 rounded-xl bg-royal-600 px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_36px_-10px_rgb(115,100,226/0.8)] transition-all hover:-translate-y-0.5 hover:bg-royal-500 hover:shadow-[0_16px_40px_-10px_rgb(115,100,226/0.9)]"
            >
              <Download className="size-4 transition-transform group-hover:translate-y-0.5" aria-hidden />
              Download URA
              <span aria-hidden className="font-mono text-[0.6875rem] font-normal text-white/70">
                v0.6
              </span>
            </a>
            <a
              href={REPO.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-xl border border-ink-600/80 bg-ink-800/50 px-6 py-3 text-sm font-semibold text-ink-100 backdrop-blur transition-all hover:-translate-y-0.5 hover:border-ink-400 hover:bg-ink-750"
            >
              <svg viewBox="0 0 16 16" className="size-4 fill-current" aria-hidden>
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
              </svg>
              View on GitHub
            </a>
          </motion.div>

          <motion.ul
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.46, ease: EASE }}
            className="mt-10 flex flex-wrap items-center justify-center gap-2"
            aria-label="Project status"
          >
            {CHIPS.map((chip) => (
              <li
                key={chip.label}
                className="inline-flex items-center gap-1.5 rounded-full border border-ink-700/80 bg-ink-850/70 px-3 py-1.5 text-xs text-ink-300"
              >
                <chip.icon className="size-3.5 text-royal-300/80" aria-hidden />
                {chip.label}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* application showcase */}
        <motion.div
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 48 }}
          animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: EASE }}
          className="relative mx-auto mt-16 max-w-5xl sm:mt-20"
          style={{ perspective: 1400 }}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
        >
          <motion.div
            ref={windowRef}
            style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
            className="relative"
          >
            <div
              aria-hidden
              className="absolute -inset-x-8 -top-10 bottom-16 -z-10 rounded-[2rem] bg-gradient-to-b from-royal-500/[0.14] via-signal-500/[0.06] to-transparent blur-2xl"
            />
            <div className="overflow-hidden rounded-xl border border-ink-600/70 bg-ink-800 shadow-window">
              <div className="flex items-center gap-2 border-b border-ink-700/70 bg-ink-850 px-3.5 py-2.5">
                <span aria-hidden className="flex gap-1.5">
                  <span className="size-2.5 rounded-full bg-ink-600" />
                  <span className="size-2.5 rounded-full bg-ink-600" />
                  <span className="size-2.5 rounded-full bg-royal-600/80" />
                </span>
                <span className="ml-1.5 font-mono text-[0.6875rem] text-ink-300">
                  ura-native.exe — URA 0.6 · professional dark
                </span>
                <span className="ml-auto hidden rounded border border-ink-600/60 bg-ink-900/80 px-2 py-0.5 font-mono text-[0.625rem] text-signal-400 sm:block">
                  ura64.exe
                </span>
              </div>
              <img
                src={asset("/screenshots/dark-graph.png")}
                alt="URA 0.6 native workspace in the professional dark theme, showing the graph view of function sub_140001020 from the ura64.exe fixture, with docked Functions, Output and Graph overview panels"
                width={1440}
                height={900}
                className="block w-full"
                loading="eager"
                decoding="async"
              />
            </div>
          </motion.div>

          <p className="mt-4 text-center text-xs text-ink-400">
            Actual capture of URA's native renderer, analyzing the deterministic regression fixture —
            not simulated analysis.{" "}
            <a
              href={`${REPO.url}/blob/main/docs/VERIFICATION-0.6.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-300 underline decoration-ink-600 underline-offset-2 transition-colors hover:text-royal-300"
            >
              Verification notes
            </a>
          </p>

          <ul
            aria-label="At a glance"
            className="mx-auto mt-10 flex max-w-3xl flex-wrap items-center justify-center gap-x-2 gap-y-2 rounded-xl border border-ink-700/60 bg-ink-900/60 px-4 py-3 font-mono text-[0.6875rem] text-ink-300 backdrop-blur"
          >
            {[
              "PE · ELF · Mach-O",
              "x86 & x86-64 analysis",
              "C-like pseudocode (v0.9 dev)",
              "9 CLI commands",
              "MCP · 32 tools",
              "512 MiB input cap",
            ].map((item, i, arr) => (
              <li key={item} className="flex items-center gap-2">
                {item}
                {i < arr.length - 1 && <span aria-hidden className="text-ink-600">·</span>}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
