import { BookOpen, ExternalLink, Keyboard } from "lucide-react";
import { DOC_LINKS } from "../lib/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

const SHORTCUTS: Array<[string, string]> = [
  ["Ctrl+O", "Open a binary"],
  ["Ctrl+N", "Create a project"],
  ["Ctrl+G / Ctrl+K", "Address, symbol, offset or command navigation"],
  ["Alt+← / Alt+→", "Navigation history"],
  ["Space", "Switch linear disassembly and graph"],
  ["F5", "Open pseudocode; mapped assembly selection highlights contributing source"],
  ["Enter", "Follow selected direct branch or call"],
  ["F2", "Rename function"],
  ["Ctrl+S", "Save project workspace"],
  ["Ctrl+,", "Preferences"],
  ["Alt+F/E/J/S/V/D/O/W/H", "Top menus"],
];

export function Docs() {
  return (
    <section id="docs" className="relative scroll-mt-24 py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_55%_100%_at_50%_0%,rgb(115,100,226,0.06),transparent_70%)]"
      />
      <div className="container-site relative">
        <SectionHeading
          eyebrow="Documentation"
          title={
            <>
              Everything lives <span className="text-gradient">in the repository</span>
            </>
          }
          lede="The project's docs are versioned beside its source — always current, never stale copies on a marketing site. Start here, then follow the pinned links."
        />

        {/* quickstart */}
        <Reveal className="mt-12" delay={0.05}>
          <div className="grid gap-8 rounded-2xl hairline bg-ink-900/60 p-6 sm:p-8 lg:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
                <BookOpen className="size-5 text-royal-300" aria-hidden />
                Getting started
              </h3>
              <ol className="mt-4 flex flex-col gap-3 text-sm text-ink-300">
                {[
                  ["Get URA", "Download a published archive below, or build from source with cargo (Rust 1.95+, MSVC)."],
                  ["Open a sample", "Launch with a path, or press Ctrl+O once the window is up. Analysis runs on a background worker."],
                  ["Persist your work", "Create a project with Ctrl+N — annotations, renames and manual starts survive reopen."],
                  ["Navigate", "Ctrl+G / Ctrl+K to jump anywhere; Enter follows the selected branch. Space flips linear ⇄ graph."],
                  ["Decompile (v0.9 dev)", "Press F5 for reconstructed C-like pseudocode, then click any line to link it back to machine evidence."],
                ].map(([title, body], i) => (
                  <li key={title} className="flex items-start gap-3">
                    <span
                      aria-hidden
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-royal-500/40 bg-royal-600/15 font-mono text-[0.6875rem] font-semibold text-royal-200"
                    >
                      {i + 1}
                    </span>
                    <span>
                      <span className="font-semibold text-ink-100">{title}.</span>{" "}
                      {body}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
                <Keyboard className="size-5 text-royal-300" aria-hidden />
                Keyboard reference
              </h3>
              <table className="mt-4 w-full text-left text-sm">
                <tbody className="divide-y divide-ink-700/50">
                  {SHORTCUTS.map(([keys, action]) => (
                    <tr key={keys}>
                      <td className="py-2 pr-4 align-top whitespace-nowrap">
                        <kbd>{keys}</kbd>
                      </td>
                      <td className="py-2 text-ink-300">{action}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-3 font-mono text-[0.6875rem] text-ink-500">
                Addresses are hexadecimal with an optional 0x prefix; the desktop also accepts @offset, relative deltas and expressions such as .text+10.
              </p>
            </div>
          </div>
        </Reveal>

        {/* doc index */}
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DOC_LINKS.map((doc, i) => (
            <Reveal key={doc.title} delay={0.03 * (i % 3)}>
              <a
                href={doc.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex h-full flex-col rounded-xl hairline bg-ink-900/50 p-5 transition-colors hover:border-royal-500/40 hover:bg-ink-850"
              >
                <span className="mb-3 inline-flex w-fit items-center rounded-full border border-ink-600/70 bg-ink-850 px-2.5 py-1 font-mono text-[0.625rem] tracking-wider text-ink-400 uppercase group-hover:border-royal-500/40 group-hover:text-royal-300">
                  {doc.tag}
                </span>
                <h3 className="flex items-center justify-between gap-2 font-mono text-[0.9375rem] font-semibold text-ink-50">
                  {doc.title}
                  <ExternalLink className="size-3.5 shrink-0 text-ink-500 transition-colors group-hover:text-royal-300" aria-hidden />
                </h3>
                <p className="mt-2 text-[0.8125rem] leading-relaxed text-ink-300">{doc.description}</p>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
