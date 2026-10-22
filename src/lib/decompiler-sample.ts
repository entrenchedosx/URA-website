export type Interaction = "asm" | "line";

export interface AsmRow {
  addr: string;
  m: string;
  o?: string;
  b: string;
}

export interface PseudoLine {
  n: number;
  text: string;
  /** Contributing instruction addresses, in machine order — URA stores this list on every line. */
  asm?: string[];
  /** No instruction address: declaration or structural line rendered by the emitter. */
  synthetic?: boolean;
  callTarget?: { fn: string; label: string };
}

export interface DecompilerSample {
  id: string;
  name: string;
  selection: string;
  asm: AsmRow[];
  lines: PseudoLine[];
}

/**
 * Documented emitter-contract renderings of the deterministic repository fixture
 * (tests/fixtures/ura64.exe) used by C-AST and SEM tests — an illustrative model,
 * not a live capture from a released build.
 */
export const DECOMPILER_SAMPLES: DecompilerSample[] = [
  {
    id: "sub_140001000",
    name: "sub_140001000",
    selection: "140001004",
    asm: [
      { addr: "140001000", m: "push", o: "rbp", b: "55" },
      { addr: "140001001", m: "mov", o: "rbp, rsp", b: "48 89 E5" },
      { addr: "140001004", m: "call", o: "sub_140001020", b: "E8 17 00 00 00" },
      { addr: "140001009", m: "pop", o: "rbp", b: "5D" },
      { addr: "14000100A", m: "ret", o: "", b: "C3" },
    ],
    lines: [
      { n: 1, text: "void sub_140001000(void)", asm: ["140001000"] },
      { n: 2, text: "{", synthetic: true, asm: [] },
      {
        n: 3,
        text: "    sub_140001020();",
        asm: ["140001004"],
        callTarget: { fn: "sub_140001020", label: "sub_140001020" },
      },
      { n: 4, text: "}", asm: ["14000100A"] },
    ],
  },
  {
    id: "sub_140001020",
    name: "sub_140001020",
    selection: "140001026",
    asm: [
      { addr: "140001020", m: "push", o: "rbp", b: "55" },
      { addr: "140001021", m: "mov", o: "rbp, rsp", b: "48 89 E5" },
      { addr: "140001024", m: "xor", o: "eax, eax", b: "31 C0" },
      { addr: "140001026", m: "add", o: "eax, 1", b: "83 C0 01" },
      { addr: "140001029", m: "cmp", o: "eax, 5", b: "83 F8 05" },
      { addr: "14000102C", m: "jl", o: "short loc_140001026", b: "7C F8" },
      { addr: "14000102E", m: "pop", o: "rbp", b: "5D" },
      { addr: "14000102F", m: "ret", o: "", b: "C3" },
    ],
    lines: [
      { n: 1, text: "void sub_140001020(void)", asm: ["140001020"] },
      { n: 2, text: "{", synthetic: true, asm: [] },
      { n: 3, text: "    unsigned int count_1;", synthetic: true, asm: [] },
      { n: 4, text: "", synthetic: true, asm: [] },
      { n: 5, text: "    count_1 = 0u;", asm: ["140001024"] },
      { n: 6, text: "    while (true)", asm: ["140001026", "14000102C"] },
      { n: 7, text: "    {", synthetic: true, asm: [] },
      { n: 8, text: "        count_1 = count_1 + 1u;", asm: ["140001026"] },
      { n: 9, text: "        if ((signed int)count_1 >= 5)", asm: ["140001029", "14000102C"] },
      { n: 10, text: "            break;", asm: ["14000102C"] },
      { n: 11, text: "    }", synthetic: true, asm: [] },
      { n: 12, text: "}", asm: ["14000102F"] },
    ],
  },
];
