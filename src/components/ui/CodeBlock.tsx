import { Check, Copy } from "lucide-react";
import { useMemo, useState } from "react";

export type CodeLang = "shell" | "json";

interface Token {
  text: string;
  cls: string;
}

const BIN = "cargo|npm|python|ura-cli|ura-mcp|ura-native|invoke-webrequest";

const SH_BASE = "text-ink-200";
const SH_MAP: Record<string, string> = {
  comment: "text-ink-400 italic",
  bin: "text-royal-300",
  flag: "text-signal-400",
  string: "text-emerald-300/90",
  num: "text-gilt-400",
  path: "text-ink-50",
};

const JSON_KEY = "text-signal-300";
const JSON_STR = "text-emerald-300/90";
const JSON_NUM = "text-gilt-400";
const JSON_BOOL = "text-royal-300";
const JSON_PUNCT = "text-ink-400";

function scanShell(code: string): Token[] {
  const re = new RegExp(
    String.raw`(\#[^\n]*)|(${BIN})|(--[\w][\w-]*)|(\$env:\w+)|("[^"\n]*"|'[^'\n]*')|(0x[0-9A-Fa-f]+|\b\d+\b)|([\w\\/.:-]+\.(?:exe|json|jsonc|ps1|py|ura|elf|zip|dll|md|txt|webp|xml))`,
    "g",
  );
  const groups: Array<[number, string]> = [
    [1, "comment"],
    [2, "bin"],
    [3, "flag"],
    [4, "flag"],
    [5, "string"],
    [6, "num"],
    [7, "path"],
  ];
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (m[0].length === 0) {
      re.lastIndex++;
      continue;
    }
    if (m.index > last) tokens.push({ text: code.slice(last, m.index), cls: SH_BASE });
    let cls: string | undefined;
    for (const [gi, key] of groups) {
      if (m[gi] !== undefined) {
        cls = SH_MAP[key];
        break;
      }
    }
    tokens.push({ text: m[0], cls: cls ?? SH_BASE });
    last = re.lastIndex;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), cls: SH_BASE });
  return tokens;
}

function scanJson(code: string): Token[] {
  const re =
    /("[^"\\\n]*(?:\\.[^"\\\n]*)*")(\s*:)?|\b(true|false|null)\b|(-?\d+(?:\.\d+)?)|([{}[\],:])/g;
  const tokens: Token[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(code))) {
    if (m.index > last) tokens.push({ text: code.slice(last, m.index), cls: JSON_PUNCT });
    if (m[1] !== undefined) {
      tokens.push({ text: m[1], cls: m[2] !== undefined ? JSON_KEY : JSON_STR });
      if (m[2] !== undefined) tokens.push({ text: m[2], cls: JSON_PUNCT });
    } else if (m[3] !== undefined) {
      tokens.push({ text: m[3], cls: JSON_BOOL });
    } else if (m[4] !== undefined) {
      tokens.push({ text: m[4], cls: JSON_NUM });
    }
    last = re.lastIndex;
    if (re.lastIndex === m.index) re.lastIndex++;
  }
  if (last < code.length) tokens.push({ text: code.slice(last), cls: JSON_PUNCT });
  return tokens;
}

function highlight(code: string, lang: CodeLang): Token[] {
  return lang === "json" ? scanJson(code) : scanShell(code);
}

export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1600);
        });
      }}
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-md text-ink-300 transition-colors hover:bg-ink-700 hover:text-ink-50"
      aria-label={label}
    >
      {copied ? (
        <Check className="size-3.5 text-emerald-400" aria-hidden />
      ) : (
        <Copy className="size-3.5" aria-hidden />
      )}
    </button>
  );
}

interface CodeBlockProps {
  code: string;
  lang: CodeLang;
  title?: string;
  className?: string;
  ariaLabel?: string;
}

export function CodeBlock({ code, lang, title, className, ariaLabel }: CodeBlockProps) {
  const tokens = useMemo(() => highlight(code, lang), [code, lang]);
  return (
    <figure
      className={`overflow-hidden rounded-xl hairline bg-ink-900/90 shadow-card backdrop-blur-sm ${className ?? ""}`}
    >
      <figcaption className="flex items-center justify-between gap-2 border-b border-ink-700/70 bg-ink-850/80 px-4 py-2.5">
        <span className="flex items-center gap-2 font-mono text-xs text-ink-300">
          <span aria-hidden className="flex gap-1.5">
            <span className="size-2.5 rounded-full bg-ink-600" />
            <span className="size-2.5 rounded-full bg-ink-600" />
            <span className="size-2.5 rounded-full bg-royal-600/70" />
          </span>
          {title}
        </span>
        <CopyButton text={code} />
      </figcaption>
      <pre
        aria-label={ariaLabel ?? title}
        className="overflow-x-auto p-4 font-mono text-[0.8125rem] leading-6"
      >
        <code className="block whitespace-pre">
          {tokens.map((t, i) => (
            <span key={i} className={t.cls}>
              {t.text}
            </span>
          ))}
        </code>
      </pre>
    </figure>
  );
}
