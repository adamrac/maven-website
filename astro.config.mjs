import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static marketing site for Marlo. No client framework: the few interactive
// bits are small vanilla scripts, so pages ship essentially zero JS.
//
// SITE_URL and BASE_PATH let the same code deploy to a subfolder, e.g. GitHub
// Pages at https://adamrac.github.io/maven-website (see the deploy workflow).
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://marlohealth.com.au',
  base: process.env.BASE_PATH ?? '/',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
