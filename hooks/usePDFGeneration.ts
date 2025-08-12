import { useState } from "react";
import { toast } from "sonner";

interface UsePDFGenerationProps {
  valuationId: number;
}

export const usePDFGeneration = ({ valuationId }: UsePDFGenerationProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async (download: boolean = false) => {
    setIsGenerating(true);

    try {
      const url = download
        ? "/api/valuationpdf"
        : `/api/valuationpdf?id=${valuationId}`;

      const options: RequestInit = download
        ? {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ valuationId }),
          }
        : {
            method: "GET",
          };

      const response = await fetch(url, options);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate PDF");
      }

      // Get the blob from response
      const blob = await response.blob();

      if (download) {
        // Create download link
        const downloadUrl = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `valuation-${valuationId}-${
          new Date().toISOString().split("T")[0]
        }.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(downloadUrl);

        toast.success("PDF downloaded successfully!");
      } else {
        // Preview in new tab
        const previewUrl = URL.createObjectURL(blob);
        window.open(previewUrl, "_blank");

        // Clean up after a delay
        setTimeout(() => {
          URL.revokeObjectURL(previewUrl);
        }, 1000);

        toast.success("PDF opened in new tab!");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate PDF"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPDF = () => generatePDF(true);
  const previewPDF = () => generatePDF(false);

  return {
    isGenerating,
    downloadPDF,
    previewPDF,
    generatePDF,
  };
};

export default usePDFGeneration;
