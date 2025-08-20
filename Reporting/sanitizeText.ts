// utils/textUtils.ts

/**
 * Sanitize text for safe use in PDFs, HTML, or other outputs.
 * - Converts undefined/null to empty string
 * - Replaces tabs/newlines with spaces
 * - Removes control characters
 */
export function sanitizeText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/[\t\n\r]/g, " ")           // Replace tabs/newlines with space
    .replace(/[\u0000-\u001F\u007F]/g, ""); // Remove control characters
}
