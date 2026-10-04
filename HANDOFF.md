# Mammal Discovery Club handoff

## Latest visual update — 4 October 2026

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

