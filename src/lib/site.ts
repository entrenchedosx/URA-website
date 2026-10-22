export const SITE_URL = "https://entrenchedosx.github.io/URA-website/";

/** Resolve a public/ asset against the configured base path (GitHub Pages safe). */
export function asset(path: string): string {
  const base = import.meta.env.BASE_URL;
  return `${base}${path.startsWith("/") ? path.slice(1) : path}`;
}

export const REPO = {
  owner: "entrenchedosx",
  name: "URA",
  url: "https://github.com/entrenchedosx/URA",
  releases: "https://github.com/entrenchedosx/URA/releases",
  issues: "https://github.com/entrenchedosx/URA/issues",
  license: "https://github.com/entrenchedosx/URA/blob/main/LICENSE",
  api: "https://api.github.com/repos/entrenchedosx/URA",
  releasesApi: "https://api.github.com/repos/entrenchedosx/URA/releases",
  raw: "https://raw.githubusercontent.com/entrenchedosx/URA/main",
} as const;

export const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "Showcase", href: "#showcase" },
  { label: "Workbench", href: "#demo" },
  { label: "Downloads", href: "#downloads" },
  { label: "Roadmap", href: "#roadmap" },
  { label: "Documentation", href: "#docs" },
] as const;

export const DOC_LINKS = [
  {
    title: "README",
    description:
      "Capabilities, supported formats, desktop walkthrough, CLI usage, MCP integration, building from source, testing and contribution guidelines.",
    href: `${REPO.url}/blob/main/README.md`,
    tag: "Overview",
  },
  {
    title: "ARCHITECTURE.md",
    description:
      "How the crates fit together — ura-core, ura-project, ura-native, ura-service, ura-cli and ura-mcp — with no duplicated analysis engine.",
    href: `${REPO.url}/blob/main/docs/ARCHITECTURE.md`,
    tag: "Internal",
  },
  {
    title: "ROADMAP.md",
    description:
      "Milestone history from v0.1 to v0.6, deferred work such as jump-table recovery, and priorities for analysis depth.",
    href: `${REPO.url}/blob/main/docs/ROADMAP.md`,
    tag: "Planning",
  },
  {
    title: "DEVELOPMENT.md",
    description:
      "Rust toolchain requirements, renderer capture, benchmarking, manual verification flows and the preserved v0.4 frontend notes.",
    href: `${REPO.url}/blob/main/docs/DEVELOPMENT.md`,
    tag: "Contributing",
  },
  {
    title: "VERIFICATION-0.6.md",
    description:
      "What was actually verified in 0.6 — sizes, scaling, renderer captures — and the checks that remain manual.",
    href: `${REPO.url}/blob/main/docs/VERIFICATION-0.6.md`,
    tag: "Release",
  },
  {
    title: "GHIDRA-RESEARCH.md",
    description:
      "An honest architectural study of Ghidra's analysis pipeline and a feature/dependency matrix with explicit gaps.",
    href: `${REPO.url}/blob/main/docs/GHIDRA-RESEARCH.md`,
    tag: "Research",
  },
  {
    title: "LICENSE",
    description:
      "URA is MIT-licensed. Dependencies keep their own licenses; third-party notices are collected in THIRD_PARTY.md.",
    href: REPO.license,
    tag: "Legal",
  },
] as const;
