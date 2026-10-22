import { mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

/* Compose the Open Graph card from URA's official artwork.
 * Fonts are attempted; if the runtime lacks font assets the card still ships
 * without lettering (icon + atmosphere remain the identity). */

const W = 1200;
const H = 630;
const D = 120; // icon diameter

const svg = `\
<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linear-gradient>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0c0f16"/>
        <stop offset="1" stop-color="#06070a"/>
      </linearGradient>
    </linear-gradient>
    <radialGradient id="glow" cx="0.24" cy="0.32" r="0.55">
      <stop offset="0" stop-color="#8b7cf6" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#8b7cf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glow2" cx="0.85" cy="0.85" r="0.5">
      <stop offset="0" stop-color="#4d9fff" stop-opacity="0.13"/>
      <stop offset="1" stop-color="#4d9fff" stop-opacity="0"/>
    </radialGradient>
    <pattern id="grid" width="54" height="54" patternUnits="userSpaceOnUse">
      <path d="M54 0H0V54" fill="none" stroke="rgba(151,160,182,0.07)" stroke-width="1"/>
    </pattern>
    <linearGradient id="across" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#eef0f6"/>
      <stop offset="0.55" stop-color="#cfc7fb"/>
      <stop offset="1" stop-color="#9d8df7"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#grid)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>
  <rect width="${W}" height="${H}" fill="url(#glow2)"/>
  <text x="${92 + 26}" y="326" font-family="Inter, 'Segoe UI', sans-serif" font-size="104" font-weight="700" letter-spacing="14" fill="#eef0f6">URA</text>
  <text x="${92 + 28}" y="386" font-family="Inter, 'Segoe UI', sans-serif" font-size="44" font-weight="600" letter-spacing="3" fill="url(#across)">Ultimate Reverse Engineer</text>
  <text x="${92 + 30}" y="452" font-family="'Segoe UI', sans-serif" font-size="26" font-weight="400" fill="rgba(151,160,182,0.95)">A native Rust reverse-engineering workbench</text>
  <text x="${92 + 30}" y="490" font-family="'Segoe UI', sans-serif" font-size="26" font-weight="400" fill="rgba(151,160,182,0.75)">Desktop &#183; CLI &#183; MCP &#8212; one shared analysis engine</text>
  <rect x="0" y="${H - 4}" width="${W}" height="4" fill="#8b7cf6"/>
</svg>`;

await mkdirSync(fileURLToPath(new URL("../public/", import.meta.url)), { recursive: true });

const badge = Buffer.from(
  `<svg width="${D + 24}" height="${D + 24}" viewBox="0 0 ${D + 24} ${D + 24}" xmlns="http://www.w3.org/2000/svg">
    <rect x="4" y="4" width="${D + 16}" height="${D + 16}" rx="26" fill="#0d1017" stroke="rgba(214,214,231,0.35)" stroke-width="2.5"/>
  </svg>`,
);

const icon = await sharp(fileURLToPath(new URL("../public/icon.webp", import.meta.url)))
  .resize(D, D, { fit: "cover" })
  .png()
  .toBuffer();

await sharp(Buffer.from(svg))
  .composite([
    { input: await sharp(badge).png().toBuffer(), left: 80, top: 66 },
    { input: icon, left: 92, top: 78 },
  ])
  .png()
  .toFile(fileURLToPath(new URL("../public/og-image.png", import.meta.url)));

console.log("og-image.png written");
