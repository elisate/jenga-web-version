import { PDFDocument, StandardFonts } from "pdf-lib";

/**
 * Load Montserrat font from Google Fonts or fallback to Helvetica
 */
export async function loadMontserratFont(pdfDoc: PDFDocument) {
  try {
    const montserratUrl =
      "https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-.woff2";

    try {
      const fontResponse = await fetch(montserratUrl);
      if (fontResponse.ok) {
        const fontBuffer = await fontResponse.arrayBuffer();
        return await pdfDoc.embedFont(new Uint8Array(fontBuffer));
      }
    } catch (error) {
      console.warn("Could not load Montserrat font, using fallback:", error);
    }

    // fallback
    return await pdfDoc.embedFont(StandardFonts.Helvetica);
  } catch (error) {
    console.error("Error loading font:", error);
    return await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
}
