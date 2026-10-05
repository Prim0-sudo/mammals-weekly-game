# Detective test artwork and activity

Created 5 October 2026 using the built-in imagegen tool. A single generated African elephant scene supplies the picture rounds; a generated transparent cutout of that scene supplies the silhouette. These are test assets, separate from all 132 pending vocabulary pictures.

- Scene: assets/topics/mammals/detective/elephant-scene.png
- Scene SHA-256: d2bec18f539d1c2bd2eeacf2f4a1d188e0f71adc828286b44dd62ac068cd24ef
- Cutout: assets/topics/mammals/detective/elephant-cutout.png
- Cutout SHA-256: ba6b255233dbd7d50e17216f9900cf95f0fe5a150e24fc80f07321b67f9faf9b

Silhouette stays covered until a correct guess or manual reveal. Pixel Reveal starts with six sampled columns and progressively increases resolution over the selected 30/45/60-second duration (45 seconds by default). Mosaic Reveal uses a shuffled 12 × 10 grid of 120 tiles, showing the entire image at the selected duration. Select a duration before starting either timer. The choice carries over between reveal modes during the same Detective visit. Duration choices hide once the round starts. Both timers start only when requested. Guessing, pause, and hiding the tab freeze active elapsed time. After hiding the tab, the user resumes manually. Next returns to the three reveal choices; the one-picture demo may be replayed.

Correct guesses award one star once. Manual reveals and timeout award no stars. Wrong choices are disabled, and remaining choices can be tried. Home, Games and Escape destroy the timer and invalidate pending image loads. Accessible labels describe a mystery picture until reveal.

Validation: 11 Node tests, including exact mosaic boundaries and time excluded during pause; build/content checks; 19 browser tests, including all three reveal options, wrong guesses, one-time scoring, pause/resume, stale image loads and exit cleanup.
