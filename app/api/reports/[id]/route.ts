import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { supabaseClient } from "@/lib/supabase/client";

// Full report type
type ReportData = {
  instructions?: {
    verbalInstructions?: string;
    writtenInstructions?: string;
    date?: string;
    inspectedBy?: string;
    purposes?: string[];
  };
  property?: {
    owner?: string;
    upi?: string;
    district?: string;
    province?: string;
    sector?: string;
    village?: string;
  };
  landTenure?: {
    tenure?: string;
    occupancy?: string;
    nla_zoning?: string;
    plot_size_sqm?: number;
    land_current_use?: string;
  };
  siteWorks?: {
    walls?: string[];
    lighting?: string[];
    access_types?: string[];
    supply_types?: string[];
  };
  building?: {
    house_name?: string;
    condition?: string;
    doors?: string[];
    windows?: string[];
    flooring?: string[];
  };
};

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

  // Create PDF
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

  let y = height - 50;

  const writeText = (label: string, value: string) => {
    page.drawText(`${label}: ${value}`, { x: 50, y, size: 12, font });
    y -= 18;
  };

  page.drawText("Property Valuation Report", { x: 50, y, size: 18, font });
  y -= 30;

  // Instructions
  if (report.instructions) {
    writeText("Verbal Instructions", report.instructions.verbalInstructions || "N/A");
    writeText("Written Instructions", report.instructions.writtenInstructions || "N/A");
    writeText("Date", report.instructions.date || "N/A");
    writeText("Inspected By", report.instructions.inspectedBy || "N/A");
    if (report.instructions.purposes) writeText("Purposes", report.instructions.purposes.join(", "));
    y -= 10;
  }

  // Property
  if (report.property) {
    writeText("Owner", report.property.owner || "N/A");
    writeText("UPI", report.property.upi || "N/A");
    writeText("District", report.property.district || "N/A");
    writeText("Province", report.property.province || "N/A");
    writeText("Sector", report.property.sector || "N/A");
    writeText("Village", report.property.village || "N/A");
    y -= 10;
  }

  // Land Tenure
  if (report.landTenure) {
    writeText("Tenure", report.landTenure.tenure || "N/A");
    writeText("Occupancy", report.landTenure.occupancy || "N/A");
    writeText("Zoning", report.landTenure.nla_zoning || "N/A");
    writeText("Plot Size", report.landTenure.plot_size_sqm?.toString() || "0 sqm");
    writeText("Land Use", report.landTenure.land_current_use || "N/A");
    y -= 10;
  }

  // Site Works
  if (report.siteWorks) {
    writeText("Walls", (report.siteWorks.walls || []).join(", ") || "N/A");
    writeText("Lighting", (report.siteWorks.lighting || []).join(", ") || "N/A");
    writeText("Access Types", (report.siteWorks.access_types || []).join(", ") || "N/A");
    writeText("Supply Types", (report.siteWorks.supply_types || []).join(", ") || "N/A");
    y -= 10;
  }

  // Building
  if (report.building) {
    writeText("House Name", report.building.house_name || "N/A");
    writeText("Condition", report.building.condition || "N/A");
    writeText("Doors", (report.building.doors || []).join(", ") || "N/A");
    writeText("Windows", (report.building.windows || []).join(", ") || "N/A");
    writeText("Flooring", (report.building.flooring || []).join(", ") || "N/A");
  }

  const pdfBytes = await pdfDoc.save();

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="report-${id}.pdf"`,
    },
  });
}
