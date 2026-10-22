import { useEffect, useState } from "react";
import { REPO } from "../lib/site";
import { Reveal } from "./ui/Reveal";
import { SectionHeading } from "./ui/SectionHeading";

interface RepoStats {
  stars: number;
  forks: number;
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" className="size-4 fill-current" aria-hidden>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

export function OpenSource() {
  const [stats, setStats] = useState<RepoStats | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(REPO.api, { headers: { Accept: "application/vnd.github+json" } })
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { stargazers_count?: number; forks_count?: number } | null) => {
        if (cancelled || !data) return;
        if (typeof data.stargazers_count === "number" && typeof data.forks_count === "number") {
          setStats({ stars: data.stargazers_count, forks: data.forks_count });
        }
      })
      .catch(() => null);
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="open-source" className="relative scroll-mt-24 py-24 sm:py-28">
      <div className="container-site">
        <SectionHeading
          eyebrow="Open source"
          title={
            <>
              Read the analysis <span className="text-gradient">engine, not the marketing</span>
            </>
          }
          lede="URA is MIT-licensed and written to be read: engine code stays independent of GUI types, persistence is schema-versioned, and every correctness change lands with deterministic regression coverage."
        />

        <Reveal className="mt-10" delay={0.05}>
          <div className="overflow-hidden rounded-2xl hairline bg-ink-900/60">
            <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:justify-between sm:p-8">
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center rounded-xl border border-ink-600 bg-ink-850">
                  <GitHubMark />
                </span>
                <div>
                  <p className="font-mono text-[0.9375rem] font-semibold text-ink-50">entrenchedosx/URA</p>
                  <p className="flex items-center gap-2.5 font-mono text-[0.6875rem] text-ink-400">
                    <span>MIT</span>
                    <span aria-hidden>·</span>
                    <span>Rust</span>
                    <span aria-hidden>·</span>
                    <span>Windows x64 verified</span>
                    {stats && (
                      <>
                        <span aria-hidden>·</span>
                        <span>{stats.stars} stars</span>
                        <span aria-hidden>·</span>
                        <span>{stats.forks} forks</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5">
                <a
                  href={REPO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-royal-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-royal-500"
                >
                  <GitHubMark />
                  Explore the source
                </a>
                <a
                  href={REPO.issues}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-850/70 px-4 py-2.5 text-sm font-semibold text-ink-100 transition-colors hover:border-ink-400"
                >
                  Browse issues
                </a>
              </div>
            </div>

            <div className="grid gap-px border-t border-ink-700/60 bg-ink-700/40 sm:grid-cols-3">
              {[
                {
                  title: "Contribute",
                  body: "Discuss new architectures and persistence changes before introducing a format or dependency. Run fmt, clippy and tests first.",
                  href: `${REPO.url}/blob/main/docs/DEVELOPMENT.md`,
                  cta: "DEVELOPMENT.md",
                },
                {
                  title: "Audit",
                  body: "Release notes carry audit status, verification reports and known limitations — read them before trusting a checkpoint.",
                  href: REPO.releases,
                  cta: "Release audit notes",
                },
                {
                  title: "License",
                  body: "MIT for URA; each dependency keeps its own license with collected notices in THIRD_PARTY.md.",
                  href: `${REPO.url}/blob/main/THIRD_PARTY.md`,
                  cta: "THIRD_PARTY.md",
                },
              ].map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-ink-850/[0.35] p-6 transition-colors hover:bg-ink-850"
                >
                  <h3 className="flex items-center gap-2 text-sm font-semibold tracking-wide text-ink-100 uppercase">
                    {card.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-300">{card.body}</p>
                  <span className="mt-3 inline-block font-mono text-[0.6875rem] text-royal-300/80 transition-colors group-hover:text-royal-200">
                    {card.cta} →
                  </span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
