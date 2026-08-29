# Launch-Checkliste – 20 Dinge vor dem Go-Live

Quelle: TikTok-Video "20 Dinge die du Claude sagen sollst bevor du deine Website launchst" (@Alan | Automatisierung&Beratung)

- [x] 1. Eigene 404-Seite
- [x] 2. Klarer CTA (Call-to-Action)
- [x] 3. Interne Links
- [x] 4. Danke-Seite (nach Kontaktformular/Anfrage)
- [x] 5. Breadcrumbs
- [x] 6. Kundenprojekte / Referenzen
- [x] 7. 5 FAQs
- [x] 8. Antwortzeitversprechen
- [x] 9. 24/7-Kontakt-Button
- [x] 10. robots.txt
- [x] 11. Eigener Seitentitel (Title-Tag)
- [x] 12. Meta-Beschreibungen
- [x] 13. Vorschaubilder (Social/OG-Images)
- [x] 14. Karte + Anfahrt
- [x] 15. Echte Bewertungen
- [x] 16. Alt-Texte für Bilder (geprüft: keine `<img>`-Elemente ohne Alt-Text vorhanden; Projektfotos sind dekorative CSS-Flächen mit beschreibendem `<figcaption>`)
- [x] 17. Local Schema (strukturierte Daten / LocalBusiness)
- [x] 18. Google Analytics (als deaktivierter Platzhalter hinterlegt, siehe Hinweis unten)
- [x] 19. Datenschutzseite
- [x] 20. Team-Foto (Illustrationen statt echter Fotos, da fiktiver Demo-Betrieb)

## Alle 20 Punkte abgehakt 🎉

Zwei Hinweise für den echten Go-Live:

- **Google Analytics** ist bewusst nur als auskommentierter Platzhalter in den
  `<head>`-Bereichen hinterlegt (echte Messungs-ID einsetzen und erst nach
  einer DSGVO-konformen Cookie-Einwilligung aktivieren).
- **og:url / og:image** nutzen die fiktive Demo-Domain `sonnenwerk-solar.de` –
  vor dem Launch durch die echte Domain ersetzen.

## Hosting

Seit August 2026 läuft das Hosting über Netlify (`netlify.toml`, `publish = "test"`)
statt über GitHub Pages.
