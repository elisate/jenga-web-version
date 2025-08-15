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
    techStatement?: string;
    assistantName?: string;
    assistantDate?: string;
    assistantStatement?: string;
    finalStatement?: string;
  };
  property?: {
    id?: number;
    upi?: string;
    owner?: string;
    address?: string;
    district?: string;
    province?: string;
    sector?: string;
    village?: string;
    cell?: string;
    country?: string;
    imgs?: string[];
    geographical_coordinate?: string;
    location_maps?: string;
  };
  landTenure?: {
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
    pictures?: string[];
  };
  building?: {
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
    pictures?: string[];
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

// Helper function to parse HTML content and extract text with proper formatting
function parseHtmlToText(html: string): string[] {
  if (!html) return [];
  
  // Split by major HTML elements and clean
  let sections = html
    .replace(/<h[1-6][^>]*>/gi, '\n\n**')
    .replace(/<\/h[1-6]>/gi, '**\n')
    .replace(/<li[^>]*>/gi, '\n• ')
    .replace(/<\/li>/gi, '')
    .replace(/<ol[^>]*>/gi, '\n')
    .replace(/<\/ol>/gi, '\n')
    .replace(/<ul[^>]*>/gi, '\n')
    .replace(/<\/ul>/gi, '\n')
    .replace(/<p[^>]*>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]*>/g, '') // Remove remaining HTML tags
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  return sections;
}

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id?.trim();
  if (!id) return NextResponse.json({ error: "Missing report ID" }, { status: 400 });

  // Fetch report from Supabase
  const { data, error } = await supabaseClient
    .from("reports")
    .select("report_data")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: "Failed to fetch report" }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Report not found" }, { status: 404 });

  const report = data.report_data as ReportData;

  try {
    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    let currentPage = pdfDoc.addPage();
    let { width, height } = currentPage.getSize();
    let y = height - 100; // Start lower to avoid header
    
    // Improved layout constants
    const pageMargin = 60; // Increased margin for better padding
    const contentWidth = width - (2 * pageMargin); // Equal left and right padding
    const lineHeight = 20; // Increased line height for better readability
    const sectionSpacing = 30; // Better section spacing
    const headerHeight = 85;
    const footerHeight = 90;
    const contentAreaHeight = height - headerHeight - footerHeight;

    // Load and embed the logo
    let logoImage = null;
    try {
      const logoUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/assets/logo_header.png`;
      logoImage = await fetchAndEmbedImage(pdfDoc, logoUrl);
    } catch (error) {
      console.log("Could not load logo image:", error);
    }

    // Improved Header function
    const addHeader = (page: any, pageNumber: number) => {
      if (logoImage) {
        const logoWidth = 80;
        const logoHeight = 40;
        page.drawImage(logoImage, {
          x: width - pageMargin - logoWidth,
          y: height - 50,
          width: logoWidth,
          height: logoHeight
        });
      }
      
      page.drawText("TOWER PROPERTY CONSULTANCY LTD", {
        x: pageMargin,
        y: height - 25,
        size: 16, // Consistent header font size
        font: boldFont,
        color: rgb(0.1, 0.2, 0.6)
      });
      
      page.drawText("VALUATION REPORT", {
        x: pageMargin,
        y: height - 42,
        size: 12,
        font: boldFont,
        color: rgb(0.1, 0.2, 0.6)
      });
      
      page.drawText("RESIDENTIAL PROPERTY", {
        x: pageMargin,
        y: height - 57,
        size: 10,
        font: font,
        color: rgb(0.1, 0.2, 0.6)
      });
      
      page.drawText(`Report ID: ${id}`, {
        x: width - 200,
        y: height - 65,
        size: 9, // Consistent header font size
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Header separator line
      page.drawLine({
        start: { x: pageMargin, y: height - headerHeight },
        end: { x: width - pageMargin, y: height - headerHeight },
        thickness: 2,
        color: rgb(0.1, 0.2, 0.6)
      });
    };

    // Improved Footer function
    const addFooter = (page: any, pageNumber: number) => {
      const footerY = footerHeight;
      
      // Footer separator line
      page.drawLine({
        start: { x: pageMargin, y: footerY + 45 },
        end: { x: width - pageMargin, y: footerY + 45 },
        thickness: 1,
        color: rgb(0.1, 0.2, 0.6)
      });

      page.drawText("Tel No: 0783520172, 0788474844, 0728520172; Email: towerpropertyconsultancy@gmail.com", {
        x: pageMargin,
        y: footerY + 25,
        size: 8, // Consistent footer font size
        font: font,
        color: rgb(0.1, 0.4, 0.8)
      });

      page.drawText("Address: Office No 03, 2nd Floor-GOLDEN PLAZA KG 11 AVE Behind BPR-Kimironko Branch, Kimironko, Kigali-Rwanda", {
        x: pageMargin,
        y: footerY + 12,
        size: 8,
        font: font,
        color: rgb(0.1, 0.4, 0.8)
      });

      page.drawText("Services: Property valuation, Property Management, Property brokerage, Property investment consultancy.", {
        x: pageMargin,
        y: footerY - 1,
        size: 8,
        font: font,
        color: rgb(0.1, 0.4, 0.8)
      });

      page.drawText(`Page ${pageNumber}`, {
        x: width / 2 - 20,
        y: footerY - 20,
        size: 9,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });

      page.drawText(new Date().toLocaleDateString(), {
        x: width - 100,
        y: footerY - 20,
        size: 9,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });
    };

    // Improved page check function
    const checkAndAddNewPage = (requiredSpace = 60) => {
      if (y < footerHeight + requiredSpace) {
        addFooter(currentPage, pdfDoc.getPageCount());
        currentPage = pdfDoc.addPage();
        ({ width, height } = currentPage.getSize());
        addHeader(currentPage, pdfDoc.getPageCount());
        y = height - headerHeight - 20; // Reset y position below header
        return true;
      }
      return false;
    };

    // Improved title writing function
    const writeTitle = (title: string, size = 16) => {
      checkAndAddNewPage(80);
      currentPage.drawText(title, {
        x: pageMargin,
        y: y,
        size: size, // Increased content font size
        font: boldFont,
        color: rgb(0, 0, 0.7)
      });
      y -= sectionSpacing;
    };

    // Improved text writing function with better word wrapping
    const writeText = (label: string, value: string, indent = 0, isBold = false) => {
      if (!value || value === "N/A") return;
      
      checkAndAddNewPage();
      
      const text = `${label}: ${value}`;
      const maxWidth = contentWidth - indent;
      const fontSize = 12; // Increased content font size
      const textFont = isBold ? boldFont : font;
      
      // Calculate text width and wrap if necessary
      const words = text.split(' ');
      let lines: string[] = [];
      let currentLine = '';
      
      for (const word of words) {
        const testLine = currentLine + word + ' ';
        const textWidth = textFont.widthOfTextAtSize(testLine, fontSize);
        
        if (textWidth > maxWidth && currentLine !== '') {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      }
      
      if (currentLine.trim()) {
        lines.push(currentLine.trim());
      }
      
      // Draw each line
      for (const line of lines) {
        checkAndAddNewPage();
        currentPage.drawText(line, {
          x: pageMargin + indent,
          y: y,
          size: fontSize,
          font: textFont
        });
        y -= lineHeight;
      }
    };

    // Function to write HTML content with proper formatting
    const writeHtmlContent = (label: string, htmlContent: string, indent = 0) => {
      if (!htmlContent) return;
      
      const sections = parseHtmlToText(htmlContent);
      if (sections.length === 0) return;
      
      // Write the main label if provided
      if (label) {
        checkAndAddNewPage();
        currentPage.drawText(`${label}:`, {
          x: pageMargin + indent,
          y: y,
          size: 12, // Increased content font size
          font: boldFont
        });
        y -= lineHeight + 5;
      }
      
      // Write each section
      for (let section of sections) {
        if (section.startsWith('**') && section.endsWith('**')) {
          // This is a header
          section = section.replace(/\*\*/g, '');
          checkAndAddNewPage(40);
          currentPage.drawText(section, {
            x: pageMargin + indent + 20,
            y: y,
            size: 13, // Increased content font size
            font: boldFont,
            color: rgb(0.2, 0.2, 0.7)
          });
          y -= lineHeight + 5;
        } else if (section.startsWith('• ')) {
          // This is a list item
          section = section.substring(2);
          writeText('', `• ${section}`, indent + 20);
        } else if (section.match(/^\d+\./)) {
          // This is a numbered list item
          writeText('', section, indent + 20);
        } else {
          // Regular paragraph
          writeText('', section, indent + 20);
        }
      }
      
      y -= 10; // Extra space after HTML content
    };

    // Function to handle arrays
    const writeArray = (label: string, values: string[] | string | undefined, indent = 0) => {
      if (!values) return;
      
      let arrayValues: string[] = [];
      
      if (typeof values === 'string') {
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
      writeText(label, arrayValues.join(", "), indent);
    };

    // Improved valuation table function
   // Improved valuation table function with reduced width
    const drawValuationTable = () => {
      if (!report.valuationTable) return;

      checkAndAddNewPage(200); // Ensure space for table
      writeTitle("12. COMPUTATION TABLE");
      
      // Table settings - REDUCED COLUMN WIDTHS
      const tableStartX = pageMargin;
      const colWidths = [90, 30, 30, 45, 45, 60, 40, 60]; // Reduced from [120, 40, 40, 60, 60, 80, 60, 80]
      const rowHeight = 25; // Increased row height
      const cellPadding = 2; // Reduced padding to fit more content
      
      // Helper function to draw table row
      const drawTableRow = (data: (string | number)[], yPos: number, isHeader = false) => {
        let currentX = tableStartX;
        
        for (let i = 0; i < data.length && i < colWidths.length; i++) {
          // Draw cell border
          currentPage.drawRectangle({
            x: currentX,
            y: yPos - rowHeight,
            width: colWidths[i],
            height: rowHeight,
            borderColor: rgb(0, 0, 0),
            borderWidth: 1,
            color: isHeader ? rgb(0.9, 0.9, 0.9) : undefined
          });
          
          // Draw text in cell
          const cellText = String(data[i] || '');
          const textSize = isHeader ? 10 : 9; // Reduced font size to fit narrower columns
          const textFont = isHeader ? boldFont : font;
          
          // Handle text wrapping in cells if needed
          const maxCellWidth = colWidths[i] - (2 * cellPadding);
          let displayText = cellText;
          
          if (textFont.widthOfTextAtSize(cellText, textSize) > maxCellWidth) {
            // Truncate with ellipsis if too long
            while (textFont.widthOfTextAtSize(displayText + '...', textSize) > maxCellWidth && displayText.length > 0) {
              displayText = displayText.slice(0, -1);
            }
            displayText += '...';
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

      // Draw main table
      let tableY = y;
      
      const mainHeaders = ['Description', 'Unit', 'Note', 'Quantity', 'Rate', 'Amount', 'Depr%', 'Net Value'];
      tableY = drawTableRow(mainHeaders, tableY, true);
      
      // Draw main building items
      if (report.valuationTable.main) {
        for (const row of report.valuationTable.main) {
          if (tableY < footerHeight + 60) {
            addFooter(currentPage, pdfDoc.getPageCount());
            currentPage = pdfDoc.addPage();
            ({ width, height } = currentPage.getSize());
            addHeader(currentPage, pdfDoc.getPageCount());
            y = height - headerHeight - 20;
            tableY = y;
            // Redraw headers on new page
            tableY = drawTableRow(mainHeaders, tableY, true);
          }
          tableY = drawTableRow(row, tableY);
        }
      }

      // Draw land value
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

      // Draw summary section
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
          size: 13, // Slightly reduced title font size
          font: boldFont,
          color: rgb(0, 0, 0.7)
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

    // COVER PAGE CREATION
    // Remove header/footer from cover page initially
    let pageNumber = 1;
    
    // Cover Page Title
    // currentPage = pdfDoc.addPage();
    // ({ width, height } = currentPage.getSize());
    // addHeader(currentPage, pageNumber);
    // y = height - headerHeight - 20;
    // currentPage.drawText("TOWER PROPERTY CONSULTANCY LTD", {
    //   x: pageMargin,
    //   y: height - 50,
    //   size: 20,
    //   font: boldFont,
    //   color: rgb(0.1, 0.2, 0.6)
    // });
    
    // currentPage.drawText("PROPERTY VALUATION REPORT", {
    //   x: pageMargin,
    //   y: height - 80,
    //   size: 16,
    //   font: boldFont,
    //   color: rgb(0.1, 0.2, 0.6)
    // });

    // y = height - 120;

    // Display property images on cover page
    addHeader(currentPage, pageNumber);
y = height - headerHeight - 20;
    const coverImages = report.property?.imgs || [];
    
    if (coverImages.length > 0) {
      // Main cover image
      const mainImageUrl = coverImages[0];
      const mainImage = await fetchAndEmbedImage(pdfDoc, mainImageUrl);
      
      if (mainImage) {
        const coverImageWidth = 400;
        const coverImageHeight = 250;
        const imageX = (width - coverImageWidth) / 2;
        
        currentPage.drawImage(mainImage, {
          x: imageX,
          y: y - coverImageHeight,
          width: coverImageWidth,
          height: coverImageHeight
        });
        
        y -= coverImageHeight + 40;
      }
      
      // Additional images in a row
      if (coverImages.length > 1) {
        const imagesPerRow = Math.min(3, coverImages.length - 1);
        const imageWidth = (contentWidth - 20) / imagesPerRow;
        const imageHeight = 120;
        let currentX = pageMargin;
        
        for (let i = 1; i <= imagesPerRow && i < coverImages.length; i++) {
          const imageUrl = coverImages[i];
          const embeddedImage = await fetchAndEmbedImage(pdfDoc, imageUrl);
          
          if (embeddedImage) {
            currentPage.drawImage(embeddedImage, {
              x: currentX,
              y: y - imageHeight,
              width: imageWidth - 10,
              height: imageHeight
            });
            currentX += imageWidth;
          }
        }
        y -= imageHeight + 30;
      }
    }

    // Property overview on cover page
    if (report.property) {
      currentPage.drawText("PROPERTY OVERVIEW", {
        x: pageMargin,
        y: y,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0.7)
      });
      y -= 30;
      
      const overviewItems = [
        { label: "Property Owner", value: report.property.owner || "N/A" },
        { label: "UPI Number", value: report.property.upi || "N/A" },
        { label: "Location", value: `${report.property.address || ''}, ${report.property.district || ''}, ${report.property.province || ''}`.replace(/^, |, $/g, '') || "N/A" },
        { label: "Village", value: report.property.village || "N/A" },
        { label: "Cell", value: report.property.cell || "N/A" },
        { label: "Sector", value: report.property.sector || "N/A" }
      ];
      
      for (const item of overviewItems) {
        currentPage.drawText(`${item.label}: ${item.value}`, {
          x: pageMargin + 20,
          y: y,
          size: 12,
          font: font
        });
        y -= 22;
      }
    }

    // Add valuation summary to cover page
    // if (report.valuationTable?.summary) {
    //   y -= 20;
    //   currentPage.drawText("VALUATION SUMMARY", {
    //     x: pageMargin,
    //     y: y,
    //     size: 14,
    //     font: boldFont,
    //     color: rgb(0, 0, 0.7)
    //   });
    //   y -= 25;
      
    //   for (const row of report.valuationTable.summary) {
    //     if (row[0] && row[7]) {
    //       const value = typeof row[7] === 'number' ? row[7].toLocaleString() : row[7];
    //       currentPage.drawText(`${row[0]}: RWF ${value}`, {
    //         x: pageMargin + 20,
    //         y: y,
    //         size: 12,
    //         font: font,
    //         color: rgb(0.2, 0.5, 0.2)
    //       });
    //       y -= 20;
    //     }
    //   }
    // }

    // Add footer to cover page
    addFooter(currentPage, pageNumber++);

    // START NEW PAGE FOR CONTENT
    currentPage = pdfDoc.addPage();
    ({ width, height } = currentPage.getSize());
    addHeader(currentPage, pageNumber);
    y = height - headerHeight - 20;

    // MAIN CONTENT SECTIONS (Following your specified order)

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

    // 6. DECLARATIONS
    checkAndAddNewPage(100);
    writeTitle("6. PROFESSIONAL DECLARATIONS");
    if (report.declaration) {
      if (report.declaration.techName) {
        writeText("Technician Valuer", report.declaration.techName, 20);
        writeText("Position", report.declaration.techPosition || "N/A", 20);
        writeText("Date", report.declaration.techDate || "N/A", 20);
        writeText("Statement", report.declaration.techStatement || "N/A", 20);
      }
      
      if (report.declaration.assistantName) {
        y -= 15;
        writeText("Assistant Valuer", report.declaration.assistantName, 20);
        writeText("Date", report.declaration.assistantDate || "N/A", 20);
        writeText("Statement", report.declaration.assistantStatement || "N/A", 20);
      }
      
      if (report.declaration.finalStatement) {
        y -= 15;
        writeText("Final Declaration", report.declaration.finalStatement, 20);
      }
    }

    // 7. PROPERTY LOCATION
    checkAndAddNewPage(100);
    writeTitle("7. PROPERTY LOCATION");
    if (report.property) {
      writeText("Property Owner", report.property.owner || "N/A", 20);
      writeText("UPI Number", report.property.upi || "N/A", 20);
      writeText("Address", report.property.address || "N/A", 20);
      writeText("Village", report.property.village || "N/A", 20);
      writeText("Cell", report.property.cell || "N/A", 20);
      writeText("Sector", report.property.sector || "N/A", 20);
      writeText("District", report.property.district || "N/A", 20);
      writeText("Province", report.property.province || "N/A", 20);
      writeText("Country", report.property.country || "N/A", 20);
      writeText("Geographical Coordinates", report.property.geographical_coordinate || "N/A", 20);
    }

    // 8. TENURE AND TENANCIES
    checkAndAddNewPage(100);
    writeTitle("8. TENURE AND TENANCIES");
    if (report.landTenure) {
      writeText("Tenure Type", report.landTenure.tenure || "N/A", 20);
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
      writeText("Site Name", report.siteWorks.site_name || "N/A", 20);
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
    const siteWorkImages = report.siteWorks?.pictures || [];
    
    if (siteWorkImages.length > 0) {
      y -= 20;
      currentPage.drawText("Site Work Photographs:", {
        x: pageMargin + 20,
        y: y,
        size: 14, // Increased content font size
        font: boldFont,
        color: rgb(0, 0, 0.6)
      });
      y -= 25;
      
      for (let i = 0; i < siteWorkImages.length; i++) {
        let imageUrl = siteWorkImages[i];
        
        // Parse JSON string if needed
        if (typeof imageUrl === 'string' && imageUrl.startsWith('[') && imageUrl.endsWith(']')) {
          try {
            const parsed = JSON.parse(imageUrl);
            imageUrl = Array.isArray(parsed) ? parsed[0] : imageUrl;
          } catch (e) {
            console.log("Failed to parse site work image URL as JSON:", e);
          }
        }
        
        const embeddedImage = await fetchAndEmbedImage(pdfDoc, imageUrl);
        
        if (embeddedImage) {
          checkAndAddNewPage(200);

          const imageWidth = 200; // Increased image size
          const imageHeight = 150;
          
          currentPage.drawText(`Site Work Photo ${i + 1}:`, {
            x: pageMargin + 20,
            y: y,
            size: 12, // Increased content font size
            font: font
          });
          y -= 20;

          currentPage.drawImage(embeddedImage, {
            x: pageMargin + 20,
            y: y - imageHeight,
            width: imageWidth,
            height: imageHeight
          });
          
          y -= imageHeight + 25;
        }
      }
    }

    // 10. BUILDING DETAILS
    checkAndAddNewPage(100);
    writeTitle("10. BUILDING DETAILS");
    if (report.building) {
      writeText("Building Name", report.building.house_name || "N/A", 20);
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
    const buildingImages = report.building?.pictures || [];
    
    if (buildingImages.length > 0) {
      y -= 20;
      currentPage.drawText("Building Photographs:", {
        x: pageMargin + 20,
        y: y,
        size: 14, // Increased content font size
        font: boldFont,
        color: rgb(0, 0, 0.6)
      });
      y -= 25;
      
      for (let i = 0; i < buildingImages.length; i++) {
        const imageUrl = buildingImages[i];
        const embeddedImage = await fetchAndEmbedImage(pdfDoc, imageUrl);
        
        if (embeddedImage) {
          checkAndAddNewPage(200);

          const imageWidth = 200; // Increased image size
          const imageHeight = 150;
          
          currentPage.drawText(`Building Photo ${i + 1}:`, {
            x: pageMargin + 20,
            y: y,
            size: 12, // Increased content font size
            font: font
          });
          y -= 20;

          currentPage.drawImage(embeddedImage, {
            x: pageMargin + 20,
            y: y - imageHeight,
            width: imageWidth,
            height: imageHeight
          });
          
          y -= imageHeight + 25;
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
    return NextResponse.json({ 
      error: "Failed to generate PDF", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}