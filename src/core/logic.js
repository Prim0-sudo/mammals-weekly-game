export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
export const normalise = (text, topic) =>
  text.normalize(topic.text.normalisation).toLocaleLowerCase(topic.locale);
export const letters = (text, topic) =>
  [...normalise(text, topic)].filter((c) => topic.text.alphabet.includes(c));
export const eligible = (topic, mode) =>
  topic.items.filter(
    (x) =>
      x.kind === "word" ||
      topic.categoryIntroductions.includeInModes.includes(mode),
  );
export const makeChoices = (item, pool) =>
  shuffle([item, ...shuffle(pool.filter((x) => x.id !== item.id)).slice(0, 2)]);
export const stars = (score, total) =>
  total && score / total >= 0.85 ? 3 : total && score / total >= 0.55 ? 2 : 1;
export const wheelTarget = (index, count, start = 0) =>
  start +
  1800 +
  ((360 - ((start + ((index + 0.5) * 360) / count) % 360)) % 360);
export const removeWheelItem = (items, id) => items.filter((x) => x.id !== id);
export function supportedCounts(topic) {
  const n = eligible(topic, "flip").length;
  return topic.sessions.supportedFlipWordCounts.filter((x) => x <= n).length
    ? topic.sessions.supportedFlipWordCounts.filter((x) => x <= n)
    : [n];
}
export function makeFlipDeck(items, count) {
  if (!Number.isInteger(count) || count < 1 || count > items.length)
    throw Error("Unsupported board size");
  return shuffle(
    shuffle(items)
      .slice(0, count)
      .flatMap((item) => [
        { id: item.id + "-a", item },
        { id: item.id + "-b", item },
      ]),
  );
}
export function takeSession(pool, count, queue) {
  const retained = queue?.filter((x) => pool.some((p) => p.id === x.id));
  const current = retained?.length ? retained : shuffle(pool);
  return { items: current.slice(0, count), remaining: current.slice(count) };
}
export function restoreSession(unplayed, remaining) {
  return [
    ...new Map(
      [...unplayed, ...remaining].map((item) => [item.id, item]),
    ).values(),
  ];
}
export function mistakeStage(misses, limit) {
  return misses === 0
    ? 0
    : misses >= limit
      ? 10
      : Math.max(1, Math.min(9, Math.round((misses * 9) / (limit - 1))));
}
