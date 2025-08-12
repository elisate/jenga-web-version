import { pdf } from "@react-pdf/renderer";
import { NextRequest, NextResponse } from "next/server";
import { generateValuationPDF } from "../../../lib/pdf-generator";
import { createClientServer } from "../../../lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { valuationId } = await request.json();

    if (!valuationId) {
      return NextResponse.json(
        { error: "Valuation ID is required" },
        { status: 400 }
      );
    }

    // Create Supabase client
    const supabase = await createClientServer();

    // Fetch valuation data with property and valuation_data
    const { data: valuation, error: valuationError } = await supabase
      .from("valuations")
      .select(
        `
        *,
        property:properties(*),
        valuation_data(*)
      `
      )
      .eq("id", parseInt(valuationId))
      .single();

    if (valuationError || !valuation) {
      return NextResponse.json(
        { error: "Valuation not found" },
        { status: 404 }
      );
    }

    // Ensure valuation_data is properly sorted
    if (valuation.valuation_data) {
      valuation.valuation_data.sort(
        (a: any, b: any) => a.display_order - b.display_order
      );
    }

    // Generate PDF
    const doc = generateValuationPDF(valuation);
    const pdfStream = await pdf(doc).toBlob();
    const arrayBuffer = await pdfStream.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    // Create filename
    const fileName = `valuation-${valuationId}-${valuation.property.upi}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const valuationId = searchParams.get("id");

  if (!valuationId) {
    return NextResponse.json(
      { error: "Valuation ID is required" },
      { status: 400 }
    );
  }

  try {
    // Create Supabase client
    const supabase = await createClientServer();

    // Fetch valuation data with property and valuation_data
    const { data: valuation, error: valuationError } = await supabase
      .from("valuations")
      .select(
        `
        *,
        property:properties(*),
        valuation_data(*)
      `
      )
      .eq("id", parseInt(valuationId))
      .single();

    if (valuationError || !valuation) {
      return NextResponse.json(
        { error: "Valuation not found" },
        { status: 404 }
      );
    }

    // Ensure valuation_data is properly sorted
    if (valuation.valuation_data) {
      valuation.valuation_data.sort(
        (a: any, b: any) => a.display_order - b.display_order
      );
    }

    // Generate PDF
    const doc = generateValuationPDF(valuation);
    const pdfStream = await pdf(doc).toBlob();
    const arrayBuffer = await pdfStream.arrayBuffer();
    const pdfBuffer = Buffer.from(arrayBuffer);

    // Create filename
    const fileName = `valuation-${valuationId}-${valuation.property.upi}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${fileName}"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}
