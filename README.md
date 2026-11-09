# Graha Kendra

Vedic astrology for Sri Lanka, in plain words. Birth charts (kendaraya), life periods, monthly lagna palapala, porondam matching, nakath times and guides, with accounts so people can save their charts.

## How it's put together

| Folder | What it is |
|---|---|
| `site/` | The website's source: pages, styles, the astrology engine and all reading texts |
| `firebase-site/` | The hostable version: sign-in, saved charts, Firebase settings and security rules |
| `.github/workflows/` | Automatic deploy: every change pushed to `main` goes live on Firebase |
| `prototypes/` | Earlier design versions, kept for reference |

Key files in `site/`:

- `core.js`: astronomy (planet positions, lagna, Lahiri ayanamsa), chart analysis and dasha periods
- `readings.js` and `narrative.js`: every reading text. An astrologer can review and correct the wording here.
- `extra.js`: transit texts, porondam tables, nakath rules and guide articles
- `app.js`: pages, navigation and the rendered sky

## Making changes

1. Edit files in `site/` (or `firebase-site/src/` for sign-in).
2. Commit and push to `main` on GitHub.
3. GitHub builds the site and deploys it to Firebase automatically, usually in about two minutes. Follow progress on the repository's **Actions** tab.

To deploy by hand instead, run `node build.js`, then `firebase deploy` from inside `firebase-site/`.

First-time setup: see [`firebase-site/SETUP.md`](firebase-site/SETUP.md).
