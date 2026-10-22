import { REPO } from "../lib/site";

const COLUMNS = [
  {
    title: "Project",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pseudocode demo", href: "#decompiler" },
      { label: "Interactive demo", href: "#demo" },
      { label: "Engineering progress", href: "#progress" },
      { label: "Roadmap", href: "#roadmap" },
    ],
  },
  {
    title: "Repository",
    links: [
      { label: "GitHub", href: REPO.url },
      { label: "v0.9 branch", href: `${REPO.url}/tree/v0.9-c-decompiler` },
      { label: "Releases", href: REPO.releases },
      { label: "Issues", href: REPO.issues },
      { label: "License (MIT)", href: REPO.license },
    ],
  },
  {
    title: "Documentation",
    links: [
      { label: "README", href: `${REPO.url}/blob/main/README.md` },
      { label: "FEATURE-PARITY.md", href: `${REPO.url}/blob/v0.9-c-decompiler/docs/FEATURE-PARITY.md` },
      { label: "VERIFICATION-0.9.md", href: `${REPO.url}/blob/v0.9-c-decompiler/docs/VERIFICATION-0.9.md` },
      { label: "C-DECOMPILER-0.9.md", href: `${REPO.url}/blob/v0.9-c-decompiler/docs/C-DECOMPILER-0.9.md` },
    ],
  },
] as const;

export function Footer() {
  return (
    <footer className="relative border-t border-ink-700/60 bg-ink-950">
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-royal-500/40 to-transparent" />
      <div className="container-site grid gap-10 py-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,2fr)]">
        <div className="max-w-sm">
          <a href="#top" className="flex items-center gap-3" aria-label="URA — back to top">
            <img
              src={`${import.meta.env.BASE_URL}icon.webp`}
              alt=""
              width={44}
              height={44}
              loading="lazy"
              decoding="async"
              className="size-11 rounded-xl ring-1 ring-white/15"
            />
            <span className="flex flex-col leading-none">
              <span className="text-sm font-bold tracking-[0.08em] text-ink-50">URA</span>
              <span className="mt-1 text-[0.625rem] tracking-[0.14em] text-ink-400 uppercase">
                Ultimate Reverse Engineer
              </span>
            </span>
          </a>
          <p className="mt-4 text-[0.8125rem] leading-relaxed text-ink-400">
            A native Rust static-analysis workbench. Samples are read locally and never executed.
            An early engineering release, with explicit analysis limits.
          </p>
          <a
            href={REPO.url}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-lg border border-ink-600 bg-ink-850/70 px-4 py-2 text-sm font-medium text-ink-100 transition-colors hover:border-ink-400"
          >
            <svg viewBox="0 0 16 16" className="size-4 fill-current" aria-hidden>
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
            </svg>
            entrenchedosx/URA
          </a>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-[0.6875rem] font-semibold tracking-[0.18em] text-ink-300 uppercase">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="text-[0.8125rem] text-ink-400 transition-colors hover:text-ink-50"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>

      <div className="border-t border-ink-800/80">
        <div className="container-site flex flex-col gap-2 py-6 text-[0.6875rem] leading-4 text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © 2026 entrenchedosx — URA, Ultimate Reverse Engineer. Released under the{" "}
            <a
              href={REPO.license}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-400 underline decoration-ink-600 underline-offset-2 hover:text-ink-50"
            >
              MIT License
            </a>
            . The official artwork is used with its owner's permission.
          </p>
          <p className="sm:text-right">
            An independent open-source project — not affiliated with Hex-Rays SA or the NSA.
            Ghidra was studied as a reference only.
          </p>
        </div>
      </div>
    </footer>
  );
}
