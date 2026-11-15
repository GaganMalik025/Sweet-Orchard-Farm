/**
 * Re-encode the owner's walk-through video for the web, plus a poster frame.
 *
 *   node scripts/prepare-video.mjs
 *
 * Needs ffmpeg with libx264 on PATH. The source .mov (1080×1920, ~91MB) is
 * gitignored; only the outputs in public/video are committed.
 *
 * - 720×1280: the video renders at most ~340 CSS px wide, so this is still
 *   2× on high-density screens at a fraction of the size.
 * - H.264 High, yuv420p: plays in every current browser, unlike the .mov.
 * - Audio removed (-an): the owner chose a silent loop.
 * - +faststart: moves the index to the front so playback starts before the
 *   whole file has downloaded.
 */
import { execFileSync } from "node:child_process";
import { mkdirSync, statSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "Sweet Orchard_r001.mov");
const outDir = path.join(root, "public/video");
const video = path.join(outDir, "farm-walkthrough.mp4");
const poster = path.join(outDir, "farm-walkthrough-poster.jpg");
const MAX_VIDEO_BYTES = 8 * 1024 * 1024;

mkdirSync(outDir, { recursive: true });

execFileSync("ffmpeg", [
  "-v", "error", "-y", "-i", src,
  "-an",
  "-vf", "scale=720:1280",
  "-c:v", "libx264", "-preset", "slow", "-crf", "28",
  "-profile:v", "high", "-pix_fmt", "yuv420p",
  "-movflags", "+faststart",
  video,
], { stdio: "inherit" });

// First second is the veranda looking out over the lawn: a calm opening frame.
execFileSync("ffmpeg", [
  "-v", "error", "-y", "-ss", "1", "-i", src,
  "-frames:v", "1", "-vf", "scale=720:1280", "-q:v", "4",
  poster,
], { stdio: "inherit" });

const size = statSync(video).size;
if (size > MAX_VIDEO_BYTES) {
  throw new Error(`farm-walkthrough.mp4 is ${(size / 1048576).toFixed(1)}MB, over 8MB`);
}
console.log(`farm-walkthrough.mp4 (${(size / 1048576).toFixed(1)}MB)`);
console.log(`farm-walkthrough-poster.jpg (${Math.round(statSync(poster).size / 1024)}KB)`);
