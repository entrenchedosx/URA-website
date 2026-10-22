import { REPO } from "./site";

export interface ReleaseAsset {
  name: string;
  size: number;
  downloadUrl: string;
  contentType: string;
}

export interface Release {
  tagName: string;
  name: string;
  publishedAt: string;
  url: string;
  notes: string;
  assets: ReleaseAsset[];
}

/**
 * The v0.9.0-dev decompiler milestone is a verified SOURCE checkpoint only —
 * publishable to its development branch, with no tag, release or ZIP by design.
 * VERIFICATION-0.9.md: "no v0.8.0-dev.1 or v0.9.0-dev tag/public prerelease is
 * created … A published URL, public ZIP download and re-downloaded checksum are
 * inapplicable." Rendered separately from downloadable releases.
 */
export const CHECKPOINT_09 = {
  version: "0.9.0-dev",
  branch: "v0.9-c-decompiler",
  commit: "bc73e7f841ac85331844f44cb0b13829c82aaeb0",
  verified: "2026-10-22",
  title: "URA 0.9.0-dev — the C-like decompiler milestone",
  summary:
    "A deterministic C-like AST built from semantic HIR, SSA phi destruction through copy cycles, bounded control-flow reduction with explicit labels/gotos for unproved regions, a native F5 Pseudocode panel with line↔assembly cross-linking, paged CLI/MCP decompile with a 2 MiB AST guard, and whole-function export honoring the write policy.",
  facts: ["v0.9-c-decompiler", "commit bc73e7f8", "verified 2026-10-22", "251 tests passed", "32 MCP tools"],
  noArtifact:
    "No public ZIP is offered for this milestone — the OS 150% DPI gate and live large-function/cancellation acceptance are open. Source checkpoints are not releases.",
  links: [
    { label: "Browse the branch", href: `https://github.com/entrenchedosx/URA/tree/v0.9-c-decompiler` },
    {
      label: "VERIFICATION-0.9.md",
      href: "https://github.com/entrenchedosx/URA/blob/v0.9-c-decompiler/docs/VERIFICATION-0.9.md",
    },
    {
      label: "C-DECOMPILER-0.9.md",
      href: "https://github.com/entrenchedosx/URA/blob/v0.9-c-decompiler/docs/C-DECOMPILER-0.9.md",
    },
  ],
} as const;

/** Curated, verified context per known tag — sourced from the audited release notes. */
export interface ReleaseContext {
  status: "development-checkpoint" | "engineering-prerelease";
  /** callout shown above the notes */
  warning?: {
    tone: "warn" | "info";
    title: string;
    body: string;
    link?: { label: string; href: string };
  };
  summary: string;
  bundled: string;
  sha256?: string;
}

export const RELEASE_CONTEXT: Record<string, ReleaseContext> = {
  "v0.8.0-dev": {
    status: "development-checkpoint",
    warning: {
      tone: "warn",
      title: "This checkpoint's attached build is outdated",
      body: "An independent audit found stack-analysis convergence defects and overly confident ABI/type recovery. Repairs exist in source on the v0.8-decompiler-foundations branch, but no corrected public artifact has been published — the attached ZIP is the original audited build. Review the audit notes before relying on the experimental decompiler foundations.",
      link: {
        label: "Read the v0.8.0-dev release notes",
        href: "https://github.com/entrenchedosx/URA/releases/tag/v0.8.0-dev",
      },
    },
    summary:
      "Decompiler-foundation checkpoint: evidence-based ABI/signature recovery, physical stack frames, a conservative type system, interprocedural call graphs and an experimental C-like rendering from verified SSA. Later audited fixes only exist in source, not in this download.",
    bundled: "ura-native.exe, ura-cli.exe, ura-mcp.exe, documentation, icon.webp, SHA256SUMS.txt, dependency notices",
    sha256: "8d484cbf08225816e11f7a9b7f20970da866115aeb708c01a28f841bc9f03af0",
  },
  "v0.7.0-dev": {
    status: "development-checkpoint",
    warning: {
      tone: "info",
      title: "Development checkpoint — not a final release",
      body: "0.7 introduced the typed IR with tested scalar x86/x64 lifting, verified SSA and analysis caches. Variable idle CPU outside UI painting remained an unexplained known limitation at publication time.",
    },
    summary:
      "Verified IR and headless analysis checkpoint: typed IR with scalar x86/x64 lifting, dominators/frontiers, SSA def-use, conservative constants and branch proofs, guarded jump tables and a hidden-by-default IR panel. CLI gains ir, dominators and diagnostics; 19 MCP tools.",
    bundled: "ura-native.exe, ura-cli.exe, ura-mcp.exe, documentation, icon.webp, SHA256SUMS.txt, dependency notices",
    sha256: "5006470762f209499da5514d5be722961e51c02119917743cf663d8f78678ed6",
  },
  "v0.6.0": {
    status: "engineering-prerelease",
    summary:
      "Native workspace and headless continuation: the entirely Rust/egui desktop, compact classic/dark themes, the native CLI, a 15-tool stdio MCP server, read-only v1–v3 project attachment and actual renderer screenshots. The currently documented build on main.",
    bundled: "ura-native.exe, ura-cli.exe, ura-mcp.exe, documentation, icon.webp, checksums, dependency notices",
    sha256: "80e80b1be11c4315624d509b735be0c359e8ac474fef3a52778d83f0f1af3af6",
  },
};

const FALLBACK: Release[] = [
  {
    tagName: "v0.8.0-dev",
    name: "URA 0.8.0-dev — Decompiler foundations checkpoint",
    publishedAt: "2026-10-21T15:24:14Z",
    url: "https://github.com/entrenchedosx/URA/releases/tag/v0.8.0-dev",
    notes:
      "Development checkpoint published from v0.8-decompiler-foundations. The attached ZIP is the original 1194403 build; later audited repairs exist only in source. High-level decompiler output is explicitly experimental.",
    assets: [
      {
        name: "URA-0.8.0-dev-windows-x64.zip",
        size: 14288661,
        downloadUrl:
          "https://github.com/entrenchedosx/URA/releases/download/v0.8.0-dev/URA-0.8.0-dev-windows-x64.zip",
        contentType: "application/zip",
      },
      {
        name: "URA-0.8.0-dev-windows-x64.zip.sha256",
        size: 97,
        downloadUrl:
          "https://github.com/entrenchedosx/URA/releases/download/v0.8.0-dev/URA-0.8.0-dev-windows-x64.zip.sha256",
        contentType: "application/octet-stream",
      },
    ],
  },
  {
    tagName: "v0.7.0-dev",
    name: "URA 0.7.0-dev — Verified IR and headless analysis checkpoint",
    publishedAt: "2026-10-21T09:46:35Z",
    url: "https://github.com/entrenchedosx/URA/releases/tag/v0.7.0-dev",
    notes:
      "Development checkpoint published from v0.7-advanced-analysis. Not a final v0.7.0 release.",
    assets: [
      {
        name: "URA-0.7.0-dev-windows-x64.zip",
        size: 13155173,
        downloadUrl:
          "https://github.com/entrenchedosx/URA/releases/download/v0.7.0-dev/URA-0.7.0-dev-windows-x64.zip",
        contentType: "application/zip",
      },
      {
        name: "URA-0.7.0-dev-windows-x64.zip.sha256",
        size: 97,
        downloadUrl:
          "https://github.com/entrenchedosx/URA/releases/download/v0.7.0-dev/URA-0.7.0-dev-windows-x64.zip.sha256",
        contentType: "application/octet-stream",
      },
    ],
  },
  {
    tagName: "v0.6.0",
    name: "URA 0.6.0 — Native workspace and headless tools",
    publishedAt: "2026-10-20T21:53:49Z",
    url: "https://github.com/entrenchedosx/URA/releases/tag/v0.6.0",
    notes:
      "Engineering prerelease recovers the interrupted headless work and adds the compact native analysis workspace. Validation: strict Clippy, 55 workspace tests and a Release workspace build on Windows x64.",
    assets: [
      {
        name: "URA-0.6.0-windows-x64.zip",
        size: 12479225,
        downloadUrl:
          "https://github.com/entrenchedosx/URA/releases/download/v0.6.0/URA-0.6.0-windows-x64.zip",
        contentType: "application/zip",
      },
    ],
  },
];

export type ReleasesState =
  | { source: "loading" }
  | { source: "live"; releases: Release[]; fetchedAt: string }
  | { source: "fallback"; releases: Release[]; reason: string }
  | { source: "error"; releases: Release[]; reason: string };

const CACHE_KEY = "ura.releases.v2";
const CACHE_TTL = 15 * 60 * 1000;

interface CacheShape {
  fetchedAt: string;
  releases: Release[];
}

function readCache(): CacheShape | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CacheShape;
    if (!parsed?.fetchedAt || !Array.isArray(parsed.releases)) return null;
    if (Date.now() - new Date(parsed.fetchedAt).getTime() > CACHE_TTL) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCache(releases: Release[]) {
  try {
    const payload: CacheShape = { fetchedAt: new Date().toISOString(), releases };
    localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
  } catch {
    /* storage may be unavailable */
  }
}

interface RawAsset {
  name?: unknown;
  size?: unknown;
  browser_download_url?: unknown;
  content_type?: unknown;
}

interface RawRelease {
  tag_name?: unknown;
  name?: unknown;
  published_at?: unknown;
  html_url?: unknown;
  body?: unknown;
  prerelease?: unknown;
  assets?: RawAsset[];
}

function mapRelease(r: RawRelease, i: number): Release | null {
  if (typeof r.tag_name !== "string") return null;
  const assets = (r.assets ?? [])
    .filter((a): a is RawAsset & { name: string; browser_download_url: string } =>
      typeof a.name === "string" && typeof a.browser_download_url === "string")
    .map((a) => ({
      name: a.name,
      size: typeof a.size === "number" ? a.size : 0,
      downloadUrl: a.browser_download_url,
      contentType: typeof a.content_type === "string" ? a.content_type : "application/octet-stream",
    }));
  return {
    tagName: r.tag_name,
    name: typeof r.name === "string" ? r.name : r.tag_name,
    publishedAt:
      typeof r.published_at === "string" ? r.published_at : new Date(Date.now() - i).toISOString(),
    url: typeof r.html_url === "string" ? r.html_url : `https://github.com/entrenchedosx/URA/releases/tag/${r.tag_name}`,
    notes: typeof r.body === "string" ? r.body : "",
    assets,
  };
}

/**
 * Fetch published releases from the GitHub REST API with a curated fallback
 * snapshot. Only real assets are ever exposed; the API is public and tokenless.
 */
export async function fetchReleases(): Promise<ReleasesState> {
  const cached = readCache();
  if (cached) {
    return { source: "live", releases: cached.releases, fetchedAt: cached.fetchedAt };
  }
  try {
    const res = await fetch(REPO.releasesApi, {
      headers: { Accept: "application/vnd.github+json" },
    });
    if (!res.ok) {
      const reason =
        res.status === 403
          ? "GitHub API rate limit reached — showing the last verified snapshot."
          : `GitHub API responded ${res.status} — showing the last verified snapshot.`;
      return { source: "fallback", releases: FALLBACK, reason };
    }
    const raw = (await res.json()) as RawRelease[];
    if (!Array.isArray(raw) || raw.length === 0) {
      return { source: "fallback", releases: FALLBACK, reason: "No releases returned — showing the last verified snapshot." };
    }
    const releases = raw.map(mapRelease).filter((r): r is Release => r !== null);
    if (releases.length === 0) {
      return { source: "fallback", releases: FALLBACK, reason: "Unexpected API payload — showing the last verified snapshot." };
    }
    writeCache(releases);
    return { source: "live", releases, fetchedAt: new Date().toISOString() };
  } catch {
    return {
      source: "error",
      releases: FALLBACK,
      reason: "GitHub API unreachable from this network — showing the last verified snapshot.",
    };
  }
}
