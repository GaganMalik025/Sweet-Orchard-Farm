/**
 * Reproduce the selected web assets without altering the owner's source PNGs.
 *
 *   node scripts/prepare-photos.mjs           # section photos and gallery
 *   node scripts/prepare-photos.mjs photos    # section photos only
 *   node scripts/prepare-photos.mjs gallery   # gallery strip only
 */
import sharp from "sharp";
import path from "node:path";
import { readFileSync } from "node:fs";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "Farmhouse Photos no watermark");
const only = process.argv[2];
const MAX_BYTES = 500 * 1024;

const slots = [
  ["hero.jpg", "photo-22-cleaned.png", 1600, 900],
  ["arrival.jpg", "photo-10-cleaned.png", 1596, 1064],
  ["rooms.jpg", "photo-7-cleaned.png", 1596, 1064],
  ["dining.jpg", "photo-18-cleaned.png", 1596, 1064, 84],
  ["pool-02.jpg", "photo-23-cleaned.png", 1596, 1064],
  ["rain-dance-02.jpg", "photo-13-cleaned.png", 1596, 1064],
  ["night.jpg", "photo-21-cleaned.png", 1600, 900],
  ["og.jpg", "photo-22-cleaned.png", 1200, 630],
  ["pool-01.jpg", "photo-23-cleaned.png", 848, 1060],
  ["rain-dance-01.jpg", "photo-13-cleaned.png", 848, 1060],
];

if (!only || only === "photos") {
  for (const [asset, filename, width, height, quality = 88] of slots) {
    const info = await sharp(path.join(source, filename))
      .resize(width, height, { fit: "cover", position: "centre", withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true })
      .toFile(path.join(root, "public/photos", asset));
    if (info.width !== width || info.height !== height || info.size > MAX_BYTES) {
      throw new Error(`${asset}: expected ${width}×${height} and at most 500KB`);
    }
    console.log(`${asset} ← ${filename} (${Math.round(info.size / 1024)}KB)`);
  }
}

/*
 * Gallery strip. The list, its order and its alt text live in
 * lib/gallery-photos.json, which the page reads too. Frames keep their own
 * aspect ratio (the tiles crop with object-cover) and are capped at 1600px
 * wide: a large tile renders about 630 CSS px wide on desktop, so this
 * covers 2× screens.
 */
if (!only || only === "gallery") {
  const gallery = JSON.parse(readFileSync(path.join(root, "lib/gallery-photos.json"), "utf8"));
  const outDir = path.join(root, "public/gallery");
  await mkdir(outDir, { recursive: true });
  for (const { file, source: filename } of gallery) {
    const info = await sharp(path.join(source, filename))
      .resize({ width: 1600, withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(path.join(outDir, file));
    if (info.size > MAX_BYTES) {
      throw new Error(`gallery/${file}: ${Math.round(info.size / 1024)}KB, over 500KB`);
    }
    console.log(`gallery/${file} ← ${filename} (${info.width}×${info.height}, ${Math.round(info.size / 1024)}KB)`);
  }
}
