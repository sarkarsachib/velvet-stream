# Velvet Stream

Build a polished, responsive, cinematic streaming website with an original identity. This is a fresh project. Prioritize a beautiful and genuinely smooth UI/UX, with a monetization system that does not make visitors bored or frustrated.

PRODUCT RULES
- Public visitors must NOT have user authentication, sign-up, login, user accounts, profiles, or account-based features.
- No user-auth tables or login/register pages.
- Use localStorage only for lightweight optional preferences and playback progress.
- Admin configuration must not be exposed to ordinary visitors. Do not invent or expose credentials; if an admin area cannot be secured without adding authentication, keep admin functionality out of the public routes and use configuration/environment placeholders until a secure admin mechanism is explicitly specified.
- Use clearly marked sample/demo content and authorized-media placeholders. Do not claim copyrighted films/anime are licensed or playable without real authorized sources.

VISUAL DIRECTION
- Premium dark cinematic design: background #08090D, surfaces #11131B, violet accent #8B5CF6, ice-blue accent #64D9FF, high-contrast readable text.
- Distinctive 3D-styled icon system: use Lucide/SVG for everyday icons and a few custom glossy 3D-styled signature icons. Do not render every icon/card as a heavyweight 3D scene.
- Cinematic hero with artwork, readable gradient overlay, title, short synopsis, metadata, Play and More Info actions.
- Smooth horizontal content rails, elegant movie cards, subtle hover lift and perspective on desktop, touch-friendly cards on mobile.
- Sections: Trending Now, Continue Watching (local-only), Hidden Gems, Anime Universe, Recently Added, Popular Series, and genre collections.
- Build title detail page, search/discovery page, and a player page with polished empty/loading/error states.
- Make it feel like a distinctive premium product, not a generic Netflix copy.
- Use tasteful page transitions and micro-interactions, but keep the interface calm. Respect reduced-motion settings.

STREAMING PLAYER
- Build a real player component abstraction ready for authorized HLS/native video sources. Do not fake streaming with a simulated progress animation.
- Include play/pause, seeking, volume, fullscreen, playback speed, quality/subtitle UI only when actual source tracks/options are available, keyboard accessibility, loading/error recovery, and local playback progress.
- If no real media URL is configured, show a clear demo/preview state instead of pretending a video is playing.
- Keep unrelated ads out of active playback controls and do not let ad scripts block initial rendering.

MONETIZATION / AD UX
Build a modular advertising layer with isolated provider adapters/configuration for Adsterra and Monetag display/native/pop-under formats, and optional VAST-compatible pre-roll/mid-roll integration for a provider that supports the selected player. Treat HilltopAds/ExoClick/Primis as optional future adapters, not as live integrations by default.
- Do not fabricate ad tags, publisher IDs, credentials, or revenue data.
- Keep integrations disabled until real provider codes/IDs are supplied.
- Include clearly labeled, responsive ad slots on the homepage, between content rails, and title details. Sponsored cards must be clearly distinguishable from actual titles.
- Add an ad eligibility/frequency manager: configurable caps, cooldowns, route exclusions, mobile/desktop rules, provider failure fallback, and no repeat bombardment.
- Never disguise ads as Play/Download buttons, force click-throughs, inject arbitrary popups during active playback, or create deceptive redirects.
- Pop-under behavior is best-effort and must respect browser behavior and network policy. No fake promise that it will always trigger.
- Push notifications are optional only; do not request permission on page load or repeatedly after dismissal. Provide a clear value proposition and respect denial.
- Do not use URL-shortener chains on normal streaming access.
- Create tasteful empty/reserved ad slots when no provider is configured, but avoid blank holes and layout shifts. Collapse unused slots cleanly.
- Add a monetization/experience configuration module for provider status, placement status, caps, and fallback behavior. Do not expose privileged settings to public visitors.
- Analytics should be privacy-conscious and clearly distinguish estimates from verified provider revenue. Track aggregate placement impressions/errors where feasible; do not invent data.

PERFORMANCE AND QUALITY
- React + TypeScript using the project's default supported stack and reusable components.
- Mobile-first responsive design, especially Android browsers and low-to-mid-range phones.
- Lazy-load below-the-fold artwork, use appropriately sized/compressed images, avoid layout shifts, keep 3D limited, pause offscreen effects, and prefer transform/opacity animations.
- Ensure ad scripts load asynchronously and fail safely.
- Accessible contrast, semantic HTML, keyboard navigation, touch targets, useful empty/error states.
- Do not add unnecessary dependencies or backend complexity.
- No public user authentication or accounts, under any circumstances.
- Build the actual functioning UI and routes, not just a landing-page mockup. Start by completing the design system, homepage, content cards/rails, search, details page, and player shell; then implement local progress and the isolated ad-slot system. Clearly report any integrations that still need external IDs, licensed media URLs, or manual configuration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5c7c2b7f-a7cf-4ed1-9df1-ea1c1092d2e3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Deployment

See [Firebase App Hosting setup](FIREBASE_DEPLOYMENT.md) for the production Node.js runtime and project connection steps.
