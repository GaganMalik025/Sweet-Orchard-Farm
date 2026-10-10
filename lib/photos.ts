/** Bump when replacing files so browser/CDN image caches show the new batch. */
export const PHOTO_VERSION = "20261010";

export function photoSrc(src: string): string {
  return `${src}${src.includes("?") ? "&" : "?"}v=${PHOTO_VERSION}`;
}
