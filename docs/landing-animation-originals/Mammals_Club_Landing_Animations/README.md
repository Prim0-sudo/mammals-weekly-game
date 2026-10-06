# Mammals Club landing-page animation pack

48 illustrated frames in four 12-frame cycles:
- squirrel-idle: head turn and blink; reveal/retreat the sprite from behind a separate page-edge/tree mask.
- squirrel-acorn-run: bounding to the right with an acorn.
- hedgehog-walk: slow rightward walk.
- bat-flight: right-oriented wingbeat.

Artwork generated with the built-in image generator in the soft gouache style. Sheets were mechanically separated into transparent PNG frames and aligned on 480 x 480 canvases. Originals, aligned atlases, manifest timing, GIF previews and lossless animated WebP previews are included. GIF previews use cream backgrounds; production PNGs and WebP loops preserve alpha transparency.

Open preview.html locally to see the four loops and continuous traversal examples. Use PNG sequences or aligned atlases in the game when exact timing control is needed; use animated WebP for a simpler prototype.

## Landing-page behavior
Keep each animal small and around the edges, away from menus. Show one traversing animal at a time. Squirrel may peek after 3-5 seconds, look around for a short time and retreat; occasional acorn runs can replace the idle appearance. Hedgehog can traverse the bottom over 15-25 seconds. Bat can cross the upper background over 8-12 seconds. These are starting timings, not gameplay requirements.

Keep travel separate from pose playback: use requestAnimationFrame or compositor-friendly CSS transforms for continuous motion at the display refresh rate. Advancing position only when changing sprite frames will look jerky. Pause work when the page is hidden. For prefers-reduced-motion show a static animal or omit ambient movement. Decorations should not intercept menu pointer events. If animal-name/pronunciation interactions are added, provide an accessible button and speak only on activation, never automatically.

These are 12 drawn poses per cycle, not 60 distinct poses per second. Art has minor frame-to-frame variation, so final on-page scale, gait speed and loop joins still need visual tuning. Cross-fading whole poses is not recommended: it ghosts feet and wings. The manifest gives suggested initial frame durations.
