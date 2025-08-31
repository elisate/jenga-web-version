import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseClient } from "@/lib/supabase/client";
import type { ReportData } from "@/Reporting/report";
import { fetchAndEmbedImage } from "@/Reporting/imageHelper";
import { loadMontserratFont } from "@/Reporting/loadMontserratFont";
import { parseHtmlToText } from "@/Reporting/parseHtmlToText";
import { sanitizeText } from "@/Reporting/sanitizeText";

export async function GET(req: Request, { params }: { params: any }) {
  // Await params before using
  const resolvedParams = await params;
  const id = resolvedParams.id?.trim();

  if (!id) {
    return NextResponse.json({ error: "Missing report ID" }, { status: 400 });
  }

  // Fetch report from Supabase
  const { data, error } = await supabaseClient
    .from("reports")
    .select("report_data")
    .eq("id", id)
    .maybeSingle();

  if (error)
    return NextResponse.json(
      { error: "Failed to fetch report" },
      { status: 500 }
    );
  if (!data)
    return NextResponse.json({ error: "Report not found" }, { status: 404 });

  const report = data.report_data as ReportData;

  try {
    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const font = await loadMontserratFont(pdfDoc);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const normalFont = await pdfDoc.embedFont(StandardFonts.Helvetica);


    let currentPage = pdfDoc.addPage();
    let { width, height } = currentPage.getSize();
    let y = height - 100;

    // Layout constants
    const pageMargin = 60;
    const contentWidth = width - 2 * pageMargin;
    const lineHeight = 20;
    const sectionSpacing = 30;
    const headerHeight = 85;
    const footerHeight = 90;
    const contentAreaHeight = height - headerHeight - footerHeight;

    // Load and embed the logo
    let logoImage = null;
    try {
      const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/assets/logo_header.png`;
      logoImage = await fetchAndEmbedImage(pdfDoc, logoUrl);
    } catch (error) {
      console.log("Could not load logo image:", error);
    }

    // Header function
    const addHeader = (page: any, pageNumber: number) => {
      // Company header background
      page.drawRectangle({
        x: 0,
        y: height - headerHeight,
        width: width,
        height: headerHeight,
        color: rgb(0.95, 0.95, 0.98),
      });

      if (logoImage) {
        const logoWidth = 80;
        const logoHeight = 40;
        page.drawImage(logoImage, {
          x: width - pageMargin - logoWidth,
          y: height - 50,
          width: logoWidth,
          height: logoHeight,
        });
      }

      page.drawText("TOWER PROPERTY CONSULTANCY LTD", {
        x: pageMargin,
        y: height - 25,
        size: 16,
        font: boldFont,
        color: rgb(0.1, 0.2, 0.6),
      });

      page.drawText("VALUATION REPORT", {
        x: pageMargin,
        y: height - 42,
        size: 12,
        font: boldFont,
        color: rgb(0.1, 0.2, 0.6),
      });

      // page.drawText("RESIDENTIAL PROPERTY", {
      //   x: pageMargin,
      //   y: height - 57,
      //   size: 10,
      //   font: font,
      //   color: rgb(0.1, 0.2, 0.6),
      // });

      if (pageNumber > 1) {
        const text = `Report ID: ${id}`;
        const textWidth = font.widthOfTextAtSize(text, 9); // measure text width

        page.drawText(text, {
          x: width - textWidth - 20, // keep 20px margin from right
          y: height - 65,
          size: 9,
          font: font,
          color: rgb(0.5, 0.5, 0.5),
        });
      }


      // Header separator line
      page.drawLine({
        start: { x: pageMargin, y: height - headerHeight },
        end: { x: width - pageMargin, y: height - headerHeight },
        thickness: 2,
        color: rgb(0.1, 0.2, 0.6),
      });
    };

    // Footer function
    const addFooter = (page: any, pageNumber: number) => {
      const footerY = footerHeight;

      // Footer separator line
      page.drawLine({
        start: { x: pageMargin, y: footerY + 45 },
        end: { x: width - pageMargin, y: footerY + 45 },
        thickness: 1,
        color: rgb(0.1, 0.2, 0.6),
      });

      page.drawText(
        "Tel No: 0783520172, 0788474844; Email: towerpropertyconsultancy@gmail.com",
        {
          x: pageMargin,
          y: footerY + 25,
          size: 8,
          font: font,
          color: rgb(0.1, 0.4, 0.8),
        }
      );

      page.drawText(
        "Address: Office No 03, 2nd Floor-GOLDEN PLAZA KG 11 AVE Behind BPR-Kimironko Branch, Kimironko, Kigali-Rwanda",
        {
          x: pageMargin,
          y: footerY + 12,
          size: 8,
          font: font,
          color: rgb(0.1, 0.4, 0.8),
        }
      );

      page.drawText(
        "Services: Property valuation, Property Management, Property brokerage, Property investment consultancy.",
        {
          x: pageMargin,
          y: footerY - 1,
          size: 8,
          font: font,
          color: rgb(0.1, 0.4, 0.8),
        }
      );

      page.drawText(`Page ${pageNumber}`, {
        x: width / 2 - 20,
        y: footerY - 20,
        size: 9,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });

      page.drawText(new Date().toLocaleDateString(), {
        x: width - 100,
        y: footerY - 20,
        size: 9,
        font: font,
        color: rgb(0.5, 0.5, 0.5),
      });
    };

    // Enhanced page check function that avoids header/footer overlap
    const checkAndAddNewPage = (requiredSpace = 80) => {
      if (y < footerHeight + requiredSpace + 40) {
        addFooter(currentPage, pdfDoc.getPageCount());
        currentPage = pdfDoc.addPage();
        ({ width, height } = currentPage.getSize());
        addHeader(currentPage, pdfDoc.getPageCount());
        y = height - headerHeight - 40;
        return true;
      }
      return false;
    };

    // Safe image display function with proper spacing
    const displayImagesInGrid = async (
      imageUrls: string[],
      title: string,
      imagesPerRow = 2
    ) => {
      if (!imageUrls || imageUrls.length === 0) return;

      const imageWidth = 180;
      const imageHeight = 135;
      const spacing = 20;
      const rowSpacing = 45;

      // Add title
      checkAndAddNewPage(50);
      currentPage.drawText(title, {
        x: pageMargin + 20,
        y: y,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0.6),
      });
      y -= 30;

      for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];

        if (!imageUrl || typeof imageUrl !== "string") {
          console.log(`Skipping invalid image URL at index ${i}:`, imageUrl);
          continue;
        }

        const currentRow = Math.floor(i / imagesPerRow);
        const currentCol = i % imagesPerRow;
        const isNewRow = currentCol === 0;

        // Check if we need space for a new row
        if (isNewRow) {
          checkAndAddNewPage(imageHeight + rowSpacing);
        }

        try {
          // ✅ works now because function is async
          const embeddedImage = await fetchAndEmbedImage(pdfDoc, imageUrl);

          if (embeddedImage) {
            const totalRowWidth =
              imageWidth * imagesPerRow + spacing * (imagesPerRow - 1);
            const startX = pageMargin + 20 + (contentWidth - totalRowWidth) / 2;
            const imageX = startX + currentCol * (imageWidth + spacing);

            // Calculate Y position for this image
            const imageY = y - (isNewRow ? 0 : imageHeight + 20);

            // Ensure we're not in the footer area
            if (imageY - imageHeight < footerHeight + 20) {
              addFooter(currentPage, pdfDoc.getPageCount());
              currentPage = pdfDoc.addPage();
              ({ width, height } = currentPage.getSize());
              addHeader(currentPage, pdfDoc.getPageCount());
              y = height - headerHeight - 40;

              const newImageY = y;

              // Add border
              currentPage.drawRectangle({
                x: imageX - 3,
                y: newImageY - imageHeight - 3,
                width: imageWidth + 6,
                height: imageHeight + 6,
                color: rgb(0.95, 0.97, 1),
                borderColor: rgb(0.1, 0.2, 0.6),
                borderWidth: 1,
              });

              currentPage.drawImage(embeddedImage, {
                x: imageX,
                y: newImageY - imageHeight,
                width: imageWidth,
                height: imageHeight,
              });

              y = newImageY - imageHeight - 20;
            } else {
              // Add border
              currentPage.drawRectangle({
                x: imageX - 3,
                y: imageY - imageHeight - 3,
                width: imageWidth + 6,
                height: imageHeight + 6,
                color: rgb(0.95, 0.97, 1),
                borderColor: rgb(0.1, 0.2, 0.6),
                borderWidth: 1,
              });

              currentPage.drawImage(embeddedImage, {
                x: imageX,
                y: imageY - imageHeight,
                width: imageWidth,
                height: imageHeight,
              });

              // Update y position after completing a row
              if (currentCol === imagesPerRow - 1 || i === imageUrls.length - 1) {
                y = imageY - imageHeight - 30;
              }
            }
          }
        } catch (error) {
          console.error(`Error processing image ${i + 1}:`, error);
        }
      }
    };

    // Title writing function
    const writeTitle = (title: string, size = 16) => {
      checkAndAddNewPage(80);
      currentPage.drawText(title, {
        x: pageMargin,
        y: y,
        size: size,
        font: boldFont,
        color: rgb(0, 0, 0.7),
      });
      y -= sectionSpacing;
    };

    // Subtitle writing function
   const writeSubTitle = (
  subtitle: string, 
  size = 11,  // default size set to 10
  bold = false
) => {
  checkAndAddNewPage(60);
  currentPage.drawText(subtitle, {
    x: pageMargin,
    y: y,
    size: size,
    font: bold ? boldFont : normalFont, // use boldFont if bold=true
    color: rgb(0, 0, 0),
  });
  y -= sectionSpacing / 2;
};


    // Text writing function with word wrapping
    const writeText = (
      label: string,
      value: string,
      indent = 0,
      isBold = false
    ) => {
      if (!value || value === "N/A") return;

      checkAndAddNewPage(25);

      const text = `${label}: ${value}`;
      const maxWidth = contentWidth - indent;
      const fontSize = 12;
      const textFont = isBold ? boldFont : font;

      // Calculate text width and wrap if necessary
      const words = text.split(" ");
      let lines: string[] = [];
      let currentLine = "";

      for (const word of words) {
        const testLine = currentLine + word + " ";
        const safeTestLine = sanitizeText(testLine);

        let textWidth: number;
        try {
          textWidth = textFont.widthOfTextAtSize(safeTestLine, fontSize);
        } catch (err) {
          console.error("PDF encoding failed for line:", safeTestLine, err);
          textWidth = 0;
        }

        if (textWidth > maxWidth && currentLine !== "") {
          lines.push(sanitizeText(currentLine.trim()));
          currentLine = word + " ";
        } else {
          currentLine = testLine;
        }
      }

      if (currentLine.trim()) {
        lines.push(sanitizeText(currentLine.trim()));
      }

      // Draw each line
      for (const line of lines) {
        checkAndAddNewPage(25);
        currentPage.drawText(line, {
          x: pageMargin + indent,
          y: y,
          size: fontSize,
          font: textFont,
        });
        y -= lineHeight;
      }
    };

    // Enhanced function to write HTML content without bullet points
    // Enhanced function to write HTML content without bullet points
    const writeHtmlContent = (
      label: string,
      htmlContent: string,
      indent = 0
    ) => {
      if (!htmlContent) return;

      const sections = parseHtmlToText(htmlContent);
      if (sections.length === 0) return;

      if (label) {
        checkAndAddNewPage(25);

        // Remove colon if label ends with a number, roman numeral, or letter
        const cleanedLabel = label.replace(/(\d+|[ivx]+|[a-z])$/i, "$1");

        currentPage.drawText(cleanedLabel, {
          x: pageMargin + indent,
          y: y,
          size: 12,
          font: boldFont,
        });
        y -= lineHeight + 5;
      }

      for (const section of sections) {
        let text = section.text;

        // Remove leading colon if present
        text = text.replace(/^:\s*/, "");

        // Remove colon that appears before numbering/letters/roman numerals - FIXED LINE
        text = text.replace(/^:\s*(\d+|[ivx]+|[a-z])\.\s/i, "$1. ");

        if (section.isHeader) {
          checkAndAddNewPage(40);
          currentPage.drawText(text, {
            x: pageMargin + indent + 20,
            y: y,
            size: 14,
            font: boldFont,
            color: rgb(0.2, 0.2, 0.7),
          });
          y -= lineHeight + 5;
        } else if (text.match(/^\d+\.\s/)) {
          // Handle numbered items (1., 2., etc.)
          const numberedText = text.replace(/^(\d+)\.\s*/, "$1. ");
          writeText("", numberedText, indent + 20);
        } else if (text.startsWith("• ")) {
          // Handle bullet points
          const listText = text.substring(2);
          writeText("", listText, indent + 20);
        } else if (text.match(/^[ivx]+\.\s/i)) {
          // Handle roman numerals (i., ii., iii., etc.)
          const romanText = text.replace(/^([ivx]+)\.\s*/i, "$1. ");
          writeText("", romanText, indent + 20);
        } else if (text.match(/^[a-z]\.\s/i)) {
          // Handle letter items (a., b., c., etc.)
          const letterText = text.replace(/^([a-z])\.\s*/i, "$1. ");
          writeText("", letterText, indent + 20);
        } else {
          // Handle regular paragraphs
          writeText("", text, indent + 20);
        }
      }

      y -= 10;
    };

    // Function to handle arrays without bullet points
    // Function to handle arrays without bullet points, inline with label
    const writeArray = (
      label: string,
      values: string[] | string | undefined,
      indent = 0
    ) => {
      if (!values) return;

      let arrayValues: string[] = [];

      if (typeof values === "string") {
        try {
          const parsed = JSON.parse(values);
          if (Array.isArray(parsed)) {
            arrayValues = parsed;
          } else {
            arrayValues = [values];
          }
        } catch {
          arrayValues = [values];
        }
      } else if (Array.isArray(values)) {
        arrayValues = values;
      } else {
        return;
      }

      if (arrayValues.length === 0) return;

      checkAndAddNewPage(25);

      // Combine label and array values into one line
      const textLine = `${label}: ${arrayValues.join(", ")}`;

      currentPage.drawText(textLine, {
        x: pageMargin + indent,
        y: y,
        size: 12,
        font: font, // no bold
      });

      y -= lineHeight + 5; // move cursor down with extra space after line
    };


    // Valuation table function
    const drawValuationTable = () => {
      if (!report.valuationTable) return;

      checkAndAddNewPage(200);
      writeTitle("12. COMPUTATION TABLE");

      const tableStartX = pageMargin;
      const colWidths = [90, 30, 30, 45, 45, 60, 40, 60];
      const rowHeight = 25;
      const cellPadding = 2;

      const drawTableRow = (
        data: (string | number)[],
        yPos: number,
        isHeader = false
      ) => {
        let currentX = tableStartX;

        for (let i = 0; i < data.length && i < colWidths.length; i++) {
          currentPage.drawRectangle({
            x: currentX,
            y: yPos - rowHeight,
            width: colWidths[i],
            height: rowHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            color: isHeader ? rgb(0.9, 0.9, 0.9) : undefined,
          });

          const cellText = String(data[i] || "");
          const textSize = isHeader ? 10 : 9;
          const textFont = isHeader ? boldFont : font;

          const maxCellWidth = colWidths[i] - 2 * cellPadding;
          let displayText = cellText;

          if (textFont.widthOfTextAtSize(cellText, textSize) > maxCellWidth) {
            while (
              textFont.widthOfTextAtSize(displayText + "...", textSize) >
              maxCellWidth &&
              displayText.length > 0
            ) {
              displayText = displayText.slice(0, -1);
            }
            displayText += "...";
          }

          currentPage.drawText(displayText, {
            x: currentX + cellPadding,
            y: yPos - rowHeight + 8,
            size: textSize,
            font: textFont,
            color: rgb(0, 0, 0),
          });

          currentX += colWidths[i];
        }

        return yPos - rowHeight;
      };

      let tableY = y;

      const mainHeaders = [
        "Description",
        "Unit",
        "Note",
        "Quantity",
        "Rate",
        "Amount",
        "Depr%",
        "Net Value",
      ];
      tableY = drawTableRow(mainHeaders, tableY, true);

      if (report.valuationTable.main) {
        for (const row of report.valuationTable.main) {
          if (tableY < footerHeight + 60) {
            addFooter(currentPage, pdfDoc.getPageCount());
            currentPage = pdfDoc.addPage();
            ({ width, height } = currentPage.getSize());
            addHeader(currentPage, pdfDoc.getPageCount());
            y = height - headerHeight - 20;
            tableY = y;
            tableY = drawTableRow(mainHeaders, tableY, true);
          }
          tableY = drawTableRow(row, tableY);
        }
      }

      if (report.valuationTable.land) {
        tableY -= 15;
        if (tableY < footerHeight + 60) {
          addFooter(currentPage, pdfDoc.getPageCount());
          currentPage = pdfDoc.addPage();
          ({ width, height } = currentPage.getSize());
          addHeader(currentPage, pdfDoc.getPageCount());
          y = height - headerHeight - 20;
          tableY = y;
        }
        tableY = drawTableRow(report.valuationTable.land, tableY);
      }

      if (report.valuationTable.summary) {
        tableY -= 30;
        if (tableY < footerHeight + 100) {
          addFooter(currentPage, pdfDoc.getPageCount());
          currentPage = pdfDoc.addPage();
          ({ width, height } = currentPage.getSize());
          addHeader(currentPage, pdfDoc.getPageCount());
          y = height - headerHeight - 20;
          tableY = y;
        }

        currentPage.drawText("VALUATION SUMMARY", {
          x: pageMargin,
          y: tableY + 10,
          size: 13,
          font: boldFont,
          color: rgb(0, 0, 0.7),
        });

        tableY -= 15;
        for (const row of report.valuationTable.summary) {
          if (tableY < footerHeight + 60) {
            addFooter(currentPage, pdfDoc.getPageCount());
            currentPage = pdfDoc.addPage();
            ({ width, height } = currentPage.getSize());
            addHeader(currentPage, pdfDoc.getPageCount());
            y = height - headerHeight - 20;
            tableY = y;
          }
          tableY = drawTableRow(row, tableY);
        }
      }

      y = tableY - 30;
    };

    // ENHANCED COVER PAGE CREATION
    let pageNumber = 1;
    addHeader(currentPage, pageNumber);
    y = height - headerHeight - 20;

    // Property title section on cover
    const propertyTitle = `VALUATION REPORT OF A RESIDENTIAL PROPERTY`;
    const propertyUPI =
      report.property?.propertyUPI || report.property?.upi || "N/A";
    const location = `${report.property?.village || ""} Village, ${report.property?.cell || ""
      } Cell, ${report.property?.sector || ""
      } Sector, ${report.property?.district || ""} District, ${report.property?.province || ""
      } Province`.replace(/^, |, $/g, "");

    currentPage.drawText(propertyTitle, {
      x: pageMargin,
      y: y,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    });
    y -= 25;

    currentPage.drawText(`PROPERTY UPI: ${propertyUPI}`, {
      x: pageMargin,
      y: y,
      size: 14,
      font: boldFont,
      color: rgb(0.6, 0, 0),
    });
    y -= 20;

    currentPage.drawText(`LOCATED: ${location}`, {
      x: pageMargin,
      y: y,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2),
      maxWidth: width - 2 * pageMargin, // ensures text does not overflow PDF padding
    });
    y -= 40;


    // Collect building images only (limit to 3)

    //-----------------------------------------------
    // Collect building images only (limit to 3) 
    // Collect building images only (limit to 3) 
    // Collect building images only (limit to 3) 
    const buildingImages: string[] = [];
    if (report.building?.pictures) {
      let buildingImageUrls: string[] = [];
      if (typeof report.building.pictures === "string") {
        try {
          buildingImageUrls = JSON.parse(report.building.pictures);
        } catch (e) {
          console.error("Failed to parse building pictures:", e);
        }
      } else if (Array.isArray(report.building.pictures)) {
        buildingImageUrls = report.building.pictures;
      }
      buildingImages.push(
        ...buildingImageUrls
          .filter((img) => img && typeof img === "string")
          .slice(0, 3)
      );
    }

    // Display images (1 large + 2 small in grid) 
    if (buildingImages.length > 0) {
      // Main property image - SAME WIDTH AS PROPERTY OVERVIEW BOX
      const mainImageUrl = buildingImages[0];
      try {
        const mainImage = await fetchAndEmbedImage(pdfDoc, mainImageUrl);
        if (mainImage) {
          const pageMargin = 20; // Keep existing page margin
          const contentWidth = width - (pageMargin * 2); // Available content area
          const imageReduction = 60; // Reduce image width by this amount from each side
          const mainImageWidth = contentWidth - (imageReduction * 2); // Smaller than content area
          const mainImageHeight = 140; // Proportional height for smaller width
          const imageX = pageMargin + imageReduction; // Center within content area

          // Add border around main image with color fill 
          currentPage.drawRectangle({
            x: imageX - 5,
            y: y - mainImageHeight - 5,
            width: mainImageWidth + 10,
            height: mainImageHeight + 10,
            color: rgb(0.95, 0.97, 1),
            borderColor: rgb(0.1, 0.2, 0.6),
            borderWidth: 2,
          });

          currentPage.drawImage(mainImage, {
            x: imageX,
            y: y - mainImageHeight,
            width: mainImageWidth,
            height: mainImageHeight,
          });

          y -= mainImageHeight + 15;
        }
      } catch (error) {
        console.error("Error loading main cover image:", error);
      }

      // Grid of 2 additional images in a row - SAME WIDTH AS CONTENT AREA
      if (buildingImages.length > 1) {
        const gridImages = buildingImages.slice(1, 3);
        const pageMargin = 20; // Keep existing page margin
        const contentWidth = width - (pageMargin * 2); // Available content area
        const imageReduction = 60; // Same reduction as main image
        const spacing = 15;
        const availableGridWidth = contentWidth - (imageReduction * 2); // Reduced grid area
        const thumbnailWidth = (availableGridWidth - spacing) / 2; // Split reduced area
        const thumbnailHeight = 90; // Proportional to smaller width
        let currentX = pageMargin + imageReduction; // Start from reduced position

        for (let i = 0; i < gridImages.length; i++) {
          try {
            const thumbnailImage = await fetchAndEmbedImage(
              pdfDoc,
              gridImages[i]
            );
            if (thumbnailImage) {
              // Add border around thumbnail with color fill 
              currentPage.drawRectangle({
                x: currentX - 3,
                y: y - thumbnailHeight - 3,
                width: thumbnailWidth + 6,
                height: thumbnailHeight + 6,
                color: rgb(0.95, 0.97, 1),
                borderColor: rgb(0.1, 0.2, 0.6),
                borderWidth: 1,
              });

              currentPage.drawImage(thumbnailImage, {
                x: currentX,
                y: y - thumbnailHeight,
                width: thumbnailWidth,
                height: thumbnailHeight,
              });
              currentX += thumbnailWidth + spacing;
            }
          } catch (error) {
            console.error(`Error loading grid image ${i + 1}:`, error);
          }
        }
        y -= thumbnailHeight + 20;
      }
    }
    // Property Overview Box with full height left side padding
    const boxHeight = 160;
    const availableSpace = y - footerHeight - 30;

    if (availableSpace < boxHeight) {
      y = height - headerHeight - 60;
      if (buildingImages.length > 0) {
        y -= 190;
        if (buildingImages.length > 1) {
          y -= 120;
        }
      }
    }

    // FULL HEIGHT LEFT SIDE PADDING - This fills the entire left side height
    const leftPaddingWidth = pageMargin - 10;
    const fullPageHeight = height; // Full page height

    currentPage.drawRectangle({
      x: 0,
      y: 0, // Start from bottom of page
      width: leftPaddingWidth,
      height: fullPageHeight, // Full page height
      color: rgb(0.1, 0.2, 0.6), // Blue color fill for entire left side
    });

    currentPage.drawRectangle({
      x: pageMargin,
      y: y - boxHeight,
      width: contentWidth,
      height: boxHeight,
      borderColor: rgb(0.1, 0.2, 0.6),
      borderWidth: 2,
      color: rgb(0.98, 0.99, 1),
    });

    currentPage.drawText("PROPERTY OVERVIEW", {
      x: pageMargin + 20,
      y: y - 25,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    });

    y -= 45;

    // Property details in two columns
    const leftColumnX = pageMargin + 20;
    const rightColumnX = pageMargin + contentWidth / 2 + 10;
    let leftY = y;
    let rightY = y;

    // Left column details
    const leftColumnItems = [
      {
        label: "Property Owner",
        value: report.instructions?.verbalInstructions || "N/A",
      },
      { label: "Village", value: report.property?.village || "N/A" },
      { label: "Cell", value: report.property?.cell || "N/A" },
      // {
      //   label: "Plot Size",
      //   value: `${report.landTenure?.plot_size_sqm || "N/A"} sqm`,
      // },
    ];

    // Right column details
    const rightColumnItems = [
      { label: "Prepared By", value: report.declaration?.techName || "N/A" },
      { label: "Sector", value: report.property?.sector || "N/A" },
      { label: "District", value: report.property?.district || "N/A" },
      {
        label: "Date",
        value: new Date(
          report.instructions?.date || Date.now()
        ).toLocaleDateString(),
      },
    ];

    // Draw left column
    leftColumnItems.forEach((item) => {
      currentPage.drawText(`${item.label}:`, {
        x: leftColumnX,
        y: leftY,
        size: 10,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      currentPage.drawText(item.value, {
        x: leftColumnX + 80,
        y: leftY,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      leftY -= 18;
    });

    // Draw right column
    rightColumnItems.forEach((item) => {
      currentPage.drawText(`${item.label}:`, {
        x: rightColumnX,
        y: rightY,
        size: 10,
        font: boldFont,
        color: rgb(0.3, 0.3, 0.3),
      });

      currentPage.drawText(item.value, {
        x: rightColumnX + 80,
        y: rightY,
        size: 10,
        font: font,
        color: rgb(0, 0, 0),
      });
      rightY -= 18;
    });

    // Add footer to cover page
    addFooter(currentPage, pageNumber++);

    // START NEW PAGE FOR CONTENT
    currentPage = pdfDoc.addPage();
    ({ width, height } = currentPage.getSize());
    addHeader(currentPage, pageNumber);
    y = height - headerHeight - 20;

    // MAIN CONTENT SECTIONS

    // 1. INSTRUCTIONS
    writeTitle("1. VALUATION INSTRUCTIONS");
    if (report.instructions) {
      writeText(
        "Verbal instructions given to us by ",
        report.instructions.verbalInstructions || "N/A",
        20
      );
      // writeText(
      //   "Writen instructions given to us by",
      //   report.instructions.writtenInstructions || "N/A",
      //   20
      // );
      writeText("Date", report.instructions.inspectedDate || "N/A", 20);
      writeArray("Purposes", report.instructions.purpose, 20);
      writeArray("Bank", report.instructions.bank_name || "N/A", 20);
      writeText("inspection Date", report.instructions.inspectedDate || "N/A", 20);
      writeText("Inspected By", report.instructions.inspectedBy || "N/A", 20);

    }

    // 2. DEFINITION OF VALUES
    checkAndAddNewPage(100);
    writeTitle("2. DEFINITION OF VALUES");
    writeHtmlContent("", report.definitionOfValues || "N/A", 0);

    // 3. BASIS OF VALUATION
    checkAndAddNewPage(100);
    writeTitle("3. BASIS OF VALUATION");
    writeHtmlContent("", report.basisOfValuation || "N/A", 0);

    // 4. LIMITING CONDITIONS
    checkAndAddNewPage(100);
    writeTitle("4. LIMITING CONDITIONS");
    writeHtmlContent("", report.limitingCondition || "N/A", 0);

    // 5. ASSUMPTIONS
    checkAndAddNewPage(100);
    writeTitle("5. ASSUMPTIONS");
    writeHtmlContent("", report.assumptions || "N/A", 0);

    // 6. ENHANCED DECLARATIONS WITH SIGNATURE IMAGES
    checkAndAddNewPage(150);
    writeTitle("6. PROFESSIONAL DECLARATIONS");
    if (report.declaration) {
      if (report.declaration.techName) {

        if (report.declaration) {
          writeText("",
            `I ${report.declaration.techName || "N/A"} ${report.declaration.techStatement || "N/A"}`,
            20
          );
          writeText("", report.declaration.techPosition || "N/A", 20);
          writeText("", report.declaration.techDate || "N/A", 20);
        }



        // Add technician signature image
        if (report.declaration.techSignature) {
          try {
            const techSigImage = await fetchAndEmbedImage(
              pdfDoc,
              report.declaration.techSignature
            );
            if (techSigImage) {
              checkAndAddNewPage(80);
              currentPage.drawText("Technician Signature:", {
                x: pageMargin + 20,
                y: y,
                size: 12,
                font: boldFont,
              });
              y -= 15;

              currentPage.drawImage(techSigImage, {
                x: pageMargin + 20,
                y: y - 60,
                width: 120,
                height: 60,
              });
              y -= 70;
            }
          } catch (error) {
            console.error("Error loading technician signature:", error);
          }
        }
      }

      if (
        report.declaration.assistantName &&
        report.declaration.assistantName !== "_________"
      ) {
        y -= 15;
        writeText(
          "Assistant Valuer",
          report.declaration.assistantName,
          20,
          true
        );
        writeText("Date", report.declaration.assistantDate || "N/A", 20);
        writeText(
          "Statement",
          report.declaration.assistantStatement || "N/A",
          20
        );

        // Add assistant signature image
        if (report.declaration.assistantSignature) {
          try {
            const assistantSigImage = await fetchAndEmbedImage(
              pdfDoc,
              report.declaration.assistantSignature
            );
            if (assistantSigImage) {
              checkAndAddNewPage(80);
              currentPage.drawText("Assistant Signature:", {
                x: pageMargin + 20,
                y: y,
                size: 12,
                font: boldFont,
              });
              y -= 15;

              currentPage.drawImage(assistantSigImage, {
                x: pageMargin + 20,
                y: y - 60,
                width: 120,
                height: 60,
              });
              y -= 70;
            }
          } catch (error) {
            console.error("Error loading assistant signature:", error);
          }
        }
      }

      if (report.declaration.finalStatement) {
        y -= 15;
        writeText("Final Declaration", report.declaration.finalStatement, 20);

        // Add final signature image
        if (report.declaration.finalSignature) {
          try {
            const finalSigImage = await fetchAndEmbedImage(
              pdfDoc,
              report.declaration.finalSignature
            );
            if (finalSigImage) {
              checkAndAddNewPage(80);
              currentPage.drawText("Final Signature:", {
                x: pageMargin + 20,
                y: y,
                size: 12,
                font: boldFont,
              });
              y -= 15;

              currentPage.drawImage(finalSigImage, {
                x: pageMargin + 20,
                y: y - 60,
                width: 120,
                height: 60,
              });
              y -= 70;
            }
          } catch (error) {
            console.error("Error loading final signature:", error);
          }
        }
      }
    }

    // 7. PROPERTY LOCATION
    checkAndAddNewPage(100);
    writeTitle("7. PROPERTY LOCATION");
    if (report.property) {
      // writeText(
      //   "Property Owner",
      //   report.instructions?.verbalInstructions || "N/A",
      //   20,
      //   true
      // );
      // writeText(
      //   "UPI Number",
      //   report.property.propertyUPI || report.property.upi || "N/A",
      //   20
      // );
      writeText(
        "Geographical Coordinate Within the Property",
        report.property.geographical_coordinate || "N/A",
        20
      );
      writeText(
        "Address",
        report.property.address || report.property.location || "N/A",
        20
      );
      writeText("Village", report.property.village || "N/A", 20);
      writeText("Cell", report.property.cell || "N/A", 20);
      writeText("Sector", report.property.sector || "N/A", 20);
      writeText("District", report.property.district || "N/A", 20);
      writeText("Province", report.property.province || "N/A", 20);
      writeText("Country", report.property.country || "Rwanda", 20);
      // writeText(
      //   "Geographical Coordinates",
      //   report.property.geographical_coordinate ||
      //   report.property.coordinates ||
      //   "N/A",
      //   20
      // );
    }

    // 8. TENURE AND TENANCIES
    checkAndAddNewPage(100);
    writeTitle("8. TENURE AND TENANCIES");
    if (report.landTenure) {
      writeTitle("Tenure")
      writeText("Tenure Type", report.landTenure.tenure || "N/A", 20);

      writeText(
        "Tenure Years",
        report.landTenure.tenure_years?.toString() || "N/A",
        20
      );
      writeText(
        "Tenure Start Date",
        report.landTenure.tenure_start_date || "N/A",
        20
      );
      writeText("Occupancy", report.landTenure.occupancy || "N/A", 20);
      writeText("Encumbrances", report.landTenure.encumbrances || "N/A", 20);
      writeText(
        "Plot Size",
        report.landTenure.plot_size_sqm
          ? `${report.landTenure.plot_size_sqm} sqm`
          : "N/A",
        20
      );

      writeText("Plot Shape", report.landTenure.plot_shape || "N/A", 20);
      writeTitle("use")
      writeText(
        "Land Title Use",
        report.landTenure.land_title_use || "N/A",
        20
      );
      writeText(
        "Current Land Use",
        report.landTenure.land_current_use || "N/A",
        20
      );
      writeText("NLA Zoning", report.landTenure.nla_zoning || "N/A", 20);

      writeSubTitle(
        "Master Plan", 11, true
      );
      writeText(
        "Permitted Uses",
        report.landTenure.permitted_uses || "N/A",
        20
      );
      writeText(
        "Prohibited Uses",
        report.landTenure.prohibited_uses || "N/A",
        20
      );
      writeText(
        "Lot Size",
        report.landTenure.lot_size_notes || "N/A",
        20
      );
    }

    // 9. SERVICES AND SITE WORKS
    checkAndAddNewPage(100);
    writeTitle("9. SERVICES AND SITE WORKS");

    if (report.siteWorks) {
      writeText("Site Name", report.siteWorks.site_name || "N/A", 20, true);
      // writeText(
      //   "Boundary Wall",
      //   report.siteWorks.has_boundary_wall ? "Yes" : "No",
      //   20
      // );
      writeTitle("Services");
      writeArray("Utility Supplies", report.siteWorks.supply_types, 20);
      writeArray("Access Types", report.siteWorks.access_types, 20);
      writeTitle("Site Works");
      writeArray("Wall Materials", report.siteWorks.walls, 20);
      writeArray("Wall Finishing", report.siteWorks.finishing, 20);
      writeArray("Foundation Types", report.siteWorks.foundation_types, 20);
      writeArray("Gate Types", report.siteWorks.gate_types, 20);
      writeArray("Yard Types", report.siteWorks.yard_types, 20);
      writeArray("Lighting", report.siteWorks.lighting, 20);


      writeText("CCTV System", report.siteWorks.cctv_installed || "N/A", 20);
      writeText(
        "Solar System",
        report.siteWorks.solar_system_installed || "N/A",
        20
      );
      writeText(
        "Playground Area",
        report.siteWorks.playground_sqm
          ? `${report.siteWorks.playground_sqm} sqm`
          : "N/A",
        20
      );
      writeText(
        "Swimming Pool Area",
        report.siteWorks.swimming_pool_sqm
          ? `${report.siteWorks.swimming_pool_sqm} sqm`
          : "N/A",
        20
      );
    }

    // PROPERLY DISPLAY SITE WORK IMAGES UNDER SITE WORKS SECTION
    // const siteWorkPictures = report.siteWorks?.pictures;
    // if (siteWorkPictures) {
    //   let siteImageUrls: string[] = [];

    //   if (typeof siteWorkPictures === "string") {
    //     try {
    //       siteImageUrls = JSON.parse(siteWorkPictures);
    //     } catch (e) {
    //       console.error("Failed to parse site work pictures JSON:", e);
    //       siteImageUrls = [];
    //     }
    //   } else if (Array.isArray(siteWorkPictures)) {
    //     siteImageUrls = siteWorkPictures;
    //   }

    //   if (siteImageUrls.length > 0) {
    //     const validSiteImages = siteImageUrls.filter(
    //       (img) => img && typeof img === "string"
    //     );
    //     if (validSiteImages.length > 0) {
    //       displayImagesInGrid(validSiteImages, "Site Work Photographs:");
    //     }
    //   }
    // }

    // Add site work images
    const siteWorkPictures = report.siteWorks?.pictures;
    if (siteWorkPictures) {
      let imageUrls: string[] = [];

      if (typeof siteWorkPictures === "string") {
        try {
          imageUrls = JSON.parse(siteWorkPictures);
        } catch (e) {
          console.error("Failed to parse site work pictures JSON:", e);
          imageUrls = [];
        }
      } else if (Array.isArray(siteWorkPictures)) {
        imageUrls = siteWorkPictures;
      }

      if (imageUrls.length > 0) {
        checkAndAddNewPage(50);
        currentPage.drawText("Site Work Photographs:", {
          x: pageMargin + 20,
          y: y,
          size: 14,
          font: boldFont,
          color: rgb(0, 0, 0.6),
        });
        y -= 25;

        const imageWidth = 200;
        const imageHeight = 150;
        const gapX = 40; // horizontal gap between images
        const gapY = 40; // vertical gap between rows

        let col = 0; // track column (0 = left, 1 = right)
        let startX = pageMargin + 20;

        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];

          if (!imageUrl || typeof imageUrl !== "string") {
            console.log(`Skipping invalid image URL at index ${i}:`, imageUrl);
            continue;
          }

          try {
            const embeddedImage = await fetchAndEmbedImage(pdfDoc, imageUrl);

            if (embeddedImage) {
              // check if there's enough vertical space
              checkAndAddNewPage(imageHeight + gapY);

              const xPos = startX + col * (imageWidth + gapX);
              const yPos = y - imageHeight;

              currentPage.drawText(`Photo ${i + 1}:`, {
                x: xPos,
                y: y,
                size: 12,
                font: font,
              });

              currentPage.drawImage(embeddedImage, {
                x: xPos,
                y: yPos,
                width: imageWidth,
                height: imageHeight,
              });

              // Move column
              if (col === 0) {
                col = 1; // move to right column
              } else {
                col = 0;
                y -= imageHeight + gapY; // new row
              }
            } else {
              console.error(
                `Failed to embed site work image ${i + 1}:`,
                imageUrl
              );
            }
          } catch (error) {
            console.error(`Error processing site work image ${i + 1}:`, error);
          }
        }

        // If last row had only 1 image, move y down to avoid overlap with next section
        if (col === 1) {
          y -= imageHeight + gapY;
        }
      }
    }

    // 10. BUILDING DETAILS
    checkAndAddNewPage(100);
    writeTitle("10. BUILDING DETAILS");
    if (report.building) {
      writeText("Building Name", report.building.house_name || "N/A", 20, true);
      writeText("Overall Condition", report.building.condition || "N/A", 20);
      writeText("Roof Structure", report.building.roof_member || "N/A", 20);
      writeArray("Foundation", report.building.foundation, 20);
      writeArray("Wall Materials", report.building.walls, 20);
      writeArray("Wall Finishing", report.building.wall_finishing, 20);
      writeArray("Roof Covering", report.building.roof_covering, 20);
      writeArray("Ceiling Types", report.building.ceiling, 20);
      writeArray("Flooring Types", report.building.flooring, 20);
      writeArray("Door Types", report.building.doors, 20);
      writeArray("Window Types", report.building.windows, 20);
      writeArray("Fittings & Fixtures", report.building.fittings, 20);
      writeArray(
        "Accommodation Units",
        report.building.accommodation_units,
        20
      );
      writeArray("Other Units", report.building.other_accommodation_unit, 20);
    }

    // PROPERLY DISPLAY BUILDING IMAGES UNDER BUILDING SECTION
    // Add building images
    const buildingPictures = report.building?.pictures;
    if (buildingPictures) {
      let buildingImageUrls: string[] = [];

      if (typeof buildingPictures === "string") {
        try {
          buildingImageUrls = JSON.parse(buildingPictures);
        } catch (e) {
          console.error("Failed to parse building pictures JSON:", e);
          buildingImageUrls = [];
        }
      } else if (Array.isArray(buildingPictures)) {
        buildingImageUrls = buildingPictures;
      }

      if (buildingImageUrls.length > 0) {
        checkAndAddNewPage(50);
        currentPage.drawText("Building Photographs:", {
          x: pageMargin + 20,
          y: y,
          size: 14,
          font: boldFont,
          color: rgb(0, 0, 0.6),
        });
        y -= 25;

        const imageWidth = 200;
        const imageHeight = 150;
        const gapX = 40; // horizontal space between columns
        const gapY = 40; // vertical space between rows

        let col = 0; // 0 = left, 1 = right
        let startX = pageMargin + 20;

        for (let i = 0; i < buildingImageUrls.length; i++) {
          const imageUrl = buildingImageUrls[i];

          if (!imageUrl || typeof imageUrl !== "string") {
            console.log(
              `Skipping invalid building image URL at index ${i}:`,
              imageUrl
            );
            continue;
          }

          try {
            const embeddedImage = await fetchAndEmbedImage(pdfDoc, imageUrl);

            if (embeddedImage) {
              // check if page has enough space
              checkAndAddNewPage(imageHeight + gapY);

              const xPos = startX + col * (imageWidth + gapX);
              const yPos = y - imageHeight;

              // Draw label above each image
              currentPage.drawText(`Building Photo ${i + 1}:`, {
                x: xPos,
                y: y,
                size: 12,
                font: font,
              });

              // Draw the image
              currentPage.drawImage(embeddedImage, {
                x: xPos,
                y: yPos,
                width: imageWidth,
                height: imageHeight,
              });

              // Move to next column / row
              if (col === 0) {
                col = 1; // move to right column
              } else {
                col = 0;
                y -= imageHeight + gapY; // new row
              }
            } else {
              console.error(
                `Failed to embed building image ${i + 1}:`,
                imageUrl
              );
            }
          } catch (error) {
            console.error(`Error processing building image ${i + 1}:`, error);
          }
        }

        // If last row only had one image, adjust y down
        if (col === 1) {
          y -= imageHeight + gapY;
        }
      }
    }

    // 11. GENERAL REMARKS
    if (report.generalRemarks) {
      checkAndAddNewPage(100);
      writeTitle("11. GENERAL REMARKS");
      writeHtmlContent("", report.generalRemarks, 0);
    }

    // 12. COMPUTATION TABLE
    checkAndAddNewPage(200);
    drawValuationTable();

    // Add footer to last page
    addFooter(currentPage, pdfDoc.getPageCount());

    // Save PDF
    const pdfBytes = await pdfDoc.save();

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="property-valuation-report-${id}.pdf"`,
        "Content-Length": pdfBytes.length.toString(),
      },
    });
    //return NextResponse.json({ message: `PDF generated for report ID: ${id}` });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );

  }
}
