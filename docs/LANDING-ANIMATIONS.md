# Supplied landing animation integration

Local, 5 October 2026. Original `Mammals_Club_Landing_Animations_48_Frames.zip` supplies four twelve-frame cycles. All originals, manifest, atlases and previews are retained in `docs/landing-animation-originals/Mammals_Club_Landing_Animations/`. `docs/landing-animation-assets.json` records their SHA-256 hashes, frame alpha bounds, timing and derivative hashes. No artwork generation was used for this integration.

`scripts/import-landing-animations.py` downsizes each aligned 480×480 frame to a 160×160 cell and creates four lossless WebP atlases (4×3 cells) totaling 658,354 bytes. Whole aligned canvases are preserved in the derivatives; frames are not individually cropped, avoiding anchor jumps. The generated `src/core/landing-assets.js` carries manifest timings.

## Active behavior

The acorn-carrying squirrel running across the foreground did not fit the setting and was removed following the user's review. Its original/delivery assets remain unused. Three cycles are scheduled in a repeating 56.5-second sequence:

- Wait 6 seconds, then squirrel looks/blinks for 4.5 seconds. Reveal/retreat takes 700 ms each behind a clipped left page edge. On wide views it peeks beside the left tree area; narrow views use the clear lower edge when the badge blocks that area.
- Wait 8 seconds, then hedgehog walks right across the lower edge over 20 seconds.
- Wait 8 seconds, then bat flies right across the upper clear band over 10 seconds.

One animal at a time. The supplied art faces right; routes exit fully before reappearing, so no unprovided turn pose or flattened sprite is invented. Continuous travel and atlas pose timing are separate. Decorations are aria-hidden, pointer-events:none, silent and noninteractive. The existing badge/Explore button remains unchanged.

The renderer uses viewport edge bands against the current background cover geometry, preserving scene source-to-view landmarks for future scenery. Badge and toolbar rectangles have 24-pixel protection. Actors shrink to available clear band height, down to 48-pixel canvases; visits are omitted if no safe band exists. Peek placement uses the same protection checks. Reduced motion omits ambient animals. Hidden documents cancel RAF and pause elapsed time without catch-up; returning resumes the same visit. Resize recomputes geometry. Leaving disconnects the ResizeObserver, visibility/media listeners, pending RAF and canvas. Async preload completions cannot revive a destroyed owner.

## Files and verification

Changed: `src/core/landing-scene.js`, `src/core/landing-assets.js`, `src/core/game-engine.js`, `src/topics/mammals.js`, `src/styles/rough-draft.css`; importer, asset/original/audit directories; `tests/landing.test.js`, `tests/landing-browser.js`, generated `tests/landing.html` and fixture generator; README/HANDOFF and asset manifest.

19/19 Node tests and content/build checks passed, including hashes for 48 original frames, four atlases and independent schedule/frame math. Existing production-engine browser regression: 21/21. Dedicated landing fixture: 5/5 at 1280×720, 1024×600, 768×1024 and 360×800. It verifies preloading, one owner, three visits, no squirrel run, continuous position updates, protected controls, hidden/resume, reduced motion and twelve Explore/Home round trips. Fixture timing uses a simulated RAF clock; visibility and reduced motion are simulated signals. Normal live movement was also visually inspected. Evidence: ignored `test-results/landing-*.png`, `landing-responsive.json`, `landing-browser.txt` and `landing-regression.txt`.

The illustrated poses retain minor frame-to-frame anatomy variation from the supplied pack. The peek uses a page-edge clip, not a newly generated tree foreground. Smaller short-screen animals preserve clear controls. Existing launch layout can scroll slightly; the fixed canvas adds no document flow. No real device or OS preference was tested. This is local only: no commit, push or deployment.
