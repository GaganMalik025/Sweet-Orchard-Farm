/** Reproduce the selected web assets without altering the owner's source PNGs. */
import sharp from "sharp";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "Farmhouse Photos no watermark");
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

for (const [asset, filename, width, height, quality = 88] of slots) {
  const info = await sharp(path.join(source, filename))
    .resize(width, height, { fit: "cover", position: "centre", withoutEnlargement: true })
    .jpeg({ quality, mozjpeg: true })
    .toFile(path.join(root, "public/photos", asset));
  if (info.width !== width || info.height !== height || info.size > 500 * 1024) {
    throw new Error(`${asset}: expected ${width}×${height} and at most 500KB`);
  }
  console.log(`${asset} ← ${filename} (${Math.round(info.size / 1024)}KB)`);
}
