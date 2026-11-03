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

## Draft pages

Two extra pages, linked from the footer under "About us" (not the top nav).

| Page | What it is |
| --- | --- |
| `/practitioners` (`practitioners.astro`) | For practitioners. Built from Bianca's "Marlo - Your Health Companion" outreach doc: a welcome from Bianca, who we are, why we exist, the two phases, the Australian difference and an invitation to partner. "Start a conversation" needs `PUBLIC_PARTNER_EMAIL` set. |
| `/team` (`team.astro`) | Our team. Group photo, why we built Marlo, and a card per person. Edit `team` at the top of the file. Roles are from the Roles and Responsibilities doc; intros are drafts for each person to rewrite. Headshots go in `public/images/team/` (Adam's still to come). |

## Copy rules

The reader is a woman who wants help with her health, not a tech person.

- Plain, warm, everyday words. Say it the way a friend would.
- No jargon ("luteal phase", "insights", "non-diagnostic"), no slogans.
- No em dashes.
- No eyebrows/overlines above headings, no captions under images.
- Cards in a row get matching copy lengths so they line up.

## AWS deployment

`.github/workflows/deploy-aws.yml` builds and deploys on pushes to `master`.
Develop on `staging`, then merge into `master` to release. Staging does not
deploy automatically. The existing `main` GitHub Pages workflow is unchanged.
Manual AWS runs also require selecting `master`.

One-time setup in AWS account `058914804891` (local profile `maven`):

The reproducible hosting template is `infrastructure/static-site.yaml`. It
uses the account's existing GitHub OIDC provider and creates a private bucket,
CloudFront with directory routing, and a role restricted to this repo's
`master` branch. It uses the CloudFront HTTPS hostname and makes no DNS changes.

```bash
aws cloudformation deploy --template-file infrastructure/static-site.yaml \
  --stack-name marlo-static-website --capabilities CAPABILITY_IAM \
  --profile maven --region ap-southeast-2
aws cloudformation describe-stacks --stack-name marlo-static-website \
  --profile maven --region ap-southeast-2 --query 'Stacks[0].Outputs'
```

Use outputs `RoleArn`, `S3Bucket`, and `DistributionId` for the corresponding
GitHub variables below. The bucket is retained if the stack is deleted.
Custom-domain certificate and DNS setup are separate from this template.

1. Create a dedicated private S3 website content bucket and a CloudFront
   distribution with origin access control. Set the default root object to
   `index.html`, route extensionless paths such as `/team` and `/team/` to
   `/team/index.html` with a viewer-request function, and serve `/404.html`
   with status 404 for missing objects. Use a cache policy with minimum TTL 0
   so CloudFront respects the HTML cache headers.
2. For the custom domain, create an ACM certificate in `us-east-1`, attach it
   and the domain alias to CloudFront, and change DNS when ready to cut over.
3. Configure GitHub's OIDC provider (`https://token.actions.githubusercontent.com`,
   audience `sts.amazonaws.com`) and a deployment role. Its trust policy must
   allow `sts:AssumeRoleWithWebIdentity` from that provider with both
   `token.actions.githubusercontent.com:aud` equal to `sts.amazonaws.com` and
   `token.actions.githubusercontent.com:sub` equal to
   `repo:adamrac/maven-website:ref:refs/heads/master`.
4. Give that role `s3:PutObject` on the dedicated bucket's objects,
   `s3:ListBucket` and `s3:GetBucketLocation` on the bucket, and
   `cloudfront:CreateInvalidation` and `cloudfront:GetInvalidation` on the
   target distribution. GitHub uses temporary OIDC credentials; it does not
   use the local AWS profile or require stored AWS access keys.

In GitHub **Settings → Secrets and variables → Actions → Variables**, set:

| Variable | Value |
| --- | --- |
| `AWS_ROLE_ARN` | ARN of the deployment role above (required) |
| `S3_BUCKET` | Dedicated content bucket name (required) |
| `CLOUDFRONT_DISTRIBUTION_ID` | Distribution ID (required) |
| `AWS_REGION` | Bucket region; defaults to `ap-southeast-2` |
| `SITE_URL` | Canonical origin; defaults to `https://marlohealth.com.au` |
| `PUBLIC_APP_STORE_URL` | Apple app listing URL |
| `PUBLIC_PLAY_STORE_URL` | Google Play listing URL |
| `PUBLIC_PARTNER_EMAIL` | Practitioner contact inbox |

Keep the existing `FONT_B64_1`, `FONT_B64_2`, and `FONT_B64_3` repository secrets
to restore the licensed font. If changing the canonical domain, also update
the sitemap URL in `public/robots.txt`.

The workflow uploads assets before HTML, retains older objects so cached
pages can still load their assets, and waits for CloudFront invalidation.
Removed pages remain in S3 until explicitly cleaned up. Deployment fails
early with a clear message if required variables are missing.

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
