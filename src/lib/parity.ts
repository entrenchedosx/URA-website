const BRANCH = "v0.9-c-decompiler";
export const V09 = {
  branch: BRANCH,
  commit: "bc73e7f841ac85331844f44cb0b13829c82aaeb0",
  version: "0.9.0-dev",
  featureParityUrl: `https://github.com/entrenchedosx/URA/blob/${BRANCH}/docs/FEATURE-PARITY.md`,
  verificationUrl: `https://github.com/entrenchedosx/URA/blob/${BRANCH}/docs/VERIFICATION-0.9.md`,
  decompilerDocUrl: `https://github.com/entrenchedosx/URA/blob/${BRANCH}/docs/C-DECOMPILER-0.9.md`,
  benchmarkUrl: `https://github.com/entrenchedosx/URA/blob/${BRANCH}/docs/benchmarks/0.9-c-decompiler.json`,
} as const;

export type ParityStatus = "supported" | "partial" | "missing" | "unverified";

export const PARITY_TOTALS: Array<{ status: ParityStatus; count: number }> = [
  { status: "supported", count: 17 },
  { status: "partial", count: 51 },
  { status: "missing", count: 57 },
  { status: "unverified", count: 4 },
];

export const PARITY_CAPABILITIES = PARITY_TOTALS.reduce(
  (sum, t) => sum + t.count,
  0,
);

export interface ParityFamily {
  name: string;
  blurb: string;
  rows: number;
  supported: number;
  partial: number;
  missing: number;
  unverified: number;
}

/** Per-family audited counts from docs/FEATURE-PARITY.md (v0.9 checkpoint audit, 2026-10-22). */
export const PARITY_FAMILIES: ParityFamily[] = [
  { name: "Disassembly & processors", blurb: "x86/x64 decoding, lifter subset, discovery, references, CFG", rows: 15, supported: 3, partial: 7, missing: 5, unverified: 0 },
  { name: "Decompiler", blurb: "C-like AST, SSA destruction, control-flow reduction, source maps", rows: 26, supported: 4, partial: 17, missing: 5, unverified: 0 },
  { name: "Debugger", blurb: "Static analysis only — no live debugging", rows: 12, supported: 0, partial: 0, missing: 12, unverified: 0 },
  { name: "Binary patching", blurb: "Hex view is read-only; no assembler or writer", rows: 8, supported: 0, partial: 0, missing: 8, unverified: 0 },
  { name: "Binary formats", blurb: "PE/ELF strong with narrow import relief; Mach-O unverified", rows: 10, supported: 0, partial: 2, missing: 6, unverified: 2 },
  { name: "Symbols & types", blurb: "Manual bounded layouts; no PDB/DWARF loaders", rows: 12, supported: 0, partial: 5, missing: 7, unverified: 0 },
  { name: "Advanced analysis", blurb: "SSA, dominators, conservative constants; no symbolic execution", rows: 13, supported: 2, partial: 5, missing: 6, unverified: 0 },
  { name: "Automation", blurb: "Headless CLI, 32-tool MCP, Rust library, write policy", rows: 9, supported: 2, partial: 4, missing: 3, unverified: 0 },
  { name: "Projects & collaboration", blurb: "SQLite projects, overrides, stack notes; single-binary", rows: 10, supported: 5, partial: 1, missing: 4, unverified: 0 },
  { name: "Professional GUI", blurb: "Docking, pseudocode views, F5; DPI gate unverified", rows: 14, supported: 1, partial: 10, missing: 1, unverified: 2 },
];

/** Ledger rows audited Supported in v0.9 — sampled, not exhaustive. */
export const PARITY_SUPPORTED_PICKS = [
  "Independent semantic C-like AST (C-01)",
  "SSA destruction & cycle copies (C-05)",
  "Labels/gotos for unreduced CFG (C-12)",
  "Unsupported-effect diagnostics (C-23)",
  "x86/x64 instruction decoding (D-01)",
  "SSA & def-use analysis (A-02)",
  "Dominators & frontiers (A-03)",
  "Project persistence & overrides (PRJ family)",
];

/** Prominent audited gaps called out by name in the ledger. */
export const PARITY_GAP_PICKS = [
  "Switch reconstruction stays heuristic — no complete source switch (C-10)",
  "Named structured locals / lifetime coalescing not complete (C-14)",
  "Floating/vector instruction semantics remain unknown (D-07)",
  "No canonical for/do-while or short-circuit operators (C-09, C-11)",
  "Named structure-field expressions need exact layout proof (C-17)",
  "Exception/unwind-aware decompilation not modeled (C-26)",
];

export const PARITY_NOTE =
  "Counts describe the audited ledger itself — not a percentage of IDA Pro's or Ghidra's entire feature sets. “Supported” means verified within its stated scope; “Partial” is a meaningful but incomplete implementation; “Missing” has no product implementation; “Unverified” lacks acceptance evidence.";
