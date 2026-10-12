# Manual activation checklist

The public experience has no admin or visitor login. Configuration is source-controlled; private credentials must never be bundled. All providers are disabled.

## Display and native placements
- Configure only a provider-approved HTTPS public script URL in the relevant adapter. Some tags require additional inline globals or placement-specific markup: adapt `providerAdapters` to the exact installation supplied by the provider before activation. A script URL alone is not guaranteed to produce an ad.
- Review publisher/network eligibility, geography, mobile rules, applicable opt-outs and placement-specific tags. The current no-banner default blocks consent-required or unknown geography; it does not authorize customer matching anywhere.
- Defaults limit successful attempts to three per visit with a two-minute cooldown; playback routes are excluded. Failed requests fall back to a compact explicitly reserved placement or can collapse by configuration.
- Labels remain visible. Sponsored creative must be separately labeled and never inserted as ordinary catalog data.
- Provider code is arbitrary third-party JavaScript: activate only after reviewing actual network policy and script behavior. The generic adapter cannot enforce a provider's runtime behavior.

## Optional formats
Pop-under is off and has no automatic event listeners. The best-effort helper must only be attached to an explicit eligible user gesture outside playback after provider review; browsers may prevent it, particularly after asynchronous eligibility checks. Do not bypass blockers.

VAST is a disabled configuration placeholder, not a functioning ad SDK. A selected compatible player/provider SDK, real VAST tag, lifecycle handling, consent signals and testing are required before pre-/mid-roll can be activated. Content playback must not depend on ad success. HilltopAds, ExoClick and Primis are not installed. Push notifications are not installed and no permission prompt is shown.

## Consent and disclosure
Before live advertising, update the linked privacy page with the exact enabled provider, data and purposes. If adding a regional choice flow, maintain visitor-specific notice/choice evidence with timestamp, acceptance and later withdrawal, and read the current choice for every send across tabs. Honor opt-outs outside consent regions too. No advertising consent or matching record currently exists; do not enable consent-region transmission without one.

## Verification
In-memory visibility/error counters are diagnostic estimates only, never verified impressions or revenue. Test real approved tags with provider tools, include mobile/ad-blocker/failure cases, and verify public production after deployment. No remote analytics ingestion or provider revenue API is configured.

## Authorized playback
Add a verified authorized `MediaSource` to the catalog with `native` or `hls` type. Supply captions and alternate qualities only when actual sources exist. Test media host CORS, seeking, fullscreen, mobile native playback, speed, recovery and returning local progress. The unconfigured public UI intentionally shows a preview with no simulated stream.