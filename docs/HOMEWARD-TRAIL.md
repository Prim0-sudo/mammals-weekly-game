# Homeward Trail — local implementation, 5 October 2026

Replaces the active Field Notes spelling presentation only. Vocabulary (132 words in six categories: 50/8/24/22/20/8), category paths, queues, scoring and navigation stay in the existing GameEngine. This change is local: no commit, push or deployment. The repository automatically deploys pushes to main.

## Gameplay and scene

- Nine unique incorrect letters cause loss; nine supplied chance tokens fade one at a time and a real-text counter reports remaining chances.
- A new correct letter reveals all repeats and makes one hop. Duplicate guesses do nothing. Normalization uses the existing `letters()` function; spaces and punctuation are excluded from the distinct-letter count.
- The scene uses the original 1672 × 941 coordinate system: rabbit start (230,706), home (1370,662), trail distance 1140, registered torso width 116. Without mistakes each correct letter advances 1140/distinctLetters. After a wrong hop, correct letters divide the remaining distance by the remaining distinct letters, guaranteeing forward hops and the same final entrance. Correct hop movement has a 44-unit arc.
- Hop: sit 40 ms, takeoff 90 ms, airborne 110 ms, landing 90 ms, sit 20 ms (350 ms total). Each new miss uses the same 350 ms pose sequence with an 18-unit arc and advances 64 units, capped at the trail midpoint x=800. If already at or beyond the midpoint, it hops in place, never backward. Duplicate guesses do nothing. Letter input is visibly locked throughout animations.
- Win: final hop, then crouch/rear-quarter/tail over 600 ms. Travel accelerates into the doorway while scale reduces with depth. A curved clip redraws the original background's entrance lip/ground over the rabbit. No rabbit alpha fade. Result and score occur once after entry completes.
- Loss: ninth miss locks immediately and completes its small hop; the left-facing fox then enters from the right. Rabbit sits mirrored for 80 ms, then uses the three supplied left-facing escape poses at 80 ms per frame. It moves to x=-300, beyond its entire registered silhouette. Fox remains at x=1455. Answer/result appears after escape.
- Reduced motion settles each hop or ending immediately. Visibility changes suspend RAF and elapsed time; resuming does not catch up. Exit/restart/next destroy the previous renderer and remove RAF, visibility/media listeners and completion callbacks. Logical guesses/results remain in GameEngine; the renderer owns visual poses only.

## Supplied assets

All 13 original PNGs, original manifest and notes are retained under `docs/homeward-trail-originals/Homeward_Trail_Assets/`. Their original bytes, dimensions and SHA-256 checksums are verified. Nothing was generated or redrawn as replacement animal artwork.

`scripts/import-homeward-trail.py` creates separately named lossless WebP derivatives: background retains native dimensions, sprites are cropped to manifest alpha bounds and resized to at most 640 pixels, token to 96 pixels. Transparency is retained. Delivery totals 4,674,374 bytes, about 4.7 MB. The audit in `homeward-trail-assets.json` records originals, derivatives, checksums, bounds and per-frame registration. `src/core/skins/homeward-assets.js` is generated registration metadata. Anchor/torso adjustments compensate for different source canvases and margins; all assets preload/decode before keyboard enablement.

## Changed files

- `src/core/skins/homeward-trail.js`: preload/cache, canvas renderer, foreground occlusion, lifecycle and adapter.
- `src/core/skins/homeward-motion.js`: pure trail/hop/entry/escape geometry.
- `src/core/skins/homeward-assets.js`: generated asset metadata; `src/core/skins/index.js` selects the active adapter.
- `src/core/game-engine.js`: adapter mounting, correct-letter locks/completion, nine-chance counter and scoped layout.
- `src/topics/mammals.js`, `src/core/topic-validator.js`: active Homeward skin contract/configuration.
- `src/styles/homeward-trail.css`, `index.html`: responsive scene, tokens, keyboard and short projector spacing.
- `scripts/import-homeward-trail.py`, `assets/topics/mammals/homeward-trail/`, original/audit directories and `docs/asset-manifest.json`: asset pipeline and delivery.
- `scripts/fixtures.mjs`, existing browser/layout fixtures, `tests/logic.test.js`, `tests/homeward.test.js`, `tests/homeward-browser.js`, `tests/homeward.html`: production-engine verification.
- `README.md`, `HANDOFF.md`, this document: current rules, checks and limits.

## Verification performed

- Node tests: **16/16 pass**. Existing content/queue/Flip/Wheel/Detective checks plus distinct-letter trail geometry for all 132 entries, punctuation/case handling, pose/end-state geometry and hashes for all 13 original/derived assets.
- Existing production-engine browser fixture: **21/21 pass**, covering all teaching routes, categories/All Words, reading, other activities, queue restoration, spelling locks/results/score-once and cleanup.
- Dedicated production-engine Homeward browser fixture: **8/8 pass**, covering decoding, normal hop poses, repeated letters/rapid input, final entry/occlusion/result delay, exactly nine misses, right fox/fully left escape, distinct counts/multi-word answers, restart during each sequence, next, repeated navigation and keyboard.
- Normal RAF animation frames were captured and visually inspected for sit/takeoff/air/landing/sit, all three entry poses and escape. The tail is visible before foreground concealment. These are normal running animations, not only settled frames.
- Layout fixtures use production CSS and active adapter with the production Home header: 1280×720, 1024×600, 768×1024, 360×800. No horizontal overflow; desktop/projector/tablet fit vertically. Keyboard bottoms about 651/531/745/793 pixels respectively. Phone content scrolls vertically (about 833 pixels). Long Hippopotamus and multi-word Guinea pig checked; nine tokens fit. Fixture diagnostic overlays are not production UI.
- Real preview browser keyboard input (`h`) revealed both H letters of Hedgehog and triggered one locked hop; on-screen navigation used the actual preview. No broken images or console warnings/errors in the inspected preview.
- Reduced motion and hidden-document checks used **fixture overrides/simulated signals**, including mid-animation changes. Fixture keyboard events are simulated; the separate preview check used browser keyboard input. No real OS reduced-motion setting or physical device was tested.
- Content/asset reconciliation, production build and whitespace checks pass. Build excludes originals, docs and fixtures. Local preview remains at http://127.0.0.1:4186/.

## Remaining visual limits

The supplied individual poses have small natural anatomy/perspective differences despite torso/ground registration. The burrow clip and anchors are tailored to this supplied background and need retuning if artwork changes. The scene shrinks on a short projector to retain readable 44-pixel keyboard targets. Phone sessions may require vertical scrolling, especially results. Browser viewport checks do not certify physical devices or OS motion preferences. Teacher/curriculum review remains outstanding and this task changes no vocabulary.
