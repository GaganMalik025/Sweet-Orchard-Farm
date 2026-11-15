import PHOTOS from "./gallery-photos.json";

/**
 * The photo strip under the masthead.
 *
 * The list lives in gallery-photos.json so that scripts/prepare-photos.mjs
 * can read the same file → source mapping without a TypeScript step. Order
 * in that file is display order. Alt text must describe what the frame
 * actually shows, like every other caption on the site.
 *
 * Curated from the owner's 25 photos in "Farmhouse Photos no watermark/":
 * close near-duplicates were left out (photos 1, 2, 11, 14, 15, 19 and the
 * unnumbered one), keeping one frame of each room and view.
 *
 * The strip is laid out in columns that alternate a single large photo and
 * a stacked pair: big, pair, big, pair… Read in file order, that is
 * entries 1 | 2+3 | 4 | 5+6 and so on. The strip loops, so the last column
 * sits next to the first. For that seam to alternate as well, the list
 * must make an even number of columns, which means its length must be a
 * multiple of six. The check below fails the build otherwise.
 */
export interface GalleryPhoto {
  file: string;
  source: string;
  alt: string;
}

export type GalleryColumn =
  | { kind: "big"; photo: GalleryPhoto }
  | { kind: "pair"; photos: [GalleryPhoto, GalleryPhoto] };

export const GALLERY_PHOTOS: readonly GalleryPhoto[] = PHOTOS;

if (GALLERY_PHOTOS.length % 6 !== 0) {
  throw new Error(
    `lib/gallery-photos.json has ${GALLERY_PHOTOS.length} photos; the looping ` +
      "big/pair collage needs a multiple of six.",
  );
}

// Every three photos make two columns: one big, one pair.
export const GALLERY_COLUMNS: readonly GalleryColumn[] = Array.from(
  { length: (GALLERY_PHOTOS.length / 3) * 2 },
  (_, i): GalleryColumn => {
    const at = Math.floor(i / 2) * 3;
    return i % 2 === 0
      ? { kind: "big", photo: GALLERY_PHOTOS[at] }
      : { kind: "pair", photos: [GALLERY_PHOTOS[at + 1], GALLERY_PHOTOS[at + 2]] };
  },
);

export const gallerySrc = (file: string) => `/gallery/${file}`;

/**
 * The walk-through video. Re-encoded from "Sweet Orchard_r001.mov" by
 * scripts/prepare-video.mjs: 720×1280 H.264, audio removed (the owner chose
 * a silent loop), with a poster frame for before it plays.
 */
export const FARM_VIDEO = {
  src: "/video/farm-walkthrough.mp4",
  poster: "/video/farm-walkthrough-poster.jpg",
  width: 720,
  height: 1280,
} as const;
