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
  { label: "Decompiler", href: "#decompiler" },
  { label: "Workbench", href: "#demo" },
  { label: "Progress", href: "#progress" },
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
    title: "VERIFICATION-0.9.md",
    description:
      "The decompiler checkpoint's gates — 251 tests, live native checks, measured fixture timings, open acceptance gates and the no-artifact decision.",
    href: `${REPO.url}/blob/v0.9-c-decompiler/docs/VERIFICATION-0.9.md`,
    tag: "v0.9 · Branch",
  },
  {
    title: "FEATURE-PARITY.md",
    description:
      "The audited ledger: 129 capabilities across ten families with per-row evidence, limits and targets — ledger counts, never a parity percentage.",
    href: `${REPO.url}/blob/v0.9-c-decompiler/docs/FEATURE-PARITY.md`,
    tag: "v0.9 · Audit",
  },
  {
    title: "C-DECOMPILER-0.9.md",
    description:
      "The implemented C-like decompiler contract — transformations, types, calls, memory, bounds and independent verification scope.",
    href: `${REPO.url}/blob/v0.9-c-decompiler/docs/C-DECOMPILER-0.9.md`,
    tag: "v0.9 · Engine",
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
      "Priorities after the source checkpoint: decompiler refinement, then verified patching, debugging, proof-backed deobfuscation.",
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
    title: "VERIFICATION-0.8.md",
    description:
      "What was verified for the latest published archive — and the audit findings behind its attached ZIP context.",
    href: `${REPO.url}/blob/main/docs/VERIFICATION-0.8.md`,
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
