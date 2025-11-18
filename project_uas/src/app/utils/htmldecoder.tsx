export function decodeHtml(str: string) {
  if (typeof window === "undefined") return str;

  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");
  return doc.documentElement.textContent.toString();
}