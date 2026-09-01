# Handwerker2000

## Netlify Deployment – Credit-Sparsamkeit

Dieses Projekt ist mit Netlify (Free Plan) verbunden und deployt automatisch bei jedem
Push zu GitHub (`main`-Branch). Der Free Plan hat nur 300 Credits/Monat, und ein
einzelnes Production-Deployment kostet 15 Credits (~20 Deploys/Monat insgesamt
verfügbar).

Deshalb gilt für alle Änderungen an diesem Repo:

- **Änderungen bündeln.** Zusammengehörige Fixes/Features in einem Commit/Push
  zusammenfassen statt viele kleine Einzel-Pushes zu machen – jeder Push löst
  automatisch einen kostenpflichtigen Deploy aus.
- **Erst lokal fertig testen, dann pushen.** Beim Debuggen oder Testen mehrerer Fixes
  hintereinander: lokal (Playwright, lokaler HTTP-Server o.ä.) vollständig verifizieren,
  dann in einem gebündelten Commit pushen – nicht nach jeder kleinen Änderung einzeln.
- **Vor mehreren Pushes kurz hintereinander nachfragen**, wenn absehbar ist, dass noch
  weitere Änderungen folgen werden.
- **Lokale Vorschau statt Push zum Testen.** Für HTML/CSS/JS-Änderungen wenn möglich
  einen lokalen Server/Vorschau nutzen statt eines echten Pushes zu Netlify, um
  Deploy-Credits zu sparen.

Das bestehende `[build].ignore`-Skript in `netlify.toml` überspringt bereits
Deploy-Preview-Builds (ein Preview-Deploy pro PR) standardmäßig – dieser Schalter
sollte nur für PRs mit großen visuellen Änderungen temporär aktiviert und danach sofort
wieder zurückgesetzt werden (per eigenem PR).
