import sharp from "sharp";
import { readFile, writeFile } from "node:fs/promises";

// Deterministic derivatives of the existing logo; run only when branding changes.
const logo = new URL("../public/assets/thecognitivekombuchalogo.png", import.meta.url);
const output = new URL("../public/assets/", import.meta.url);
await writeFile(
  new URL("logo.webp", output),
  await sharp(await readFile(logo))
    .resize(64, 64)
    .webp({ quality: 85 })
    .toBuffer(),
);
await writeFile(
  new URL("apple-touch-icon.png", output),
  await sharp(await readFile(logo))
    .resize(180, 180)
    .png()
    .toBuffer(),
);
const card = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#f6f1e9"/>
  <rect x="64" y="68" width="8" height="494" rx="4" fill="#6d5bb5"/>
  <text x="112" y="145" font-family="Arial, sans-serif" font-size="23" letter-spacing="4" fill="#6d5bb5">NOTES &amp; PROJECTS</text>
  <text x="108" y="280" font-family="Georgia, serif" font-size="76" fill="#2a2725">The Cognitive</text>
  <text x="108" y="370" font-family="Georgia, serif" font-size="76" fill="#2a2725">Kombucha</text>
  <text x="112" y="461" font-family="Arial, sans-serif" font-size="29" fill="#6f6a63">An engineering notebook by Aman Singh.</text>
  <text x="112" y="541" font-family="Arial, sans-serif" font-size="23" fill="#6f6a63">thecognitivekombucha.com</text>
</svg>`;
await writeFile(new URL("og-image.png", output), await sharp(Buffer.from(card)).png().toBuffer());
console.log("Generated header logo, touch icon, and social card.");
