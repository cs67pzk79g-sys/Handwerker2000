# Handwerker2000

## Netlify Deployment – Credit-Sparsamkeit

Dieses Projekt ist mit Netlify (Free Plan) verbunden. Der Free Plan hat nur 300
Credits/Monat, und ein einzelnes Deployment kostet 15 Credits (~20 Deploys/Monat
insgesamt verfügbar).

`netlify.toml`s `[build].ignore`-Skript sorgt dafür, dass **nur ein Merge/Push auf den
production-Branch (`main`) einen echten Netlify-Build auslöst** – PR-Deploy-Previews und
Branch-Deploys (Pushes auf jeden anderen Branch, inkl. Feature-Branches) werden immer
übersprungen. Das heißt:

- **Pushen zu GitHub (Feature-Branch, PRs) ist frei nutzbar** und löst keinen
  Netlify-Build aus – dort gibt es kein Credit-Limit zu beachten.
- **Nur ein Merge auf `main` kostet Netlify-Credits.** Deshalb: Merges auf `main`
  bündeln statt nach jedem kleinen PR sofort zu mergen, und vor mehreren Merges kurz
  hintereinander kurz nachfragen, wenn absehbar ist, dass noch mehr folgt.
- **Erst lokal fertig testen, dann committen/pushen/PR/merge.** Beim Debuggen oder
  Testen mehrerer Fixes hintereinander: lokal (Playwright, lokaler HTTP-Server o.ä.)
  vollständig verifizieren, dann in einem gebündelten Commit pushen.
- Für PRs mit großen visuellen Änderungen, bei denen ein echter Deploy-Preview-Link
  gebraucht wird: den `ignore`-Schalter in `netlify.toml` temporär so ändern, dass
  `deploy-preview` ebenfalls baut, den Link teilen, und den Schalter danach sofort in
  einem eigenen PR zurücksetzen.
