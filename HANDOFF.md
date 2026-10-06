# Current release — mammals-only topic, 6 October 2026

The user confirmed that fish content was accidentally clipped from the next theme. The active game now contains 123 words in five categories (50/23/22/20/8), 13 knowledge questions and 15 Read, Draw & Talk cards. Eight fish species and gills, their nine runtime PNGs, three comparison questions, one reading card and the fish comparison objective were removed. Marine mammals remain. Every vocabulary activity uses the same reduced bank.

Current manifests, coverage, vocabulary/image handoff, art brief, README and master blueprint v4.2 reflect this scope. Scripts derive active counts from the topic. Original archive names and earlier records remain historical provenance.

Validation: 22/22 Node checks, 21/21 gameplay browser checks, content/checksum validation and build passed. The build contains 123 vocabulary PNGs, with the removed images absent. The normal preview shows the five current categories and All 123 words. Native devices and a new live deployment were not verified.

Publication: committed and pushed to main at the user's request. The existing Cloudflare automatic build is triggered by the push; no separate manual deployment was performed.

---
# Current release — 6 October 2026

This release updates the landing implementation and master blueprint v4.1. It supersedes the older landing descriptions below; those sections remain historical records.

- Rabbit intro/Home badge and a 1672 × 940 flat woodland clearing with clean rocks.
- Consecutive squirrel peek, three-second mouse dash, bat flight, squirrel run and second bat flight; no hedgehog or idle gaps.
- Straight ground lane, grounded foot registration/contact shadows, corrected left-rock base mask and raised right-side bat descent. Mouse body registration and gait timing are separate from its fast travel.
- Blueprint guidance now explores the art style best suited to each new theme, aims for variety across the collection and allows some games to share a style.
- New image prompts and checksums: docs/landing-generated-artwork.json and linked artwork notes. Active landing assets are included in content validation and the asset manifest.

Validation: 21/21 Node unit checks, content/checksum validation, build and Git whitespace check passed. The landing browser fixture passed 6/6 at 1280 × 800, covering a full encounter cycle, masked endpoints, cover mapping, simulated visibility/reduced-motion changes and twelve navigation returns. Ordinary preview placement and grounding were visually inspected during development. No new physical-device, native OS-motion or live-deployment certification is claimed.

Publication: this release is committed and pushed to main at the user's request. Cloudflare's existing automatic build is triggered by the push; its completion has not been verified. No separate manual deployment was requested or performed.

---

## Local artwork integration — 5 October 2026

All 132 vocabulary PNGs from Mammal_Discovery_Club_132_Game_Assets.zip are installed byte-for-byte with verified delivery checksums, 1024 × 1024 RGBA canvases and transparency. Category cards reuse suitable pictures, reading cards include illustrations, and quiz sets use pictures only when all three choices have matching artwork. Existing learning, sorting, identification, spelling, Flip and Wheel markers consume the same vocabulary assets. Detective code and artwork were not changed for this import. Source records: docs/supplied-artwork.json and docs/supplied-artwork-manifest.json. The larger Complete_132 archive in Downloads was not readable as a complete ZIP; the game-assets archive contains the full 132-picture delivery. Local verification: 11 Node tests, 20 browser tests, checksum/content checks and build passed. This update has not been published.

# Mammal Discovery Club handoff

## Publication request — 6 October 2026

User requested committing and pushing the current implementation for later refinement. Final Node checks: 19/19; content/build and whitespace checks passed. Remote main was fetched before committing. The push triggers the existing Cloudflare Pages workflow; a verified push does not certify deployment success. Earlier local-only statements below record the status before this request. Landing animation art remains open to later visual refinement; the squirrel cross-screen run is inactive.

## Latest local update — supplied landing animations, 5 October 2026

Integrated the supplied 48-frame pack. Active cycles are squirrel peek/retreat, hedgehog walk and bat flight; the squirrel cross-screen acorn run was removed after the user's visual review. The pack's original files and checksums are preserved. Four lossless delivery atlases total 658,354 bytes; three are active. Routes protect actual badge and toolbar rectangles, with smaller animals on short screens. One RAF owner separates continuous travel from pose timing, preloads active assets, suspends hidden-tab work, omits animals under reduced motion and cancels RAF/ResizeObserver/media/visibility handlers on exit.

Checks: 19/19 Node tests, 21/21 regression browser checks and 5/5 landing fixture checks. Landing fixture repeated at 1280×720, 1024×600, 768×1024 and 360×800; all pass. Cycle progression, reduced motion and hidden-document signals in this fixture are simulated. Normal live movement was also visually inspected. No physical-device or OS-motion preference test. Existing launch page may scroll slightly vertically; decorations add no document flow. Source/delivery details and visual limitations: [LANDING-ANIMATIONS.md](docs/LANDING-ANIMATIONS.md). No commit, push or deployment. Preview remains http://127.0.0.1:4186/.

## Current local update — Homeward Trail, 5 October 2026

Latest interface refinement: doubled the clue picture to 128 px (96 px on phones), moved nine chance tokens to the right of the centered scene, and removed the idle instruction and visible numerical counter. Remaining chances retain a screen-reader-only count; animation lock/outcome status remains available. Short screens show tokens as a compact 3×3 group. Rechecked 1280×720, 1024×600, 768×1024 and 360×800 with Hippopotamus; no horizontal/vertical overflow after projector spacing adjustment. Build passed. Evidence: `test-results/homeward-large-picture-*.png`.

Layout refinement: word picture now sits beside the answer boxes below the scene. Scene, answer row and keyboard share the page center line. Production-style fixture checks at 1280×720, 1024×600, 768×1024 and 360×800 with Hippopotamus showed no horizontal or vertical overflow. Build passed; preview refreshed. Evidence: `test-results/homeward-centered-*.png`. This refinement changes layout only.

Homeward Trail replaces the active spelling presentation using all 13 supplied scene assets. Nine unique misses cause loss; distinct correct letters cause one registered hop each. Wrong letters also make small hops, advancing up to the midpoint and hopping in place thereafter. Final win enters behind a foreground burrow mask before scoring; loss brings the fox from the right and sends the rabbit fully left before revealing the answer. Preload, visible input locks, reduced-motion settling, hidden-document pausing and cancellation on restart/next/exit are implemented. Existing 132-word collection, six category totals (50/8/24/22/20/8), other activities and navigation are preserved. Curriculum review remains outstanding.

**Local only: not committed, pushed or deployed.** Preview remains running at http://127.0.0.1:4186/. Existing production deployment is separate and predates this change. All original PNG bytes are retained and checked; lossless WebP delivery is about 4.7 MB.

Checks: 16/16 Node tests, 21/21 existing browser fixture checks and 8/8 dedicated scene fixture checks pass; content/asset check and build pass. Normal RAF hops, three entry poses, masked disappearance and fox/escape were visually inspected. Production-style layouts checked at 1280×720, 1024×600, 768×1024 and 360×800, including long/multi-word labels. No horizontal overflow; phone scrolls vertically. Browser keyboard H revealed both Hedgehog H letters with one hop. Inspected preview had no console warnings/errors or broken images. Reduced motion and document visibility were simulated in fixtures; no actual OS motion preference or physical device was tested.

See [HOMEWARD-TRAIL.md](docs/HOMEWARD-TRAIL.md) for changed files, timing/coordinates, precise checks and visual limitations; [asset audit](docs/homeward-trail-assets.json) for checksum and registration details. Evidence is in ignored `test-results/homeward-*` files. Earlier sections below are historical and do not describe the current spelling skin or supplied-art status.

## Latest visual update — 4 October 2026

### Publication verified — 4 October 2026, Asia/Bangkok

- Public GitHub repository created and initial commit `9cd4570c203f4c9e5325bc384d50f80db3042f99` pushed to `main`. GitHub's visible latest commit matched the local commit.
- Cloudflare Pages project `mammals-weekly-game` created in the user's existing account with the existing GitHub connection. Automatic production deployments are enabled for `main`; framework None, command `npm run build`, output `dist`, root `/`.
- Cloudflare reported successful production deployment `b8364495-0adb-4b44-8984-d0001a60759c` of that commit. Public URL: https://mammals-weekly-game.pages.dev/. Immutable first-deployment URL: https://b8364495.mammals-weekly-game.pages.dev/.
- Public landing background and launch-to-menu control visually inspected. All eight menu cards appeared with Sound Detective locked. Console inspection found no errors or warnings at that point.
- All 15 served production files matched the local build: HTML/JS/CSS comparisons normalised Git CRLF/LF conversion; the background matched byte-for-byte. Evidence: `test-results/deployment-verification.json`. Repeat with `node scripts/verify-deployment.mjs` after building.
- Current pre-publication checks: 8/8 Node logic checks, content/asset reconciliation and build passed; 16/16 production-engine browser fixture checks passed. Fixture-selected Wheel exhaustion and simulated reduced-motion/keyboard signals remain as described below.
- Unused generated animal drafts were archived under ignored `docs/generated-originals/`; the only published image asset is the animal-free background. Local preview continues running at http://127.0.0.1:4186/.

The documentation update recording these results is a later commit and triggers the same automatic Pages build; it does not change the verified game files.

Landing panel and complete eight-card menu now centre vertically below the toolbar. Tall phone menus scroll naturally. The animal-free woodland/coast background is installed; its URL resolves against the page, correcting the stylesheet-relative loading failure. Menu icons and front-page controls currently use CSS. No static animals are displayed on the landing page.

Use [IMAGE-REQUEST.md](docs/IMAGE-REQUEST.md) for the current complete art handoff: 132 vocabulary pictures, 16 reserved interface-art slots covered by CSS/text, and one installed background (149 mapped slots total). This supersedes the older all-149-missing count below. Vocabulary content remains the existing unapproved draft; the user is developing it separately. Regenerate the handoff with `node scripts/image-request.mjs` after approved vocabulary changes. The earlier verification results below predate this visual update.

**Current status, 4 October 2026:** user authorised creation of the GitHub repository and Cloudflare Pages deployment. Repository: https://github.com/Prim0-sudo/mammals-weekly-game. Production target: https://mammals-weekly-game.pages.dev/. Push and live deployment are verified separately. Local source is in `E:\Projects\Codex\mammals-weekly-game`; preview: http://127.0.0.1:4186/. Existing games are preserved.

## Content

132 = **50 + 8 + 24 + 22 + 20 + 8** across Mammals, Fish, Bodies, Places & Food, Actions, Young. One collection, no K1/K2/K3 assignments. 16 knowledge questions, 16 reading/talking cards, 132 per-word example sentences, six mapped objectives. Every entry has a reachable learning/category/All Words route. All vocabulary, artwork suitability, drafted language and safety phrasing need teacher review. The source's live-birth generalisation was corrected for egg-laying mammals; air-breathing alone is not treated as a sufficient mammal definition. See CONTENT.md for sources and specialist support.

132 pending vocabulary image paths + 16 reserved CSS/text interface slots + one installed animal-free background = **149 mappings**. Zero approved vocabulary illustrations supplied or active. Unused generated animal drafts remain archived locally and are excluded from Git and published assets. The original curriculum PNG is a reference, not an in-game animal asset. Its original and retained-copy SHA-256 matched: `f85a6a5e92b6bf307852e3df054463e165d5bd66508219499f42682e2ecbe190`. Optional scene, results and question art is separate from those totals. The fish comparison category remains unchanged pending the user's content decision.

## Actual checks performed

- `npm test`: **8/8 pass**. Content uniqueness/completeness, exact group counts, full vocabulary eligibility/objective mapping, non-repeating short cycles and restoration, Flip pair construction including 8/10/20/30 words, Wheel 1/8/12/13/132 boundaries and pointer math, spelling character handling, supplied reading phrases.
- `npm run check`: pass. Valid topic contract, bank equality, all 132 objective references, exact counts; generated vocabulary, coverage, image checklist and manifest agree. This validates missing-art metadata, not image decoding or scientific accuracy of future images.
- `npm run build`: pass. Current source and assets copied to `dist`; tests, curriculum reference image, screenshots, docs and logs are excluded.
- `/tests/browser.html`: **16/16 pass** using production styles, production GameEngine and the active Field Notes adapter. Coverage: all 132 teaching routes; all category/All paths; all reading cards; full sort/identify/knowledge completion and results; retry/score-once/explanation; queue interruption; independent picture toggles; normal spelling locks and distinct endings; reduced-motion spelling; exit during a lock; Flip 10/20/30, eight-word completion, teacher-paced mismatches and restoration; a real-duration Wheel spin and silent reveal; all 132 Wheel removals; M/F letter handling, Escape, mute and 12 repeated Home transitions; different six-item/two-category synthetic pack with changed title/assets and four-try configuration. The synthetic test exercises the same supported skin, not a second implementation.
- Wheel full-pool exhaustion deliberately uses **fixture-selected items**, not 132 real-duration spins. Reduced motion is a **fixture override of the engine predicate**, not a verified OS setting change. Keyboard events in that suite are simulated; production buttons were also clicked through browser automation.
- Flip layout fixture, all 10/20/30 boards, at **1280×720, 1024×600, 1366×900, 768×1024, 360×800**. No horizontal overflow in these measurements. Short-projector board bottoms: approximately 617 px at 1280×720, 497 px at 1024×600. Large phone boards intentionally scroll vertically (about 1128/1568 px before the final phone Home/button-size refinements). Text and dimensions were inspected; vocabulary picture sizing still needs rechecking after art import.
- Layout fixture for launch/menu/learn/sort/identify/knowledge/spelling/Wheel at **1024×600, 768×1024, 360×800**. A reading-fixture routing error was found and fixed separately from production. Rechecked reading at 1024×600. Fixed short-projector overflow in launch/sort/spelling, an inherited menu decoration that obscured titles, and the hidden mobile Home label. Rechecked the affected 1024×600 pages: no horizontal or vertical overflow. Phone menu and larger activities may scroll vertically.
- Visual inspection: settled 60-tile short-projector board with long and multi-word labels; desktop menu; long-word spelling on projector and phone; production mobile menu/Home; production Wheel during normal rotation and its settled text-only reveal. Flip was observed during its normal transform and after settling. Field Notes has short input locks and static outcome panels; there is no animal animation to certify.
- Production launch/menu/Wheel navigation and fullscreen state transition checked in the in-app browser. Production console inspection returned no warnings/errors at inspection time. Missing asset paths are not fetched, so zero failed runtime images does **not** mean artwork is complete.
- Repository reference: authenticated browser displayed GitHub latest `063f04c26522e1066e2127d256fceea012a9145c`, matching the local Little Bug Club HEAD. Its live launch and fixed menu were inspected. No pull or remote mutation performed; deployment commit identity was not independently verified.

Evidence is in `test-results/browser.txt`, `test-results/flip-layouts.json`, and menu screenshots. Fixtures are in `tests/` and use both production stylesheets. Run `node scripts/fixtures.mjs` after changing entry HTML. Preview logs are local only.

## Remaining limits and next work

- Supply and review the art described in IMAGE-CHECKLIST.md and ART-DIRECTION.md. The draft's text placeholders and text Flip/Wheel markers do not meet the final illustrated-learning acceptance requirement. No artwork accuracy, alpha, decoding or animal-motion clearance can be certified yet.
- Teacher approval of the expanded vocabulary, curriculum mapping, age fit and preferred terms is outstanding. Translation language was not supplied; translation practice stays teacher-led.
- No approved sound collection or sound-quiz adapter; Sound Detective stays locked.
- No real device testing, formal accessibility audit, actual offline-network test, real OS reduced-motion change or real background-tab lifecycle test was performed. CSS reduces motion and pauses decorative animation while hidden; navigation cancels scoped callbacks/effects. There is no idle scenery loop or sprite controller.
- Fairness queues persist only within the current page session; reloading starts fresh. All Words does not reset short-session queues; learning/Wheel begin fresh scope runs as documented in README.
- Importing art will require fresh layout checks, especially Flip image sizes, long labels, category cards, full phone pages and final Next controls. Do not reuse these text-only layout checks as proof of future artwork fit.

Keep the new game local until the user requests a specific external action. A later push and a verified deployment must be recorded as separate results.

