<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## Application architecture

- Use a browser-safe typed sample catalog shared by leaf routes; media sources are explicitly optional so unconfigured titles never simulate playback.
- Keep browsing UI separate from the custom browser-API player; dynamically import HLS only for configured streams to minimize initial cost.
- Keep playback persistence in the local progress module and advertising in isolated provider adapters; never couple advertising scripts to player initialization.
- Keep advertising disabled until approved public publisher tags and provider-specific compliance review are supplied; consent-region or unresolved geography blocks all provider requests.
- Keep private provider credentials and admin operations out of the public application; public placement configuration is not an admin interface.
- Define visual roles and reusable cinematic styles in the global stylesheet; leaf routes own unique social metadata.
- Keep saved titles and optional motion preferences in the local-library module, synchronized across tabs; no account or remote persistence is involved.
- Use compact transparent rendered dimensional icon assets with a single image per icon; keep ordinary player transport icons flat and avoid WebGL runtime overhead.
- Render shared bottom navigation in the root shell but omit it on player routes and fullscreen; modal quick search uses the existing accessible dialog.
- Keep series seasons and episodes as browser-safe sample metadata with optional authorized sources, and use the player search parameter to select an episode.

- Keep custom playback controls capability-gated, never expose download actions, and use local progress only for real configured media.
- Use shared global spacing tokens for page gutters, header and bottom-navigation clearance; mobile video controls occupy a reserved band outside the picture.
