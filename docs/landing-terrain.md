# Landing terrain animation

Current scene coordinates are 1672 × 940, matching `woodland-clearing-rocks.png`. Routes, rock polygons, sizes and anchors live in `src/topics/mammals-landing.js`; timing and distance sampling live in `landing-motion.js`; `landing-scene.js` owns the canvas, shared cover transform and exact-background occlusion.

Encounters follow immediately: squirrel peek/retreat (6.4s), mouse dash (3s), bat (10s), squirrel run (6.5s), bat (9s). Total 34.9s. Alternate cycles change peek side, mouse direction and bat routes. The hedgehog is no longer active. Ground movement stays horizontal at source y=730; feet and contact shadows sit on the grass. Masks follow the rocks and the left rock's narrow base shadow, with no grass strip along the lane.

The mouse uses sixteen generated PNG cells, one stable body anchor and a time-based gait clock independent of its fast travel. Supplied squirrel and bat atlases and all original delivery files remain unchanged. Ground animals may pass behind the foreground badge; bats protect the badge and toolbar. Entirely cropped hiding places cause ground encounters to be omitted. Resize/fullscreen retain elapsed time; visibility and reduced-motion changes pause/omit motion; navigation cleans up the owner and listeners.

## Local inspection

On localhost or 127.0.0.1, `?landingDebug=1` shows route/mask guides, `&landingTime=6000` freezes the clock, and `&landingOverlay=0` hides guides. Deployed hostnames ignore these switches.

`npm test` covers consecutive encounters, straight travel, stationary squirrel contact, facing, cover geometry and preserved delivery hashes. `tests/landing.html` exercises a cycle, masked endpoints, contact mapping, simulated hidden/reduced-motion signals and twelve navigation returns. These fixture signals complement visual inspection and do not certify physical devices or native OS preferences.
