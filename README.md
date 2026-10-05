# Mammal Discovery Club

**Status — 5 October 2026: local artwork update.** All 132 supplied vocabulary images are installed. Local changes have not yet been published; teacher review of drafted content remains outstanding.

Repository: https://github.com/Prim0-sudo/mammals-weekly-game

Production Pages address: https://mammals-weekly-game.pages.dev/ (deployment verification recorded in HANDOFF.md). Cloudflare automatically deploys `main` using framework preset None, build command `npm run build`, output directory `dist`, and repository root `/`.

Start from this directory with `npm start`, then open [the local preview](http://127.0.0.1:4186/). The preview is currently running. No installation or account is required; Node.js serves the local files. `npm test`, `npm run check` and `npm run build` run the checks and create `dist` from current source. Use `node scripts/serve.mjs --dist` with a different `PORT` to inspect the build while the source preview runs.

## Collection

132 distinct playable entries in one collection, with stable IDs and no year-group tiers:

| Group | Words |
|---|---:|
| Meet the Mammals | 50 |
| Meet the Fish | 8 |
| Bodies Up Close | 24 |
| Places & Food | 22 |
| What Animals Do | 20 |
| Mothers & Young | 8 |
| **Total** | **132** |

Each entry includes a definition, sentence, useful intended alt text, reserved image path, provenance and review status. All are reachable through their category and All Words. The bank, runtime topic, counts, curriculum matrix and 132-entry image manifest reconcile. Category names do not add to the total. Knowledge has 16 questions with category paths and All 16 Questions; category question counts can overlap because one question may address several subjects.

## Activities

The nine active activity IDs are `learn`, `sort`, `detective`, `identify`, `knowledge`, `spelling`, `flip`, `wheel`, `create`. Detective now has a single-picture elephant demo: silhouette guessing, pixel and mosaic reveals with 30/45/60-second options (45 seconds by default), with 120 mosaic tiles. Start, pause, guess, reveal and Next controls work; hidden tabs pause the timer. Correct guesses award one star; manual and timed reveals do not. The seven other activities work with the available text content. Meet the Words includes vocabulary sentences. **Read, Draw & Talk** is a separate active menu tile with 16 illustrated sentence/discussion cards and the three supplied assessment phrases. Draw-the-caption prompts are included in these cards; drawing tools will be added later. Translation remains teacher-led because no target language was supplied.

Sort It sorts field-guide word roles, not mutually exclusive land/water animal classes. Identification has three distinct choices and independent target/answer picture controls. Flip mismatches stay open until a different available tile is selected. Wheel holds its selected item before a silent text-only reveal and removes it on Next, in explicit batches of at most 12.

Short sort/identify/knowledge/spelling sessions reserve up to 12 entries from independent per-mode, per-category queues. Exit returns the current unanswered entry and all unplayed entries to the front without duplicates; completed entries stay completed. All Words does not reset those queues. Flip similarly restores unmatched words and completes its cycle before repeating; a final board may be smaller than the chosen size. Standard All Words boards are 10/20/30 words; eight-word categories offer eight. Learning and Wheel start a fresh selected-scope run on entry; no word is removed from an active Wheel run until Next. Everything resets on page reload.

**Field Notes spelling:** six wrong guesses per word, including long words. Correct letters reveal all occurrences, spaces stay visible, duplicate guesses do nothing. Wrong input locks for 240 ms; win locks for 300 ms; reduced motion settles immediately. A win scores once and completes the note. A loss reveals the word with a distinct pause/read state and Next. There is one active adapter; no Frog or Last Leaf code/assets were copied.

Mouse, touch, Tab/Enter, Escape, and number keys for choices are supported. M toggles mute and F toggles fullscreen; both are letter guesses in spelling. Speech depends on an available local English system voice. The text content works without speech. Native fullscreen was exercised in the in-app browser; other browser/device support may vary.

## Interface

Navigation uses short labels without arrows. Menus show icons and titles; repeated instructions and decorative copy are removed. Vocabulary, reading passages, quiz questions and teaching feedback remain.

## Coming-soon activities

Story Book, Video, and Phonics & Sight Words are empty, disabled menu tiles. A theme-based book, curated videos, and phoneme/sight-word activities will be added later. Read, Draw & Talk replaces Create & Share and opens the existing reading cards; drawing tools are planned for later.

## Artwork and review

All **132 supplied vocabulary PNGs** are installed, unchanged from Mammal_Discovery_Club_132_Game_Assets.zip. Filenames, delivery checksums, 1024 × 1024 dimensions and RGBA transparency were verified. Six category cards reuse appropriate vocabulary pictures. Learning, sorting, identification, spelling, matching, wheel markers, reading cards and fully illustrated quiz-choice sets now use the supplied artwork. Detective keeps its original test scene and cutout. The animal-free generated woodland/coast background is installed and its original checksum is recorded in the asset manifest. The centred landing and menu contain CSS controls and icons. Flip includes pictures with word labels, and Wheel uses picture markers. Optional interface artwork retains its CSS fallback. No static animals appear on the landing page; unused generated animal drafts are archived locally outside the published assets.

The existing fish comparison category remains in this draft. Its scope was questioned by the user and needs a content decision before final curriculum approval.

- [Current complete image request](docs/IMAGE-REQUEST.md): 132 word pictures plus 16 optional interface art slots and the installed background.

- [Vocabulary](docs/VOCABULARY.md), [content notes](docs/CONTENT.md), [objective mapping](docs/COVERAGE.md).
- [Supplied artwork import record](docs/supplied-artwork.json), [delivery manifest](docs/supplied-artwork-manifest.json).
- [Word-by-word image checklist](docs/IMAGE-CHECKLIST.md), [separate UI/animation brief](docs/ART-DIRECTION.md), [asset manifest](docs/asset-manifest.json).
- [Verification and limitations](HANDOFF.md).

The supplied screenshot is preserved byte-for-byte at `docs/curriculum-outline.png`; its SHA-256 is recorded in the manifest. Import future art without changing originals, inspect it, record its checksum, and change that entry's `assetStatus` only when ready. Reserved missing paths are intentionally not requested by the runtime.

The implementation derives from the active Little Bug Club engine at local commit `063f04c`, which matched the visible GitHub latest commit during this session. The reference game's local source, README, handoff and content notes were reviewed; its live launch/menu were inspected. Those observations do not certify its deployed source hash or transfer its earlier test results to this game.


All 12 activity menu tiles use custom woodland illustrations generated with the built-in image creator. PNGs live in `assets/topics/mammals/menu/`; generation prompts and checksums are recorded in `docs/menu-artwork.json`. Detective game artwork is unchanged.
