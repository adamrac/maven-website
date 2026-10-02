/**
 * The one action on this site: download the app.
 *
 * Set the store URLs in .env once the listings are live:
 *   PUBLIC_APP_STORE_URL=https://apps.apple.com/au/app/...
 *   PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=...
 *
 * Every "Download the app" button points at #download (the store badges at the
 * bottom of the page). On a phone, motion.ts rewrites those buttons to go
 * straight to the right store, when that store's URL is set.
 */
export const APP_STORE_URL: string = import.meta.env.PUBLIC_APP_STORE_URL ?? '';
export const PLAY_STORE_URL: string = import.meta.env.PUBLIC_PLAY_STORE_URL ?? '';

/** Prefix a root path with the site's base, so links work in a subfolder. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
export const withBase = (path: string) => `${BASE}${path}`;

export const DOWNLOAD_ANCHOR = withBase('/#download');
