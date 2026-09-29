export const segmentPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function deriveSlug(id) {
  return id
    .split("/")
    .pop()
    .replace(/\.md$/, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function scriptJson(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

export function hasPlaceholder(text) {
  return /\[Add a sentence|Start writing here\.|Write your project notes here\.|\bLorem ipsum\b/i.test(
    text,
  );
}
