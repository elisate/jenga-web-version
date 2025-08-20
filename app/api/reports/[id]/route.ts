import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { supabaseClient } from "@/lib/supabase/client";

// Complete report type based on your JSON structure
type ReportData = {
  instructions?: {
    verbalInstructions?: string;
    writtenInstructions?: string;
    date?: string;
    purposes?: string[];
    inspectedDate?: string;
    inspectedBy?: string;
  };
  definitionOfValues?: string;
  basisOfValuation?: string;
  limitingCondition?: string;
  assumptions?: string;
  declaration?: {
    techName?: string;
    techPosition?: string;
    techDate?: string;
    techSignature?: string;
    techStatement?: string;
    assistantName?: string;
    assistantDate?: string;
    assistantSignature?: string;
    assistantStatement?: string;
    finalStatement?: string;
    finalSignature?: string;
  };
  property?: {
    id?: number;
    propertyUPI?: string;
    upi?: string;
    owner?: string;
    address?: string;
    district?: string;
    province?: string;
    sector?: string;
    village?: string;
    cell?: string;
    country?: string;
    location?: string;
    coordinates?: string;
    imgs?: string[];
    geographical_coordinate?: string;
    location_maps?: string;
  };
  landTenure?: {
    id?: string;
    tenure?: string;
    occupancy?: string;
    nla_zoning?: string;
    plot_shape?: string;
    encumbrances?: string;
    tenure_years?: number;
    plot_size_sqm?: number;
    land_title_use?: string;
    lot_size_notes?: string;
    permitted_uses?: string;
    prohibited_uses?: string;
    land_current_use?: string;
    tenure_start_date?: string;
    map_from_nla?: string;
    map_from_masterplan?: string;
  };
  siteWorks?: {
    id?: string;
    site_name?: string;
    walls?: string[];
    lighting?: string[];
    finishing?: string[];
    gate_types?: string[];
    yard_types?: string[];
    access_types?: string[];
    supply_types?: string[];
    foundation_types?: string[];
    has_boundary_wall?: boolean;
    cctv_installed?: string;
    playground_sqm?: number;
    swimming_pool_sqm?: number;
    solar_system_installed?: string;
    pictures?: string | string[];
  };
  building?: {
    id?: string;
    house_name?: string;
    condition?: string;
    doors?: string[];
    walls?: string[];
    ceiling?: string[];
    windows?: string[];
    fittings?: string[];
    flooring?: string[];
    foundation?: string[];
    roof_member?: string;
    roof_covering?: string[];
    wall_finishing?: string[];
    accommodation_units?: string[];
    other_accommodation_unit?: string[];
    pictures?: string | string[];
  };
  generalRemarks?: string;
  valuationTable?: {
    main?: Array<Array<string | number>>;
    land?: Array<string | number>;
    summary?: Array<Array<string | number>>;
  };
};

// Helper function to fetch and embed images
async function fetchAndEmbedImage(pdfDoc: PDFDocument, imageUrl: string) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;

    const imageBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(imageBuffer);

    // Try to embed as JPG first, then PNG
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

// Helper function to load custom font (Montserrat)
async function loadMontserratFont(pdfDoc: PDFDocument) {
  try {
    // Try to fetch Montserrat font from Google Fonts or use fallback
    const montserratUrl = 'https://fonts.gstatic.com/s/montserrat/v25/JTUHjIg1_i6t8kCHKm4532VJOt5-QNFgpCtr6Ew-.woff2';
    
    try {
      const fontResponse = await fetch(montserratUrl);
      if (fontResponse.ok) {
        const fontBuffer = await fontResponse.arrayBuffer();
        return await pdfDoc.embedFont(new Uint8Array(fontBuffer));
      }
    } catch (error) {
      console.log("Could not load Montserrat font, using fallback:", error);
    }
    
    // Fallback to Helvetica if Montserrat is not available
    return await pdfDoc.embedFont(StandardFonts.Helvetica);
  } catch (error) {
    console.error("Error loading font:", error);
    return await pdfDoc.embedFont(StandardFonts.Helvetica);
  }
}

// Helper function to parse HTML content and extract text with proper formatting
function parseHtmlToText(html: string): Array<{text: string, isBold?: boolean, isHeader?: boolean}> {
  if (!html) return [];

  const sections: Array<{text: string, isBold?: boolean, isHeader?: boolean}> = [];
  
  // Split by major HTML elements and process
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
        sections.push({text: headerText, isHeader: true, isBold: true});
      }
      i++; // Skip the header content part
    } else if (part === "/HEADER") {
      continue;
    } else {
      const cleanText = part.replace(/<[^>]*>/g, "").trim();
      if (cleanText) {
        const lines = cleanText.split("\n").filter(line => line.trim());
        lines.forEach(line => {
          sections.push({text: line.trim()});
        });
      }
    }
  }

  return sections;
}

// Helper function to sanitize text
function sanitizeText(text?: string) {
  if (!text) return "";
  // Replace tabs/newlines with space, remove other control chars
  return text.replace(/[\t\n\r]/g, " ").replace(/[\u0000-\u001F\u007F]/g, "");
}

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const id = (await params)?.id?.trim();
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
      const logoUrl = `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
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

      page.drawText("RESIDENTIAL PROPERTY", {
        x: pageMargin,
        y: height - 57,
        size: 10,
        font: font,
        color: rgb(0.1, 0.2, 0.6),
      });

      if (pageNumber > 1) {
        page.drawText(`Report ID: ${id}`, {
          x: width - 200,
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
        "Tel No: 0783520172, 0788474844, 0728520172; Email: towerpropertyconsultancy@gmail.com",
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

    // Page check function
    const checkAndAddNewPage = (requiredSpace = 60) => {
      if (y < footerHeight + requiredSpace + 20) { // Added extra margin to avoid footer overlap
        addFooter(currentPage, pdfDoc.getPageCount());
        currentPage = pdfDoc.addPage();
        ({ width, height } = currentPage.getSize());
        addHeader(currentPage, pdfDoc.getPageCount());
        y = height - headerHeight - 20;
        return true;
      }
      return false;
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

    // Enhanced function to write HTML content with proper styling
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
        currentPage.drawText(`${label}:`, {
          x: pageMargin + indent,
          y: y,
          size: 12,
          font: boldFont,
        });
        y -= lineHeight + 5;
      }

      for (const section of sections) {
        if (section.isHeader) {
          checkAndAddNewPage(40);
          currentPage.drawText(section.text, {
            x: pageMargin + indent + 20,
            y: y,
            size: 14,
            font: boldFont,
            color: rgb(0.2, 0.2, 0.7),
          });
          y -= lineHeight + 5;
        } else if (section.text.startsWith("• ")) {
          const listText = section.text.substring(2);
          writeText("", `• ${listText}`, indent + 20);
        } else if (section.text.match(/^\d+\./)) {
          writeText("", section.text, indent + 20);
        } else {
          // Regular paragraph text
          const maxWidth = contentWidth - indent - 20;
          const words = section.text.split(" ");
          let lines: string[] = [];
          let currentLine = "";

          for (const word of words) {
            const testLine = currentLine + word + " ";
            const safeTestLine = sanitizeText(testLine);

            let textWidth: number;
            try {
              textWidth = font.widthOfTextAtSize(safeTestLine, 12);
            } catch (err) {
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
              x: pageMargin + indent + 20,
              y: y,
              size: 12,
              font: font,
            });
            y -= lineHeight;
          }
        }
      }

      y -= 10;
    };

    // Function to handle arrays with bold headers
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
      
      // Bold header
      currentPage.drawText(`${label}:`, {
        x: pageMargin + indent,
        y: y,
        size: 12,
        font: boldFont,
      });
      y -= lineHeight;
      
      // List items below
      arrayValues.forEach(value => {
        checkAndAddNewPage(25);
        currentPage.drawText(`• ${value}`, {
          x: pageMargin + indent + 20,
          y: y,
          size: 12,
          font: font,
        });
        y -= lineHeight;
      });
      
      y -= 5; // Extra space after list
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
    const propertyUPI = report.property?.propertyUPI || report.property?.upi || "N/A";
    const location = `${report.property?.village || ""}, ${report.property?.sector || ""}, ${report.property?.district || ""}, ${report.property?.province || ""}`.replace(/^, |, $/g, "");
    
    currentPage.drawText(propertyTitle, {
      x: pageMargin,
      y: y,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0.8)
    });
    y -= 25;
    
    currentPage.drawText(`PROPERTY UPI: ${propertyUPI}`, {
      x: pageMargin,
      y: y,
      size: 14,
      font: boldFont,
      color: rgb(0.6, 0, 0)
    });
    y -= 20;
    
    currentPage.drawText(`LOCATED: ${location}`, {
      x: pageMargin,
      y: y,
      size: 12,
      font: font,
      color: rgb(0.2, 0.2, 0.2)
    });
    y -= 40;

    // Collect building images only (limit to 3)
    const buildingImages: string[] = [];
    
    // Only collect building images
    if (report.building?.pictures) {
      let buildingImageUrls: string[] = [];
      if (typeof report.building.pictures === 'string') {
        try {
          buildingImageUrls = JSON.parse(report.building.pictures);
        } catch (e) {
          console.error("Failed to parse building pictures:", e);
        }
      } else if (Array.isArray(report.building.pictures)) {
        buildingImageUrls = report.building.pictures;
      }
      buildingImages.push(...buildingImageUrls.filter(img => img && typeof img === 'string').slice(0, 3));
    }

    // Display images (1 large + 2 small in grid)
    if (buildingImages.length > 0) {
      // Main property image (smaller width as requested)
      const mainImageUrl = buildingImages[0];
      try {
        const mainImage = await fetchAndEmbedImage(pdfDoc, mainImageUrl);
        if (mainImage) {
          const mainImageWidth = 300; // Reduced width
          const mainImageHeight = 200; // Proportional height
          const imageX = (width - mainImageWidth) / 2;

          currentPage.drawImage(mainImage, {
            x: imageX,
            y: y - mainImageHeight,
            width: mainImageWidth,
            height: mainImageHeight,
          });

          y -= mainImageHeight + 20;
        }
      } catch (error) {
        console.error("Error loading main cover image:", error);
      }

      // Grid of 2 additional images in a row
      if (buildingImages.length > 1) {
        const gridImages = buildingImages.slice(1, 3); // Take up to 2 more images
        const thumbnailWidth = 140; // Equal size for grid images
        const thumbnailHeight = 140; // Equal size for grid images
        const spacing = 20;
        const totalGridWidth = (thumbnailWidth * gridImages.length) + (spacing * (gridImages.length - 1));
        let currentX = (width - totalGridWidth) / 2; // Center the grid

        for (let i = 0; i < gridImages.length; i++) {
          try {
            const thumbnailImage = await fetchAndEmbedImage(pdfDoc, gridImages[i]);
            if (thumbnailImage) {
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
        y -= thumbnailHeight + 30;
      }
    }

    // Property Overview Box (ensure it doesn't go into footer)
    const boxHeight = 180;
    if (y - boxHeight < footerHeight + 20) {
      addFooter(currentPage, pageNumber++);
      currentPage = pdfDoc.addPage();
      ({ width, height } = currentPage.getSize());
      addHeader(currentPage, pageNumber);
      y = height - headerHeight - 20;
    }

    currentPage.drawRectangle({
      x: pageMargin,
      y: y - boxHeight,
      width: contentWidth,
      height: boxHeight,
      borderColor: rgb(0.1, 0.2, 0.6),
      borderWidth: 2,
    });

    currentPage.drawText("PROPERTY OVERVIEW", {
      x: pageMargin + 20,
      y: y - 25,
      size: 16,
      font: boldFont,
      color: rgb(0, 0, 0.8),
    });

    y -= 50;

    // Property details in two columns
    const leftColumnX = pageMargin + 20;
    const rightColumnX = pageMargin + (contentWidth / 2) + 10;
    let leftY = y;
    let rightY = y;

    // Left column details
    const leftColumnItems = [
      { label: "Property Owner", value: report.instructions?.verbalInstructions || "N/A" },
      { label: "Village", value: report.property?.village || "N/A" },
      { label: "Cell", value: report.property?.cell || "N/A" },
      { label: "Plot Size", value: `${report.landTenure?.plot_size_sqm || "N/A"} sqm` }
    ];

    // Right column details
    const rightColumnItems = [
      { label: "Prepared By", value: report.declaration?.techName || "N/A" },
      { label: "Sector", value: report.property?.sector || "N/A" },
      { label: "District", value: report.property?.district || "N/A" },
      { label: "Date", value: new Date(report.instructions?.date || Date.now()).toLocaleDateString() }
    ];

    // Draw left column
    leftColumnItems.forEach(item => {
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
      leftY -= 20;
    });

    // Draw right column
    rightColumnItems.forEach(item => {
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
      rightY -= 20;
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
      writeText("Verbal Instructions", report.instructions.verbalInstructions || "N/A", 20);
      writeText("Written Instructions", report.instructions.writtenInstructions || "N/A", 20);
      writeText("Inspection Date", report.instructions.inspectedDate || "N/A", 20);
      writeText("Inspected By", report.instructions.inspectedBy || "N/A", 20);
      writeText("Report Date", report.instructions.date || "N/A", 20);
      writeArray("Purposes", report.instructions.purposes, 20);
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
        writeText("Technician Valuer", report.declaration.techName, 20, true);
        writeText("Position", report.declaration.techPosition || "N/A", 20);
        writeText("Date", report.declaration.techDate || "N/A", 20);
        writeText("Statement", report.declaration.techStatement || "N/A", 20);
        
        // Add technician signature image
        if (report.declaration.techSignature) {
          try {
            const techSigImage = await fetchAndEmbedImage(pdfDoc, report.declaration.techSignature);
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

      if (report.declaration.assistantName && report.declaration.assistantName !== "_________") {
        y -= 15;
        writeText("Assistant Valuer", report.declaration.assistantName, 20, true);
        writeText("Date", report.declaration.assistantDate || "N/A", 20);
        writeText("Statement", report.declaration.assistantStatement || "N/A", 20);
        
        // Add assistant signature image
        if (report.declaration.assistantSignature) {
          try {
            const assistantSigImage = await fetchAndEmbedImage(pdfDoc, report.declaration.assistantSignature);
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
            const finalSigImage = await fetchAndEmbedImage(pdfDoc, report.declaration.finalSignature);
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
      writeText("Property Owner", report.instructions?.verbalInstructions || "N/A", 20, true);
      writeText("UPI Number", report.property.propertyUPI || report.property.upi || "N/A", 20);
      writeText("Address", report.property.address || report.property.location || "N/A", 20);
      writeText("Village", report.property.village || "N/A", 20);
      writeText("Cell", report.property.cell || "N/A", 20);
      writeText("Sector", report.property.sector || "N/A", 20);
      writeText("District", report.property.district || "N/A", 20);
      writeText("Province", report.property.province || "N/A", 20);
      writeText("Country", report.property.country || "Rwanda", 20);
      writeText("Geographical Coordinates", report.property.geographical_coordinate || report.property.coordinates || "N/A", 20);
    }

    // 8. TENURE AND TENANCIES
    checkAndAddNewPage(100);
    writeTitle("8. TENURE AND TENANCIES");
    if (report.landTenure) {
      writeText("Tenure Type", report.landTenure.tenure || "N/A", 20, true);
      writeText("Occupancy", report.landTenure.occupancy || "N/A", 20);
      writeText("Plot Size", report.landTenure.plot_size_sqm ? `${report.landTenure.plot_size_sqm} sqm` : "N/A", 20);
      writeText("Plot Shape", report.landTenure.plot_shape || "N/A", 20);
      writeText("NLA Zoning", report.landTenure.nla_zoning || "N/A", 20);
      writeText("Land Title Use", report.landTenure.land_title_use || "N/A", 20);
      writeText("Current Land Use", report.landTenure.land_current_use || "N/A", 20);
      writeText("Tenure Years", report.landTenure.tenure_years?.toString() || "N/A", 20);
      writeText("Tenure Start Date", report.landTenure.tenure_start_date || "N/A", 20);
      writeText("Encumbrances", report.landTenure.encumbrances || "N/A", 20);
      writeText("Permitted Uses", report.landTenure.permitted_uses || "N/A", 20);
      writeText("Prohibited Uses", report.landTenure.prohibited_uses || "N/A", 20);
      writeText("Lot Size Notes", report.landTenure.lot_size_notes || "N/A", 20);
    }

    // 9. SERVICES AND SITE WORKS
    checkAndAddNewPage(100);
    writeTitle("9. SERVICES AND SITE WORKS");
    if (report.siteWorks) {
      writeText("Site Name", report.siteWorks.site_name || "N/A", 20, true);
      writeText("Boundary Wall", report.siteWorks.has_boundary_wall ? "Yes" : "No", 20);
      writeArray("Wall Materials", report.siteWorks.walls, 20);
      writeArray("Wall Finishing", report.siteWorks.finishing, 20);
      writeArray("Foundation Types", report.siteWorks.foundation_types, 20);
      writeArray("Gate Types", report.siteWorks.gate_types, 20);
      writeArray("Yard Types", report.siteWorks.yard_types, 20);
      writeArray("Lighting", report.siteWorks.lighting, 20);
      writeArray("Access Types", report.siteWorks.access_types, 20);
      writeArray("Utility Supplies", report.siteWorks.supply_types, 20);
      writeText("CCTV System", report.siteWorks.cctv_installed || "N/A", 20);
      writeText("Solar System", report.siteWorks.solar_system_installed || "N/A", 20);
      writeText("Playground Area", report.siteWorks.playground_sqm ? `${report.siteWorks.playground_sqm} sqm` : "N/A", 20);
      writeText("Swimming Pool Area", report.siteWorks.swimming_pool_sqm ? `${report.siteWorks.swimming_pool_sqm} sqm` : "N/A", 20);
    }

    // Add site work images
    const siteWorkPictures = report.siteWorks?.pictures;
    if (siteWorkPictures) {
      let imageUrls: string[] = [];
      
      if (typeof siteWorkPictures === 'string') {
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

        for (let i = 0; i < imageUrls.length; i++) {
          const imageUrl = imageUrls[i];
          
          if (!imageUrl || typeof imageUrl !== 'string') {
            console.log(`Skipping invalid image URL at index ${i}:`, imageUrl);
            continue;
          }

          try {
            const embeddedImage = await fetchAndEmbedImage(pdfDoc, imageUrl);

            if (embeddedImage) {
              checkAndAddNewPage(200);

              const imageWidth = 200;
              const imageHeight = 150;

              currentPage.drawText(`Site Work Photo ${i + 1}:`, {
                x: pageMargin + 20,
                y: y,
                size: 12,
                font: font,
              });
              y -= 20;

              currentPage.drawImage(embeddedImage, {
                x: pageMargin + 20,
                y: y - imageHeight,
                width: imageWidth,
                height: imageHeight,
              });

              y -= imageHeight + 25;
            } else {
              console.error(`Failed to embed site work image ${i + 1}:`, imageUrl);
            }
          } catch (error) {
            console.error(`Error processing site work image ${i + 1}:`, error);
          }
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
      writeArray("Accommodation Units", report.building.accommodation_units, 20);
      writeArray("Other Units", report.building.other_accommodation_unit, 20);
    }

    // Add building images
    const buildingPictures = report.building?.pictures;
    if (buildingPictures) {
      let buildingImageUrls: string[] = [];
      
      if (typeof buildingPictures === 'string') {
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

        for (let i = 0; i < buildingImageUrls.length; i++) {
          const imageUrl = buildingImageUrls[i];
          
          if (!imageUrl || typeof imageUrl !== 'string') {
            console.log(`Skipping invalid building image URL at index ${i}:`, imageUrl);
            continue;
          }

          try {
            const embeddedImage = await fetchAndEmbedImage(pdfDoc, imageUrl);

            if (embeddedImage) {
              checkAndAddNewPage(200);

              const imageWidth = 200;
              const imageHeight = 150;

              currentPage.drawText(`Building Photo ${i + 1}:`, {
                x: pageMargin + 20,
                y: y,
                size: 12,
                font: font,
              });
              y -= 20;

              currentPage.drawImage(embeddedImage, {
                x: pageMargin + 20,
                y: y - imageHeight,
                width: imageWidth,
                height: imageHeight,
              });

              y -= imageHeight + 25;
            } else {
              console.error(`Failed to embed building image ${i + 1}:`, imageUrl);
            }
          } catch (error) {
            console.error(`Error processing building image ${i + 1}:`, error);
          }
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