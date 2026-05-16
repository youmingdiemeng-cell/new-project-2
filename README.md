# 87.9 MHz

Single-page browser mystery game. The runtime entry point is `index.html`.

## Structure

- `assets/`
  Runtime assets grouped by type, mainly `audio/` and `images/`.
- `styles/core/`
  Phone shell, responsive layout, and shared UI foundation styles.
- `styles/apps/`
  App screen and component styles.
- `scripts/content/`
  Data-only modules for messages, radio, gallery, notes, mail, search, and related content.
- `scripts/apps/`
  Per-app render and interaction logic.
- `scripts/core/`
  Shared state, runtime helpers, phone shell behavior, and bootstrap code.
- `scripts/game/`
  Puzzle flow and ending logic.
- `docs/reference/`
  Reference text and non-runtime design material.
- `tools/`
  Deployment helpers and utility files.

## Maintenance Notes

- Keep narrative/content data in `scripts/content/` instead of mixing it into app renderers.
- Change structure and behavior in `scripts/apps/`, and visual presentation in `styles/`.
- Reference static assets from `assets/` only.
