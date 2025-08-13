import { saveReport } from "@/Reporting/finalReport";

export const handleDownloadPdf = async (
  evaluationId: number,
  evaluationData: any
) => {
  if (!evaluationId || !evaluationData) {
    alert("Evaluation data is not loaded yet.");
    return;
  }

  try {
    const savedReport = await saveReport(evaluationId, evaluationData);
    alert(`Report saved successfully! Report ID: ${savedReport.id}`);

    // TODO: Add your PDF generation logic here, e.g.,
    // generatePdf(evaluationData);

  } catch (error: any) {
    alert("Failed to save report: " + (error.message || error));
  }
};
