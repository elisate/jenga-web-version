import { NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function GET() {
  let browser;

  try {
    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();

    // Base URL of your Next.js app (adjust or add in .env.local)
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    // Navigate to your report page
    await page.goto(`${baseUrl}/valuation-report`, {
      waitUntil: "networkidle0",
    });

    // Generate PDF buffer
    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "20px", bottom: "20px", left: "20px", right: "20px" },
    });

    // Return PDF response with proper headers
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "attachment; filename=valuation-report.pdf",
      },
    });
  } catch (error) {
    // Log error to server console for debugging
    console.error("Puppeteer PDF generation error:", error);

    // Return 500 Internal Server Error to client
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    // Close browser if it was launched
    if (browser) {
      await browser.close();
    }
  }
}
