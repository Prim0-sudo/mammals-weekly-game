# Homeward Trail — rabbit burrow Hangman assets

13 PNG assets generated with the built-in image generator. These are individual animation frames, not an implemented game or timed GIFs. Sprites have alpha transparency; the scene is opaque. Artwork is soft gouache natural-history illustration.

## Rules
- Start each word with nine wrong-guess chances. Render chance-token.png nine times, fading one per new incorrect letter.
- Each new correct letter guess triggers one rightward hop. Reveal all occurrences of that letter. Repeated guesses do not move the rabbit or consume chances.
- Size each hop to the word: divide start-to-burrow distance by the count of distinct guessable letters, so the rabbit reaches home exactly when the word is solved. Ignore spaces and punctuation.
- Start and finish every hop sitting. Correct guesses do not consume chances.
- On win, complete the final hop and play the burrow-entry sequence.
- On the ninth wrong guess, lock guessing, bring the left-facing fox in from the right, turn the rabbit left and loop its escape poses while moving it fully off the left edge. Then reveal the answer.

## Frame sequences and suggested initial timing
Hop: rabbit-sit-right -> hop-01-takeoff (90 ms) -> hop-02-airborne (110 ms) -> hop-03-landing (90 ms) -> rabbit-sit-right. Move x from the current position to its next stop with a small y arc. Use the same sitting image before and after.
Win: entry-01-crouch (160 ms) -> entry-02-rear-quarter (180 ms) -> entry-03-tail (180 ms) -> hidden. Move and diminish the rabbit toward the hole; occlude it at the burrow edge using a Canvas mask or a foreground crop of the background. The hole itself is painted only in woodland-background.png.
Loss: slide fox-appear-left into view from the right over about 300 ms; loop escape-01-push-off -> escape-02-flight -> escape-03-landing at approximately 80 ms per frame as the rabbit moves left offscreen. Clip the game viewport. The fox uses one appearance sprite and movement in code.

## Compositing
The frames were generated individually and have different canvas dimensions and margins. Use manifest.json alphaBounds to establish visible bounds and tune scale and anchors in the animation renderer. Do not switch full-canvas images at identical CSS dimensions and expect a perfectly registered loop. Match the rabbit torso size across poses and use a consistent ground baseline, adding explicit airborne offsets. The background is 16:9: use a proportional stage so the burrow stays aligned.
A starting layout can put the rabbit near 12% of stage width and ground near 71% of stage height, with the burrow near 88% of width. Adjust visually at the game's actual display size. Render the fox larger than the rabbit.

## Accessibility
Keep the nine-chance counter as actual UI, with text as well as faded tokens. Under reduced motion, use static sitting states and immediate position changes, retaining the win/loss outcome and answer display.

## Delivery scope
Artwork and implementation notes only. Animation registration, masking, timings and responsive behavior still require integration and playtesting in the game.
