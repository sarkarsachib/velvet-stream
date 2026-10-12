import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck, Trash2 } from "lucide-react";
import { titleHead } from "@/lib/catalog";
import { clearProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
export const Route = createFileRoute("/privacy")({
  head: () =>
    titleHead(
      "Privacy & preferences",
      "How NOCTRA handles local playback progress, advertising placeholders and your privacy.",
    ),
  component: Privacy,
});
function Privacy() {
  const [cleared, setCleared] = useState(false);
  return (
    <main className="page content-wrap">
      <div className="eyebrow mb-4">
        <ShieldCheck size={15} />
        YOUR EXPERIENCE, YOUR CONTROL
      </div>
      <h1>Privacy & preferences</h1>
      <div className="privacy-copy">
        <p>
          NOCTRA is an original demo streaming experience. You do not need an account, and we do not
          provide visitor sign-up, profiles, or login.
        </p>
        <h2>Playback stays on your device</h2>
        <p>
          When an authorized video is available, its title identifier, playback position, duration,
          and last-played timestamp are stored only in this browser. No sample progress is
          generated. You can clear it below or through your browser’s site-data settings.
        </p>
        <Button
          variant="glass"
          onClick={() => {
            clearProgress();
            setCleared(true);
          }}
        >
          <Trash2 />
          Clear playback progress
        </Button>
        {cleared && (
          <p role="status" className="text-success">
            Local playback progress cleared.
          </p>
        )}
        <h2>Your saved stories & motion preference</h2>
        <p>
          My List stores only saved title identifiers in this browser. Your optional calmer-motion
          choice is also local. Neither is connected to an account or shared with advertising
          providers. Remove titles individually from My List, or clear your list and progress in
          experience settings.
        </p>
        <h2>Advertising</h2>
        <p>
          Adsterra and Monetag are planned recipients for display/native advertising. Both are
          disabled: reserved placements transmit no advertising data. Pop-under and VAST video ads
          are disabled, and no push permission is requested. HilltopAds, ExoClick and Primis are
          future options only.
        </p>
        <p>
          If an advertising provider is manually enabled, its approved tag may receive
          browser/device information, IP address, page context, cookie identifiers, and ad
          interactions for delivery, measurement and optimization. Our no-banner default blocks
          advertising in consent-required regions and when location cannot be determined. Elsewhere,
          applicable opt-outs must be honored before live advertising is activated. Customer
          matching is not configured.
        </p>
        <p>
          Consent-region advertising can only be enabled after a separate choice mechanism records
          the visitor’s acceptance time, notice version, advertising purposes and recipients, and
          provides an equally easy refusal and later withdrawal. Until then, it remains blocked. We
          currently store no advertising consent and send no provider events.
        </p>
        <h2>Measurement & external services</h2>
        <p>
          There is no revenue dashboard and no invented revenue. Optional enabled-placement
          visibility and failure counters are held temporarily in memory only; tag loading does not
          prove a provider impression or revenue. No behavioral analytics or customer matching is
          installed. Google Fonts receives ordinary font requests, including IP address. Configured
          media hosts would receive video requests when you open a playable title.
        </p>
        <h2>Original sample media</h2>
        <p>
          All titles, synopses, artwork, release years, ratings and runtimes are illustrative demo
          content. They do not establish rights to real films or anime. Authorized media and
          provider-specific installation review are required before launch.
        </p>
      </div>
    </main>
  );
}
