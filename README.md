# Mammal Discovery Club

**Status — 4 October 2026: functional draft.** GitHub and Cloudflare Pages publication is authorised. Vocabulary artwork and teacher review remain outstanding.

Repository: https://github.com/Prim0-sudo/mammals-weekly-game

Production Pages address: https://mammals-weekly-game.pages.dev/ (deployment verification recorded in HANDOFF.md).

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

The eight fixed IDs remain `learn`, `sort`, `sound`, `identify`, `knowledge`, `spelling`, `flip`, `wheel`. Sound Detective is visibly locked. The seven other activities work with the available text content. Meet the Words includes sentences and **Read & talk together**, with 16 sentence/discussion cards and the three supplied assessment phrases. Draw-the-caption prompts are included in these cards. Translation remains teacher-led because no target language was supplied.

Sort It sorts field-guide word roles, not mutually exclusive land/water animal classes. Identification has three distinct choices and independent target/answer picture controls. Flip mismatches stay open until a different available tile is selected. Wheel holds its selected item before a silent text-only reveal and removes it on Next, in explicit batches of at most 12.

Short sort/identify/knowledge/spelling sessions reserve up to 12 entries from independent per-mode, per-category queues. Exit returns the current unanswered entry and all unplayed entries to the front without duplicates; completed entries stay completed. All Words does not reset those queues. Flip similarly restores unmatched words and completes its cycle before repeating; a final board may be smaller than the chosen size. Standard All Words boards are 10/20/30 words; eight-word categories offer eight. Learning and Wheel start a fresh selected-scope run on entry; no word is removed from an active Wheel run until Next. Everything resets on page reload.

**Field Notes spelling:** six wrong guesses per word, including long words. Correct letters reveal all occurrences, spaces stay visible, duplicate guesses do nothing. Wrong input locks for 240 ms; win locks for 300 ms; reduced motion settles immediately. A win scores once and completes the note. A loss reveals the word with a distinct pause/read state and Next. There is one active adapter; no Frog or Last Leaf code/assets were copied.

Mouse, touch, Tab/Enter, Escape, and number keys for choices are supported. M toggles mute and F toggles fullscreen; both are letter guesses in spelling. Speech depends on an available local English system voice. The text content works without speech. Native fullscreen was exercised in the in-app browser; other browser/device support may vary.

## Artwork and review

No approved vocabulary artwork was provided. **132 vocabulary images are pending; 16 reserved interface slots currently use CSS/text.** The animal-free generated woodland/coast background is installed and its original checksum is recorded in the asset manifest. The centred landing and menu contain CSS controls and icons. Missing-picture panels are explicit, Flip currently matches text, and Wheel currently uses text markers. These are functional fallbacks while the user supplies artwork separately. No static animals appear on the landing page; unused generated animal drafts are archived locally outside the published assets.

The existing fish comparison category remains in this draft. Its scope was questioned by the user and needs a content decision before final curriculum approval.

- [Current complete image request](docs/IMAGE-REQUEST.md): 132 word pictures plus 16 optional interface art slots and the installed background.

- [Vocabulary](docs/VOCABULARY.md), [content notes](docs/CONTENT.md), [objective mapping](docs/COVERAGE.md).
- [Word-by-word image checklist](docs/IMAGE-CHECKLIST.md), [separate UI/animation brief](docs/ART-DIRECTION.md), [asset manifest](docs/asset-manifest.json).
- [Verification and limitations](HANDOFF.md).

The supplied screenshot is preserved byte-for-byte at `docs/curriculum-outline.png`; its SHA-256 is recorded in the manifest. Import future art without changing originals, inspect it, record its checksum, and change that entry's `assetStatus` only when ready. Reserved missing paths are intentionally not requested by the runtime.

The implementation derives from the active Little Bug Club engine at local commit `063f04c`, which matched the visible GitHub latest commit during this session. The reference game's local source, README, handoff and content notes were reviewed; its live launch/menu were inspected. Those observations do not certify its deployed source hash or transfer its earlier test results to this game.
