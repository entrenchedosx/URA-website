# URA — Official Website

The official public-facing website for **URA — Ultimate Reverse Engineer**, a native Rust
static-analysis workbench ([github.com/entrenchedosx/URA](https://github.com/entrenchedosx/URA)).

This is a standalone marketing/documentation website. It is **not** part of the URA
application codebase — the repository remains the authoritative source for branding,
documentation, features and releases.

**Live:** https://entrenchedosx.github.io/URA-website/

## Stack

- React 19 + TypeScript, Vite 7
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Framer Motion (reduced-motion aware)
- Lucide React icons, self-hosted variable fonts (Inter, JetBrains Mono)
- No backend: the GitHub Releases integration speaks to the public GitHub REST API
  (tokenless) with a verified local snapshot as fallback.

## Development

```powershell
npm install
npm run dev        # http://localhost:5173
```

`npm run dev` serves at `base = "/"`.

## Production build

```powershell
npm run build      # typecheck + vite build → dist/
npm run preview    # serve dist/ locally
```

The GitHub Actions deployment builds with `--base=/URA-website/` automatically.

## Assets

- `public/icon.webp`, screenshots (`public/screenshots/*`) and favicon variants are the
  official assets fetched from the URA repository (`icon.webp` is the owner-supplied official
  artwork, redistributable with URA per its README).
- `public/og-image.png` is generated from the official artwork via `npm run og:image` (sharp).

## Deployment (GitHub Pages)

CI lives in `.github/workflows/deploy.yml`:

1. Pushes to `main` trigger a Pages deployment (Actions source).
2. Pages must be enabled once: *Settings → Pages → Build and deployment → Source: GitHub Actions*.
3. The workflow typechecks, builds with `--base=/URA-website/`, and deploys `dist/`.

The canonical URL / OG metadata assume the Pages origin
`https://entrenchedosx.github.io/URA-website/`. If the site moves to a custom domain,
update: `index.html` (canonical + OG links), `src/lib/site.ts` (`SITE_URL`),
`public/robots.txt`, `public/sitemap.xml`, and the workflow `--base` flag.

## Content integrity notes

- Download links only ever point at **real published GitHub release assets**; the API is
  queried live with a curated, verified fallback snapshot served when GitHub is unreachable
  or rate-limited.
- All published URA builds are prereleases; the site labels development checkpoints,
  surfaces audit warnings (e.g. the outdated `v0.8.0-dev` attached build), and never claims
  a stable release exists.
- Star/fork counts are rendered only when the GitHub API responds successfully.
