import {writeFile} from 'node:fs/promises';
import {topic as t} from '../src/topics/mammals.js';

const lines = [
 '# Image handoff — Mammal Discovery Club',
 '',
 'Current draft inventory, 4 October 2026. This lists the existing bank; it does not add vocabulary. The vocabulary is being developed separately and is still pending teacher review. Preserve the IDs when supplying or revising content.',
 '',
 `**${t.items.length} vocabulary pictures across ${t.categories.length} categories.** Every vocabulary picture is currently awaiting approved artwork. The existing animal-free background is already installed. Interface graphics currently work in CSS; the 16 interface slots below are available if custom artwork is wanted. They are not additional vocabulary entries.`,
 '',
 '## Vocabulary pictures',
 '',
 'One 1024 × 1024 sRGB PNG per word, with consistent framing, generous margins and transparency where appropriate. Do not bake in labels. Use a recognisable, gentle style; show body parts and actions in useful animal context. Retain original canvas and bytes. The detailed picture brief is included below.',
 ''
 ];
for (const c of t.categories) {
 const words=t.items.filter(x=>x.categoryId===c.id);
 lines.push(`### ${c.label} — ${words.length}`, '',
 '| Word | Stable ID / filename | Picture brief |','|---|---|---|',
 ...words.map(x=>`| ${x.name} | ${x.id}.png | ${x.imageAlt} |`),'');
}
lines.push('Vocabulary destination: `assets/topics/mammals/vocabulary/<id>.png`.', '',
 '## Landing page — 2 artwork slots', '',
 '| Asset | Reserved file | Brief |', '|---|---|---|',
 '| Title / logo artwork | `assets/topics/mammals/logo.png` | Optional animal-free decorative badge around the live title. Transparent PNG, suggested 1200 × 1200. Keep title as live text for scaling and accessibility. |',
 '| Front-page button | `assets/topics/mammals/start-button.png` | Optional button surface for “Come and explore”. No baked-in label; live text stays on top. Transparent PNG, suggested 1200 × 400, clear central label area. Hover, focus and pressed states can remain CSS. |', '',
 'The woodland/coast background is already present at `assets/topics/mammals/generated/woodland-coast-empty.png` (1672 × 941). No static animals belong on the landing page. The live interface currently draws both badge and button in CSS.', '',
 '## Category artwork — 6 slots', '',
 'Separate transparent 1024 × 1024 PNGs; no labels baked in. Category illustrations introduce groups and do not count as vocabulary.', '',
 '| Category | File | Suggested composition |','|---|---|---|');
const categoryBriefs={mammals:'A land mammal and a marine mammal together.',fish:'Two clearly recognisable fish with fins.',bodies:'Small close-up study of fur, paw and whiskers.',places:'A small landscape with meadow, trees and water.',actions:'An animal visibly moving; use a clear pose rather than motion blur.',young:'A mother mammal with her young.'};
for(const c of t.categories)lines.push(`| ${c.label} | \`${c.image}\` | ${categoryBriefs[c.id]} |`);
lines.push('', '## Menu artwork — 8 slots', '',
 'Separate transparent 1024 × 1024 PNGs with matching scale and no embedded labels. The current CSS icons already fill these roles.', '',
 '| Card | Stable mode ID / file | Suggested picture |', '|---|---|---|');
const modeBriefs={learn:'Open picture book',sort:'Sorting basket',sound:'Ear / listening symbol; stays locked until approved audio and playback are available',identify:'Magnifying glass',knowledge:'Shield with a check mark',spelling:'Field notebook and pencil',flip:'Two matching cards',wheel:'Colourful spinner wheel'};
for(const m of t.modes)lines.push(`| ${m.label} | \`${m.image}\` | ${modeBriefs[m.id]} |`);
lines.push('', '## Other controls and future animation', '',
 'Home, Back, Next, replay, sound, fullscreen, score stars, progress, letter keys, Flip card backs, Wheel sectors/pointer and Field Notes mistake marks can stay in CSS. No separate raster files are needed for these controls.', '',
 'Future landing animals are separate animated assets, not static illustrations. Species and number are not selected yet, so no invented sprite count is included. Before creating them, agree the poses and routes: matching canvas dimensions, ground/contact anchors, side travel poses and front-facing turns, plus distinct idle/walk/swim frames where needed. Keep the title and controls clear. Supply effects and foreground elements on separate transparent layers. Do not flatten them into the background.', '',
 '## Reconciled totals', '',
 `${t.items.length} pending vocabulary pictures + 6 category slots + 8 menu slots + 1 logo slot + 1 front-page button slot = **148 pending/reserved image slots**. Add the **1 installed background** for **149 mapped image slots**. Of the 148 pending/reserved slots, 16 are interface art currently covered by CSS/text. Future animation assets are separate and not yet counted.`, '',
 'Preserve original files and SHA-256 checksums on import. Review artwork before setting its status to approved. The curriculum screenshot is reference material, not a playable image.', '');
await writeFile('docs/IMAGE-REQUEST.md',lines.join('\n'));
console.log(`Image request written: ${t.items.length} vocabulary pictures, 16 interface slots, 1 installed background.`);
