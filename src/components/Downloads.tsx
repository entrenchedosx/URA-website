import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowDownToLine, FileJson, GitBranch, Info, RefreshCw, ShieldCheck, Terminal, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { formatBytes, formatDate, shortHash } from "../lib/format";
import { CHECKPOINT_09, RELEASE_CONTEXT, fetchReleases, type Release, type ReleasesState } from "../lib/releases";
import { CodeBlock, CopyButton } from "./ui/CodeBlock";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

function Badge({ tone, children }: { tone: "amber" | "royal" | "signal"; children: React.ReactNode }) {
  const tones = {
    amber: "border-amber-warn/30 bg-amber-warn/10 text-amber-warn",
    royal: "border-royal-500/40 bg-royal-600/15 text-royal-200",
    signal: "border-signal-500/40 bg-signal-500/10 text-signal-300",
  } as const;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

function AssetRow({ name, size, downloadUrl, isChecksum }: {
  name: string;
  size: number;
  downloadUrl: string;
  isChecksum: boolean;
}) {
  return (
    <a
      href={downloadUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-lg border border-ink-700/60 bg-ink-850/60 px-3.5 py-2.5 transition-colors hover:border-royal-500/40 hover:bg-ink-800"
      download
    >
      <span className="flex w-full items-center gap-3">
        <FileJson className={isChecksum ? "size-4 shrink-0 text-ink-500" : "size-4 shrink-0 text-signal-400"} aria-hidden />
        <span className="min-w-0 flex-1 truncate font-mono text-[0.8125rem] text-ink-100 group-hover:text-ink-50">
          {name}
        </span>
        <span className="shrink-0 font-mono text-[0.6875rem] text-ink-500">{formatBytes(size)}</span>
        <ArrowDownToLine className="size-4 shrink-0 text-ink-400 transition-transform group-hover:translate-y-0.5 group-hover:text-royal-300" aria-hidden />
      </span>
    </a>
  );
}

function ReleaseCard({ release }: { release: Release }) {  const ctx = RELEASE_CONTEXT[release.tagName];
  const zip = release.assets.find((a) => a.name.toLowerCase().endsWith(".zip"));
  const zipCtx = zip && ctx?.sha256 ? { sha: ctx.sha256 } : null;
  const checksumAsset = release.assets.find((a) => a.name.toLowerCase().endsWith(".sha256"));

  return (
    <article className="relative flex h-full flex-col gap-4 overflow-hidden rounded-2xl hairline bg-ink-900/60 p-6 shadow-card backdrop-blur-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-mono text-lg font-semibold tracking-tight text-ink-50">
            {release.tagName}
          </h3>
          <p className="mt-0.5 truncate text-sm text-ink-300">{release.name}</p>
        </div>
        <Badge tone={ctx?.status === "engineering-prerelease" ? "royal" : "amber"}>
          {ctx?.status === "engineering-prerelease" ? "Engineering prerelease" : "Development checkpoint"}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[0.6875rem] text-ink-400">
        <span>{formatDate(release.publishedAt)}</span>
        <span>·</span>
        <span>Windows x64</span>
        {zip && (
          <>
            <span>·</span>
            <span>{formatBytes(zip.size)}</span>
          </>
        )}
      </div>

      {ctx?.warning && (
        <div
          className={`rounded-xl border p-4 ${
            ctx.warning.tone === "warn"
              ? "border-amber-warn/25 bg-amber-warn/[0.07]"
              : "border-signal-500/25 bg-signal-500/[0.06]"
          }`}
          role="note"
        >
          <p className={`flex items-center gap-2 text-sm font-semibold ${ctx.warning.tone === "warn" ? "text-amber-warn" : "text-signal-300"}`}>
            {ctx.warning.tone === "warn" ? (
              <AlertTriangle className="size-4 shrink-0" aria-hidden />
            ) : (
              <Info className="size-4 shrink-0" aria-hidden />
            )}
            {ctx.warning.title}
          </p>
          <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-ink-300">{ctx.warning.body}</p>
          {ctx.warning.link && (
            <a
              href={ctx.warning.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-[0.8125rem] font-medium text-signal-300 underline decoration-signal-500/30 underline-offset-2 hover:text-signal-400"
            >
              {ctx.warning.link.label}
            </a>
          )}
        </div>
      )}

      <p className="text-sm leading-relaxed text-ink-200">{ctx?.summary ?? release.notes.split("\n")[0]}</p>

      <div className="flex flex-col gap-2">
        {release.assets.map((a) => (
          <AssetRow
            key={a.name}
            name={a.name}
            size={a.size}
            downloadUrl={a.downloadUrl}
            isChecksum={a.name.toLowerCase().endsWith(".sha256")}
          />
        ))}
      </div>

      {zipCtx && (
        <div className="rounded-lg border border-ink-700/60 bg-ink-950/60 px-3.5 py-2.5">
          <p className="mb-1 text-[0.625rem] font-medium tracking-wider text-ink-500 uppercase">
            SHA-256 · verify after download
          </p>
          <div className="flex items-center gap-2">
            <code className="truncate font-mono text-[0.6875rem] text-ink-300">{shortHash(zipCtx.sha, 24, 16)}</code>
            <CopyButton text={zipCtx.sha} label={`Copy SHA-256 for ${release.tagName}`} />
          </div>
        </div>
      )}

      <p className="mt-auto text-[0.6875rem] leading-5 text-ink-500">
        Package contents: {ctx?.bundled ?? "see release notes"}.{" "}
        {checksumAsset && (
          <a
            href={checksumAsset.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            className="text-ink-400 underline decoration-ink-600 underline-offset-2 hover:text-royal-300"
          >
            Sidecar checksum available.
          </a>
        )}
      </p>

      <div className="flex flex-col gap-1.5 border-t border-ink-700/50 pt-4 text-sm">
        <details className="group">
          <summary className="cursor-pointer list-none text-ink-300 transition-colors hover:text-ink-50 [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1.5 font-medium">
              Release notes
              <span aria-hidden className="transition-transform group-open:rotate-90">›</span>
            </span>
          </summary>
          <div className="mt-2 max-h-64 overflow-y-auto whitespace-pre-wrap rounded-lg bg-ink-950/70 p-3 font-mono text-[0.6875rem] leading-5 text-ink-300">
            {release.notes}
          </div>
        </details>
        <a
          href={release.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-ink-400 underline decoration-ink-600 underline-offset-2 transition-colors hover:text-royal-300"
        >
          View {release.tagName} on GitHub Releases
        </a>
      </div>
    </article>
  );
}

export function Downloads() {
  const [state, setState] = useState<ReleasesState>({ source: "loading" });

  useEffect(() => {
    let cancelled = false;
    fetchReleases().then((s) => {
      if (!cancelled) setState(s);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const releases = state.source === "loading" ? [] : state.releases;

  return (
    <section id="downloads" className="relative scroll-mt-24 py-24 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-[radial-gradient(ellipse_55%_100%_at_50%_0%,rgb(115,100,226,0.09),transparent_70%)]"
      />
      <div className="container-site relative">
        <SectionHeading
          eyebrow="Downloads"
          title={
            <>
              Built archives, <span className="text-gradient">checkpoints and honesty</span>
            </>
          }
          lede="Pulled live from the official GitHub Releases API. Links only ever resolve to real published assets; every prerelease carries its audit context so you can choose with open eyes."
        />

        <Reveal className="mt-10" delay={0.05}>
          <div className="flex items-start gap-3.5 rounded-2xl border border-amber-warn/25 bg-amber-warn/[0.06] p-5" role="note">
            <AlertTriangle className="mt-0.5 size-5 shrink-0 text-amber-warn" aria-hidden />
            <div>
              <h3 className="text-sm font-semibold text-amber-warn">
                No stable release — every archive below is a prerelease, and the newest engine is source-only
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-300">
                URA is early engineering software. The{" "}
                <span className="font-mono text-ink-200">v0.9.0-dev</span> decompiler checkpoint is
                verified in source and deliberately not published as a ZIP.{" "}
                <span className="font-mono text-ink-200">v0.6.0</span> is the current documented
                downloadable build; the 0.7 and 0.8 tags are development checkpoints — including
                one whose attached ZIP predates audited fixes. Building from source is the most
                current way to run URA.
              </p>
            </div>
          </div>
        </Reveal>

        {/* v0.9 source checkpoint — intentionally NOT a download card */}
        <Reveal delay={0.08}>
          <article className="mt-4 overflow-hidden rounded-2xl border border-gilt-500/25 bg-gradient-to-br from-ink-900/80 via-ink-900/60 to-ink-850/60">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-700/50 px-6 py-4">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2.5">
                  <h3 className="font-mono font-semibold tracking-tight text-ink-50">
                    {CHECKPOINT_09.version}
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gilt-500/30 bg-gilt-500/10 px-2.5 py-0.5 text-[0.6875rem] font-medium text-gilt-300">
                    Source checkpoint — no public ZIP
                  </span>
                </div>
                <p className="mt-0.5 truncate text-sm text-ink-300">{CHECKPOINT_09.title}</p>
              </div>
              <div className="flex items-center gap-2 font-mono text-[0.6875rem] text-ink-400">
                <GitBranch className="size-3.5 text-royal-300" aria-hidden />
                {CHECKPOINT_09.branch}
                <span aria-hidden className="text-ink-600">·</span>
                <span>{shortHash(CHECKPOINT_09.commit, 8, 4)}</span>
              </div>
            </div>
            <div className="p-6 sm:p-7">
              <p className="text-sm leading-relaxed text-ink-200">{CHECKPOINT_09.summary}</p>
              <ul className="mt-4 flex flex-wrap gap-2 font-mono text-[0.6875rem] text-ink-400">
                {CHECKPOINT_09.facts.map((f) => (
                  <li key={f} className="rounded border border-ink-600/60 bg-ink-850 px-2 py-1">
                    {f}
                  </li>
                ))}
              </ul>
              <div
                className="mt-4 flex items-start gap-3 rounded-xl border border-gilt-500/20 bg-gilt-500/[0.05] p-4"
                role="note"
              >
                <AlertTriangle className="mt-0.5 size-4 shrink-0 text-gilt-300" aria-hidden />
                <p className="text-[0.8125rem] leading-relaxed text-ink-300">
                  {CHECKPOINT_09.noArtifact}
                </p>
              </div>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {CHECKPOINT_09.links.map((l) => (
                  <a
                    key={l.label}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-ink-600/80 bg-ink-800/60 px-4 py-2 text-sm font-medium text-ink-100 transition-colors hover:border-royal-500/50 hover:text-ink-50"
                  >
                    <Terminal className="size-3.5 text-royal-300" aria-hidden />
                    {l.label}
                  </a>
                ))}
              </div>
            </div>
          </article>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-8 flex items-center justify-between gap-4 px-1">
            <span className="flex items-center gap-2 font-mono text-[0.6875rem] text-ink-400">
              <ShieldCheck className="size-3.5 text-emerald-400/80" aria-hidden />
              {state.source === "live" && (
                <>Live from the GitHub Releases API</>
              )}
              {state.source === "loading" && <>Contacting GitHub…</>}
              {(state.source === "fallback" || state.source === "error") && (
                <>Verified snapshot <span className="text-ink-600">·</span> {state.reason}</>
              )}
            </span>
            {state.source !== "loading" && (
              <button
                type="button"
                onClick={() => {
                  setState({ source: "loading" });
                  fetchReleases().then(setState);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850/70 px-3 py-1.5 text-xs text-ink-300 transition-colors hover:border-ink-500 hover:text-ink-50"
              >
                <RefreshCw className="size-3.5" aria-hidden />
                Refresh
              </button>
            )}
          </div>
        </Reveal>

        <div className="mt-4 grid gap-5 lg:grid-cols-3" aria-busy={state.source === "loading"}>
          {state.source === "loading" &&
            [0, 1, 2].map((i) => (
              <div key={i} className="h-104 animate-pulse rounded-2xl border border-ink-700/60 bg-ink-900/40" aria-hidden />
            ))}
          <AnimatePresence initial={false}>
            {releases.map((release, i) => (
              <motion.div
                key={release.tagName}
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="min-w-0"
              >
                <ReleaseCard release={release} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <Reveal className="mt-12" delay={0.05}>
          <div className="grid gap-8 overflow-hidden rounded-2xl hairline bg-ink-900/60 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_420px]">
            <div>
              <h3 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight">
                <Wrench className="size-5 text-royal-300" aria-hidden />
                Build from source
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-300">
                Windows x64 is the verified host. Install Rust with the MSVC toolchain plus Visual
                Studio C++ build tools; the workspace declares Rust 1.95 or newer. Source always
                reflects the latest verified engine — including branch work beyond the published
                tags.
              </p>
              <ul className="mt-4 flex flex-wrap gap-2 font-mono text-[0.6875rem] text-ink-400">
                {["git clone -b v0.9-c-decompiler", "cargo fmt --check", "cargo clippy -D warnings", "251 tests (v0.9.0-dev)"].map((t) => (
                  <li key={t} className="rounded border border-ink-600/60 bg-ink-850 px-2 py-1">{t}</li>
                ))}
              </ul>
            </div>
            <CodeBlock
              lang="shell"
              title="PowerShell"
              ariaLabel="Build URA from source commands"
              code={`cargo build --release -p ura-native -p ura-cli -p ura-mcp
cargo run --release -p ura-native -- path/to/sample.exe`}
            />
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-ink-500">
            Download URLs are constructed only from real GitHub Release assets — this site never
            invents distribution files. If the API is temporarily unreachable, the verified fallback
            snapshot above is used and clearly labelled.{" "}
            <a
              href="https://github.com/entrenchedosx/URA/releases"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-300 underline decoration-ink-600 underline-offset-2 hover:text-royal-300"
            >
              Open the Releases page
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
