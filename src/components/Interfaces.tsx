import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { AppWindow, FileCog, Server } from "lucide-react";
import { useState } from "react";
import { asset } from "../lib/site";
import { CodeBlock } from "./ui/CodeBlock";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";
import { EASE } from "./ui/Reveal";

const CLI_SAMPLE = `ura-cli info sample.exe --json
ura-cli functions sample.exe --limit 50 --sort name --json
ura-cli disasm sample.exe --address 140001000 --count 20 --json
ura-cli cfg sample.exe --function 140001020 --json
ura-cli hex sample.exe --offset 200 --length 32 --json`;

const MCP_CONFIG = `{
  "mcpServers": {
    "ura": {
      "command": "C:/tools/URA/ura-mcp.exe",
      "args": ["--allow", "C:/samples"]
    }
  }
}`;

const MCP_FLOW = [
  { tool: "ura_open_binary", text: "open a sample, get a handle" },
  { tool: "ura_analyze", text: "run analysis within bounded resources" },
  { tool: "ura_get_*", text: "query info, functions, disasm, CFG, xrefs, strings, bytes" },
  { tool: "ura_close_binary", text: "release the handle" },
];

type Tab = "desktop" | "cli" | "mcp";

const TABS: Array<{ id: Tab; label: string; icon: LucideIcon }> = [
  { id: "desktop", label: "Desktop", icon: AppWindow },
  { id: "cli", label: "CLI", icon: FileCog },
  { id: "mcp", label: "MCP", icon: Server },
];

export function Interfaces() {
  const [tab, setTab] = useState<Tab>("desktop");

  return (
    <section id="interfaces" className="relative scroll-mt-24 py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-24 h-72 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgb(115,100,226,0.07),transparent_70%)]"
      />
      <div className="container-site relative">
        <SectionHeading
          eyebrow="Three interfaces"
          title={
            <>
              Desktop, CLI and <span className="text-gradient">MCP — one engine</span>
            </>
          }
          lede="Every interface drives the same analysis core; nothing is reimplemented twice. Pick the surface that fits the task — or compose all three."
        />

        <Reveal className="mt-10 flex justify-center" delay={0.05}>
          <div
            role="tablist"
            aria-label="URA interfaces"
            className="flex w-fit gap-1 rounded-xl border border-ink-700/70 bg-ink-900/70 p-1 backdrop-blur"
          >
            {TABS.map((t) => {
              const selected = t.id === tab;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={selected}
                  aria-controls="interfaces-panel"
                  onClick={() => setTab(t.id)}
                  className={`relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors sm:px-5 ${
                    selected ? "text-ink-50" : "text-ink-300 hover:text-ink-50"
                  }`}
                >
                  {selected && (
                    <motion.span
                      layoutId="interface-pill"
                      className="absolute inset-0 rounded-lg bg-ink-700/90 ring-1 ring-ink-600/60"
                      transition={{ type: "spring", stiffness: 460, damping: 38 }}
                    />
                  )}
                  <t.icon className="relative z-10 size-4" aria-hidden />
                  <span className="relative z-10">{t.label}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <div id="interfaces-panel" role="tabpanel" className="mt-8">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {tab === "desktop" && (
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      A compact native workspace, not a wrapped webview
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-300">
                      The default application is entirely Rust — eframe, egui and OpenGL rendering,
                      with a single shared foundation for both classic and professional dark
                      themes. Analysis and string scanning run on a background worker, so the
                      interface stays responsive.
                    </p>
                    <ul className="mt-5 grid gap-2 text-sm text-ink-200 sm:grid-cols-2">
                      {[
                        "Dockable functions, disasm, graph, hex, strings, xrefs, inspector panels",
                        "Pan/zoom/fit CFG from real analysis blocks",
                        "Tabs move, close and reopen; layout reset",
                        "Graph capped honestly: 240 blocks, 32 ins/block",
                        "Inspector edits annotations; F2 renames",
                        "Ctrl+G / Ctrl+K navigates anywhere",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-royal-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6 flex flex-wrap gap-1.5 font-mono text-[0.6875rem] text-ink-400">
                      {["Ctrl+O open", "Ctrl+N project", "Space view toggle", "Ctrl+S save", "Alt+← history"].map(
                        (k) => (
                          <span key={k} className="rounded border border-ink-600/60 bg-ink-850 px-2 py-1">
                            {k}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-xl border border-ink-600/70 shadow-window">
                    <img
                      src={asset("/screenshots/classic-graph.png")}
                      alt="URA classic light theme, graph view with a loop edge and docked panels"
                      width={1440}
                      height={900}
                      loading="lazy"
                      decoding="async"
                      className="block w-full"
                    />
                  </div>
                </div>
              )}

              {tab === "cli" && (
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      Headless analysis with structured output
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-300">
                      The CLI starts no GUI. Eight commands — info, analyze, functions, disasm,
                      strings, xrefs, cfg and hex — answer in text or JSON with{" "}
                      <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-xs text-signal-300">
                        schemaVersion: 1
                      </code>
                      . Errors are structured and exit non-zero; paths must resolve inside{" "}
                      <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-xs text-signal-300">
                        --allow
                      </code>{" "}
                      roots.
                    </p>
                    <ul className="mt-5 flex flex-col gap-2 text-sm text-ink-200">
                      <li className="flex items-start gap-2">
                        <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-royal-400" />
                        Addresses accept expressions like <code className="font-mono text-xs">.text+10</code> or <code className="font-mono text-xs">@200</code> offsets
                      </li>
                      <li className="flex items-start gap-2">
                        <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-royal-400" />
                        Read-only project attachment without schema migration
                      </li>
                      <li className="flex items-start gap-2">
                        <span aria-hidden className="mt-[7px] size-1.5 shrink-0 rounded-full bg-royal-400" />
                        Same DTOs as MCP — test against either surface
                      </li>
                    </ul>
                  </div>
                  <CodeBlock lang="shell" title="ura-cli — verified commands" code={CLI_SAMPLE} />
                </div>
              )}

              {tab === "mcp" && (
                <div className="grid items-center gap-8 lg:grid-cols-2">
                  <div>
                    <h3 className="text-xl font-semibold tracking-tight">
                      AI-assisted workflows over stdio
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-300">
                      Configure any MCP client to launch{" "}
                      <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-xs text-signal-300">
                        ura-mcp
                      </code>{" "}
                      locally. No network listener is started — stdout carries MCP JSON only, logs
                      go to stderr. Write tools are refused unless the process was started with{" "}
                      <code className="rounded bg-ink-800 px-1.5 py-0.5 font-mono text-xs text-signal-300">
                        --enable-writes
                      </code>{" "}
                      and an attached project.
                    </p>
                    <ol className="mt-5 flex flex-col gap-2.5 text-sm text-ink-200">
                      {MCP_FLOW.map((step, i) => (
                        <li key={step.tool} className="flex items-center gap-3">
                          <span
                            aria-hidden
                            className="flex size-6 shrink-0 items-center justify-center rounded-full border border-royal-500/40 bg-royal-600/15 font-mono text-[0.625rem] text-royal-200"
                          >
                            {i + 1}
                          </span>
                          <code className="font-mono text-[0.8125rem] text-signal-300">{step.tool}</code>
                          <span className="text-xs text-ink-400">{step.text}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  <CodeBlock lang="json" title="MCP client configuration" code={MCP_CONFIG} />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
