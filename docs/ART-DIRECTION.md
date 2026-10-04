# Artwork and motion delivery brief

**Current brief:** [IMAGE-REQUEST.md](IMAGE-REQUEST.md) supersedes the original interface proposals below. The landing page uses an installed animal-free background, CSS badge/button and empty future animation layers. No static animals belong on it. 132 vocabulary images await approval; 16 optional interface slots use CSS/text. Unused generated animal drafts are archived locally and are excluded from publication.

Vocabulary: see IMAGE-CHECKLIST.md and asset-manifest.json, keyed by 132 stable IDs. All images are currently missing. The original curriculum PNG is retained byte-for-byte with SHA-256; it is a reference document, not an approved learning asset. No paid image generation was used. No animal art was improvised or borrowed from Little Bug Club.

## Separate interface art

- Logo: assets/topics/mammals/logo.png, 1600 × 900 transparent canvas. Friendly mammal group; identity stays readable HTML, no essential embedded text.
- Background: assets/topics/mammals/background.png, 1920 × 1080. Calm land-to-coast field-guide world. Keep central 65% low-contrast and clear for controls. Plan phone crop separately before acceptance.
- Start button: assets/topics/mammals/start-button.png, 1000 × 320 transparent. Blank warm paper or badge surface, centred HTML button text. Current button is ordinary CSS.
- Six category cards: categories/{mammals,fish,bodies,places,actions,young}.png, 1024 × 1024. Category-level compositions; not counted as vocabulary.
- Eight menu cards: menu/{learn,sort,sound,identify,knowledge,spelling,flip,wheel}.png, 1024 × 1024. Clear activity symbols in the same style. Sound remains locked.
- Questions: currently text-only neutral prompts, with no inferred answer-derived image. Optional reviewed illustrations must receive explicit question IDs before integration.
- Wheel: reuse approved per-word images as markers once supplied. Current wheel uses small text markers, a documented temporary limitation.
- Results: CSS stars/confetti currently, optional 1200 × 800 transparent celebration art later.

17 reserved interface paths plus 132 vocabulary paths = 149 missing required art mappings. Optional question/results/motion art is separate and uncounted.

## Spelling and optional animation

Active skin is Field Notes: six wrong guesses for every word. Correct guesses reveal every occurrence; repeated guesses do nothing. Wrong guesses consume one note slot. Input locks for 240 ms after a wrong guess and 300 ms on a win; reduced motion settles immediately. Win scores once and shows “Observation complete”. Loss reveals the answer and shows “Pause and read together”. There is no frog movement, eaten leaf or animal distress. Game state is owned by the engine; the adapter renders note states.

No animal/scenery animation is active or required for this draft. Before supplying an optional mascot sheet, agree a 1024 × 1024 canvas for every frame, native facing direction, bounding box, ground-contact point, body centre, mouth/tail anchors and front-facing turn pose. Suggested pose set: idle, walking contact/passing poses, front turn, happy/rest; do not independently crop frames. Agree frame cadence and route separately. Keep routes outside measured title/control rectangles with full-canvas clearance; do not flatten sprites to turn. For supported/clinging animals define the attachment landmark on both surface and pose before integration.

Future scene controller must preload/decode only active scene assets, separate movement/heading/frame transforms, pause while hidden, show a static reduced-motion pose, and destroy all loops/listeners/observers and stale async work on exit. Returning creates one instance. No claim of passing animal animation geometry is made without that art.

On import, retain originals, record SHA-256, dimensions and alpha format, inspect against light/dark backgrounds, and create separately named derivatives only if needed. Budget: aim below 600 KB per vocabulary PNG and 90 MB active compressed assets; review large decoded canvases separately. Never recompress supplied originals in place.
