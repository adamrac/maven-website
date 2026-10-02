# Marlo website

A one-page site for Marlo, a women's health companion. It has one job: get
her to download the app.

Built with **Astro 5**, hand-written CSS and a little vanilla TypeScript. No UI
framework. Output is fully static.

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # static output to dist/
npm run preview    # serve the built output
npm run check      # astro + TypeScript diagnostics
```

---

## The page, top to bottom

| Section | What it does |
| --- | --- |
| Hero (`HeroStory.astro`) | Centred headline, the app rising from the bottom. Her scattered notes and symptoms float around it; as you scroll they fly into the phone, which turns them into one clear answer. |
| Is this you? `#story` | Five things she's been told or has to do, lit up one at a time as you scroll. |
| It shouldn't be this hard | Words brighten as you scroll past. |
| How Marlo helps `#meet` | Three tall cards, each with a small live piece of the app (`FeatureCard.astro`). |
| Like a friend would `#how` | A phone that plays out a check-in, a cycle estimate and a kind note (`PhoneDemo.astro`). |
| The sentence | "No, that's not normal. Let's sort it out." with a hand-drawn underline. |
| Show your doctor `#report` | An example health summary whose numbers count up (`HealthReport.astro`). |
| What's inside `#inside` | Two slow, endless rows of features (`Marquee.astro`). |
| You're safe here `#safe` | Four promise cards and four safety points. |
| Download `#download` | App Store and Google Play buttons. |

**The only call to action is "Download the app"** (`DownloadButton.astro`).

The nav is a floating pill (`Nav.astro`) with three in-page links and the
download button.

The old Features, Safety and About pages, and the components only they used,
are in `archive/`. They are not built.

## Copy rules

The reader is a woman who wants help with her health, not a tech person.

- Plain, warm, everyday words. Say it the way a friend would.
- No jargon ("luteal phase", "insights", "non-diagnostic"), no slogans.
- No em dashes.
- No eyebrows/overlines above headings, no captions under images.
- Cards in a row get matching copy lengths so they line up.

## Wiring the download buttons

```bash
cp .env.example .env
# PUBLIC_APP_STORE_URL=https://apps.apple.com/au/app/...
# PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=...
```

Until these are set, every "Download the app" button scrolls to the store
buttons at the bottom of the page, and those don't go anywhere yet. Once set,
the store buttons link to the listings, and on a phone every "Download the
app" button goes straight to the right store.

The store buttons are drawn in the brand style. Apple and Google both publish
official badges, so swap those in if you need strict compliance.

## Motion

`src/scripts/motion.ts` runs Lenis smooth scroll and one animation loop. It
also handles split-word headlines, scroll-lit words and lists, count-ups,
hand-drawn strokes, parallax, gentle pointer drift and magnetic buttons.

Everything is gated on `prefers-reduced-motion` and only hides content once
JS has confirmed it's running. If the script never runs, the page is complete
and still. The hero then shows the notes around the phone and the answer
already on its screen.

## Brand system

Colours, type and tokens live in `src/styles/global.css` and follow the Marlo
Brand Guidelines v1.0: berry for body copy, clay for large type only, sky,
blush and butter as surfaces only, and cream leading every layout. The display
face is Aloevera (self-hosted, single weight); body text is Karla.

## Still to do

- **Store URLs.** See above.
- **Social proof.** There are no reviews or user numbers on the page. Add
  them only when they're real.
- **Crisis numbers.** The footer lists 000, Lifeline, 1800RESPECT and 13YARN.
  These should be checked by the Clinical Lead before launch.
- **Legal pages.** No privacy policy or terms yet.
- **OG image.** `og:image` isn't set.
