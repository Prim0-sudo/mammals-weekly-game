import { letters } from "./logic.js";
export const modeOrder = [
  "learn",
  "sort",
  "detective",
  "identify",
  "knowledge",
  "spelling",
  "flip",
  "wheel",
  "story",
  "video",
  "phonics",
  "create",
];
export function assetPaths(t) {
  return [
    ...new Set([
      t.launch.logoImage,
      t.launch.backgroundImage,
      t.launch.buttonImage,
      ...(t.launch.clubBadge ? [t.launch.clubBadge] : []),
      ...(t.launch.flyingBugs || []).flatMap(bug => [bug.sheet, bug.turnImage].filter(Boolean)),
      ...(t.launch.emblem
        ? [t.launch.emblem.baseImage, ...t.launch.emblem.wings.map((x) => x.image)]
        : []),
      ...(t.launch.scene?.assets || []),
      ...(t.detectiveDemo ? [t.detectiveDemo.scene, t.detectiveDemo.cutout] : []),
      ...t.items.map((x) => x.image),
      ...t.categories.map((x) => x.image),
      ...t.modes.map((x) => x.image),
      ...Object.values(t.modeSkins).flatMap((x) => x.assets),
    ]),
  ];
}
export function validateTopic(t) {
  const errors = [],
    check = (ok, text) => {
      if (!ok) errors.push(text);
    };
  const unique = (rows, label) =>
    check(
      new Set(rows.map((x) => x.id)).size === rows.length,
      "Duplicate " + label + " IDs",
    );
  for (const key of ["items", "categories", "knowledgeQuestions", "modes"])
    unique(t[key], key);
  check(
    t.modes.map((x) => x.id).join() === modeOrder.join(),
    "Incorrect menu-card order",
  );
  for (const id of ["story", "video", "phonics"]) {
    const mode = t.modes.find((x) => x.id === id);
    check(mode?.locked && mode.lockedReason, "Keep empty activity locked: " + id);
  }
  check(t.modes.find(x => x.id === "create")?.locked || t.curriculum.readingPractice.length > 0, "Read, Draw & Talk needs reading cards");
  check(t.items.length >= 3, "At least three words required");
  check(
    new Set(t.items.map((x) => x.name.toLowerCase())).size === t.items.length,
    "Duplicate names",
  );
  const ids = new Set(t.items.map((x) => x.id)),
    cats = new Set(t.categories.map((x) => x.id));
  for (const x of t.items) {
    check(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(x.id), "Invalid ID " + x.id);
    check(
      cats.has(x.categoryId) &&
        x.definition &&
        x.imageAlt &&
        x.image &&
        x.sentence,
      "Incomplete item " + x.id,
    );
    check(
      letters(x.name, t).length > 0 &&
        [...x.name].every(
          (c) =>
            t.text.alphabet.includes(c.toLowerCase()) ||
            t.text.ignoreCharacters.includes(c),
        ),
      "Unsupported spelling " + x.id,
    );
  }
  for (const c of t.categories)
    check(
      t.items.some((x) => x.categoryId === c.id) && c.image && c.imageAlt,
      "Empty category " + c.id,
    );
  check(t.knowledgeQuestions.length >= 7, "At least seven questions");
  for (const q of t.knowledgeQuestions) {
    unique(q.choices, "choice");
    check(
      q.choices.length === 3 &&
        q.choices.filter((x) => x.id === q.correctChoiceId).length === 1 &&
        q.prompt &&
        q.explanation,
      "Invalid question " + q.id,
    );
    check(!q.visualItemId || ids.has(q.visualItemId), "Unknown visual " + q.id);
  }
  const detective = t.modes.find((x) => x.id === "detective");
  // Detective needs both the full scene and a transparent silhouette source.
  check(
    !detective.locked && t.detectiveDemo?.scene && t.detectiveDemo?.cutout && t.detectiveDemo?.answer,
    "Detective test artwork is incomplete",
  );
  check(
    ["homeward-trail"].includes(t.modeSkins.spelling.id),
      "Unsupported spelling adapter",
    );
    if (t.modeSkins.spelling.attempts !== undefined)
      check(Number.isInteger(t.modeSkins.spelling.attempts) && t.modeSkins.spelling.attempts > 0 && t.modeSkins.spelling.attempts <= 26, "Invalid spelling attempt count");
  check(
    t.sessions.defaultRoundCount > 0 &&
      t.sessions.wheel.capacity > 0 &&
      t.sessions.wheel.allWords,
    "Invalid sessions",
  );
  check(
    t.sessions.supportedFlipWordCounts.every(
      (x) => Number.isInteger(x) && x > 0,
    ),
    "Invalid board sizes",
  );
  if (t.launch.emblem)
    check(
      t.launch.emblem.baseImage &&
        t.launch.emblem.imageAlt &&
        t.launch.emblem.wings.length === 4 &&
        t.launch.emblem.wings.every((wing) => wing.className && wing.image),
      "Invalid animated launch emblem",
    );
  const objectives = new Set(t.curriculum.objectives.map((x) => x.id));
  const prompts = new Set(
    [...t.knowledgeQuestions, ...t.curriculum.readingPractice].map((x) => x.id),
  );
  for (const o of objectives)
    check(
      t.curriculum.coverage.some((c) => c.objectiveId === o),
      "Unmapped objective " + o,
    );
  for (const c of t.curriculum.coverage)
    check(
      objectives.has(c.objectiveId) &&
        c.itemIds.every((x) => ids.has(x)) &&
        c.modeIds.every((x) => modeOrder.includes(x)) &&
        c.promptIds.every((x) => prompts.has(x)),
      "Invalid coverage " + c.objectiveId,
    );
  for (const r of t.curriculum.readingPractice)
    check(
      ids.has(r.itemId) && r.text && r.note,
      "Invalid reading prompt " + r.id,
    );
  for (const p of assetPaths(t))
    check(
      /^assets\/(?:[a-z0-9-]+\/)*[A-Za-z0-9-]+\.(svg|png|webp)$/.test(p),
      "Invalid local asset " + p,
    );
  if (errors.length) throw Error(errors.join("\n"));
  return true;
}
