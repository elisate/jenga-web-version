import { PDFDocument } from "pdf-lib";
// Helper function to fetch and embed images
// Reusable image embedding function
export async function fetchAndEmbedImage(pdfDoc: PDFDocument, imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const imageBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(imageBuffer);

    try {
      return await pdfDoc.embedJpg(uint8Array);
    } catch {
      return await pdfDoc.embedPng(uint8Array);
    }
  } catch (error) {
    console.error("Error embedding image:", error);
    return null;
  }
}
