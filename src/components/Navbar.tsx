import { AnimatePresence, motion } from "framer-motion";
import { Download, Github, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSectionSpy } from "../hooks/useSectionSpy";
import { asset, NAV_LINKS, REPO } from "../lib/site";

function Wordmark() {
  return (
    <a href="#top" className="group flex min-w-0 items-center gap-2.5" aria-label="URA — back to top">
      <span className="relative shrink-0">
        <img
          src={asset("/icon.webp")}
          alt=""
          width={32}
          height={32}
          className="size-8 rounded-lg ring-1 ring-white/15"
          loading="eager"
          decoding="async"
        />
        <span
          aria-hidden
          className="absolute -inset-1 rounded-xl bg-royal-500/20 opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-100"
        />
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="text-[0.9375rem] font-bold tracking-[0.08em] text-ink-50">URA</span>
        <span className="hidden text-[0.625rem] tracking-[0.14em] text-ink-400 uppercase sm:block">
          Ultimate Reverse Engineer
        </span>
      </span>
    </a>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const active = useSectionSpy(NAV_LINKS.map((l) => l.href.slice(1)));

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.style.overflowY = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflowY = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`pointer-events-none absolute inset-0 transition-all duration-500 ${
          scrolled
            ? "border-b border-ink-700/60 bg-ink-950/80 backdrop-blur-xl"
            : "border-b border-transparent bg-transparent"
        }`}
        aria-hidden
      />
      <nav aria-label="Primary" className="container-site relative flex h-16 items-center justify-between gap-4">
        <Wordmark />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-md px-3 py-2 text-[0.8125rem] font-medium transition-colors ${
                    isActive ? "text-ink-50" : "text-ink-300 hover:text-ink-50"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute inset-x-2.5 -bottom-0.5 h-0.5 rounded-full bg-royal-400"
                      transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    />
                  )}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href={REPO.url}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden size-9 items-center justify-center rounded-lg border border-ink-600/60 text-ink-200 transition-colors hover:border-ink-400 hover:text-ink-50 sm:inline-flex"
            aria-label="URA on GitHub"
          >
            <Github className="size-4" aria-hidden />
          </a>
          <a
            href="#downloads"
            className="hidden items-center gap-2 rounded-lg bg-royal-600 px-4 py-2 text-[0.8125rem] font-semibold text-white shadow-[0_8px_24px_-8px_rgb(115,100,226/0.7)] transition-all hover:bg-royal-500 hover:shadow-[0_8px_28px_-6px_rgb(115,100,226/0.85)] sm:inline-flex"
          >
            <Download className="size-3.5" aria-hidden />
            Download URA
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-lg border border-ink-600/60 text-ink-200 lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden border-b border-ink-700/60 bg-ink-950/95 backdrop-blur-xl lg:hidden"
          >
            <ul className="container-site flex flex-col gap-1 py-4">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      active === link.href.slice(1)
                        ? "bg-ink-800 text-ink-50"
                        : "text-ink-200 hover:bg-ink-800/60 hover:text-ink-50"
                    }`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="mt-2 flex gap-2 px-1 pb-1">
                <a
                  href="#downloads"
                  onClick={() => setOpen(false)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-royal-600 px-4 py-2.5 text-sm font-semibold text-white"
                >
                  <Download className="size-4" aria-hidden />
                  Download URA
                </a>
                <a
                  href={REPO.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-ink-600 px-4"
                  aria-label="URA on GitHub"
                >
                  <Github className="size-4 text-ink-200" aria-hidden />
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
