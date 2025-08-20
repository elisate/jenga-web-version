/**
 * Parse HTML content and extract text with formatting markers
 * 
 * Returns an array of objects like:
 * { text: string, isBold?: boolean, isHeader?: boolean }
 */
export function parseHtmlToText(
  html: string
): Array<{ text: string; isBold?: boolean; isHeader?: boolean }> {
  if (!html) return [];

  const sections: Array<{ text: string; isBold?: boolean; isHeader?: boolean }> = [];

  let content = html
    .replace(/<h[1-6][^>]*>/gi, "|||HEADER|||")
    .replace(/<\/h[1-6]>/gi, "|||/HEADER|||")
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<\/li>/gi, "")
    .replace(/<ol[^>]*>/gi, "\n")
    .replace(/<\/ol>/gi, "\n")
    .replace(/<ul[^>]*>/gi, "\n")
    .replace(/<\/ul>/gi, "\n")
    .replace(/<p[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');

  const parts = content.split("|||");

  for (let i = 0; i < parts.length; i++) {
    const part = parts[i].trim();
    if (!part) continue;

    if (part === "HEADER") {
      const headerText = parts[i + 1]?.replace(/<[^>]*>/g, "").trim();
      if (headerText) {
        sections.push({ text: headerText, isHeader: true, isBold: true });
      }
      i++; // skip content already processed
    } else if (part === "/HEADER") {
      continue;
    } else {
      const cleanText = part.replace(/<[^>]*>/g, "").trim();
      if (cleanText) {
        const lines = cleanText.split("\n").filter((line) => line.trim());
        lines.forEach((line) => {
          sections.push({ text: line.trim() });
        });
      }
    }
  }

  return sections;
}
