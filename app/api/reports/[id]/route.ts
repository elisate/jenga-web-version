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
  valuationTable?: any;
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
    let y = height - 80; // Start below header
    const pageMargin = 50;
    const lineHeight = 16;
    const sectionSpacing = 25;

    // Header and Footer functions
    const addHeader = (page: any, pageNumber: number) => {
      page.drawText("PROPERTY VALUATION REPORT", {
        x: pageMargin,
        y: height - 30,
        size: 16,
        font: boldFont,
        color: rgb(0, 0, 0.8)
      });
      
      page.drawText(`Report ID: ${id}`, {
        x: width - 150,
        y: height - 30,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });

      // Draw line under header
      page.drawLine({
        start: { x: pageMargin, y: height - 45 },
        end: { x: width - pageMargin, y: height - 45 },
        thickness: 1,
        color: rgb(0, 0, 0.8)
      });
    };

    const addFooter = (page: any, pageNumber: number) => {
      const footerY = 30;
      
      // Draw line above footer
      page.drawLine({
        start: { x: pageMargin, y: footerY + 15 },
        end: { x: width - pageMargin, y: footerY + 15 },
        thickness: 1,
        color: rgb(0, 0, 0.8)
      });

      page.drawText(`Page ${pageNumber}`, {
        x: width / 2 - 20,
        y: footerY,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });

      page.drawText(new Date().toLocaleDateString(), {
        x: width - 100,
        y: footerY,
        size: 10,
        font: font,
        color: rgb(0.5, 0.5, 0.5)
      });
    };

    // Add new page when needed
    const checkAndAddNewPage = () => {
      if (y < 80) {
        addFooter(currentPage, pdfDoc.getPageCount());
        currentPage = pdfDoc.addPage();
        ({ width, height } = currentPage.getSize());
        addHeader(currentPage, pdfDoc.getPageCount());
        y = height - 80;
      }
    };

    // Text writing functions
    const writeTitle = (title: string) => {
      checkAndAddNewPage();
      currentPage.drawText(title, {
        x: pageMargin,
        y: y,
        size: 14,
        font: boldFont,
        color: rgb(0, 0, 0.7)
      });
      y -= sectionSpacing;
    };

    const writeText = (label: string, value: string, indent = 0) => {
      if (!value || value === "N/A") return;
      
      checkAndAddNewPage();
      
      const text = `${label}: ${value}`;
      const maxWidth = width - pageMargin * 2 - indent;
      
      // Handle text wrapping for long content
      if (text.length > 80) {
        const words = text.split(' ');
        let line = '';
        
        for (const word of words) {
          const testLine = line + word + ' ';
          if (testLine.length > 80 && line !== '') {
            currentPage.drawText(line.trim(), {
              x: pageMargin + indent,
              y: y,
              size: 10,
              font: font
            });
            y -= lineHeight;
            checkAndAddNewPage();
            line = word + ' ';
          } else {
            line = testLine;
          }
        }
        
        if (line.trim()) {
          currentPage.drawText(line.trim(), {
            x: pageMargin + indent,
            y: y,
            size: 10,
            font: font
          });
          y -= lineHeight;
        }
      } else {
        currentPage.drawText(text, {
          x: pageMargin + indent,
          y: y,
          size: 10,
          font: font
        });
        y -= lineHeight;
      }
    };

    const writeArray = (label: string, values: string[] | string | undefined, indent = 0) => {
      if (!values) return;
      
      let arrayValues: string[] = [];
      
      if (typeof values === 'string') {
        try {
          // Try to parse as JSON array
          const parsed = JSON.parse(values);
          if (Array.isArray(parsed)) {
            arrayValues = parsed;
          } else {
            // If it's just a string, treat as single item
            arrayValues = [values];
          }
        } catch {
          // If parsing fails, treat as single string
          arrayValues = [values];
        }
      } else if (Array.isArray(values)) {
        arrayValues = values;
      } else {
        return; // Skip if not string or array
      }
      
      if (arrayValues.length === 0) return;
      writeText(label, arrayValues.join(", "), indent);
    };

    // Add first page header
    addHeader(currentPage, 1);

    // Report Title
    currentPage.drawText("PROPERTY VALUATION REPORT", {
      x: pageMargin,
      y: y,
      size: 20,
      font: boldFont,
      color: rgb(0, 0, 0.8)
    });
    y -= 40;

    // 1. INSTRUCTIONS SECTION
    writeTitle("1. VALUATION INSTRUCTIONS");
    if (report.instructions) {
      writeText("Verbal Instructions", report.instructions.verbalInstructions || "N/A", 20);
      writeText("Written Instructions", report.instructions.writtenInstructions || "N/A", 20);
      writeText("Inspection Date", report.instructions.inspectedDate || "N/A", 20);
      writeText("Inspected By", report.instructions.inspectedBy || "N/A", 20);
      writeText("Report Date", report.instructions.date || "N/A", 20);
      writeArray("Purposes", report.instructions.purposes, 20);
    }
    y -= sectionSpacing;

    // 2. PROPERTY DETAILS SECTION
    writeTitle("2. PROPERTY DETAILS");
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
    y -= sectionSpacing;

    // 3. LAND TENURE SECTION
    writeTitle("3. LAND TENURE INFORMATION");
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
    y -= sectionSpacing;

    // 4. SITE WORKS SECTION
    writeTitle("4. SITE WORKS & IMPROVEMENTS");
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
    y -= sectionSpacing;

    // 5. BUILDING SECTION
    writeTitle("5. BUILDING DETAILS");
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
    y -= sectionSpacing;

    // 6. VALUATION BASIS & METHODOLOGY
    writeTitle("6. VALUATION BASIS & METHODOLOGY");
    writeText("Definition of Values", report.definitionOfValues || "N/A", 20);
    writeText("Basis of Valuation", report.basisOfValuation || "N/A", 20);
    writeText("Limiting Conditions", report.limitingCondition || "N/A", 20);
    writeText("Key Assumptions", report.assumptions || "N/A", 20);
    y -= sectionSpacing;

    // 7. GENERAL REMARKS
    if (report.generalRemarks) {
      writeTitle("7. GENERAL REMARKS");
      writeText("Remarks", report.generalRemarks, 20);
      y -= sectionSpacing;
    }

    // 8. PROPERTY IMAGES
    const allImages = [
      ...(report.property?.imgs || []),
      ...(report.siteWorks?.pictures || []),
      ...(report.building?.pictures || [])
    ];

    if (allImages.length > 0) {
      writeTitle("8. PROPERTY PHOTOGRAPHS");
      
      for (let i = 0; i < allImages.length; i++) {
        const imageUrl = allImages[i];
        const embeddedImage = await fetchAndEmbedImage(pdfDoc, imageUrl);
        
        if (embeddedImage) {
          // Check if we need a new page for the image
          if (y < 250) {
            addFooter(currentPage, pdfDoc.getPageCount());
            currentPage = pdfDoc.addPage();
            ({ width, height } = currentPage.getSize());
            addHeader(currentPage, pdfDoc.getPageCount());
            y = height - 80;
          }

          const imageWidth = 200;
          const imageHeight = 150;
          
          currentPage.drawText(`Photo ${i + 1}:`, {
            x: pageMargin,
            y: y,
            size: 10,
            font: boldFont
          });
          y -= 20;

          currentPage.drawImage(embeddedImage, {
            x: pageMargin,
            y: y - imageHeight,
            width: imageWidth,
            height: imageHeight
          });
          
          y -= imageHeight + 20;
        }
      }
      y -= sectionSpacing;
    }

    // 9. DECLARATIONS
    writeTitle("9. PROFESSIONAL DECLARATIONS");
    if (report.declaration) {
      if (report.declaration.techName) {
        writeText("Technician Valuer", report.declaration.techName, 20);
        writeText("Position", report.declaration.techPosition || "N/A", 20);
        writeText("Date", report.declaration.techDate || "N/A", 20);
        writeText("Statement", report.declaration.techStatement || "N/A", 20);
        y -= 10;
      }
      
      if (report.declaration.assistantName) {
        writeText("Assistant Valuer", report.declaration.assistantName, 20);
        writeText("Date", report.declaration.assistantDate || "N/A", 20);
        writeText("Statement", report.declaration.assistantStatement || "N/A", 20);
        y -= 10;
      }
      
      if (report.declaration.finalStatement) {
        writeText("Final Declaration", report.declaration.finalStatement, 20);
      }
    }

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