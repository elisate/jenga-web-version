"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEvaluationDetailsById } from "@/Reporting/evaluationDetail";
import { saveReport } from "@/Reporting/finalReport";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

import Instructions from "@/components/evaluation/Instructions";
import DefinitionOfValues from "@/components/evaluation/DefinitionOfValues";
import BasisOfValuation from "@/components/evaluation/BasisOfValuation";
import LimitingCondition from "@/components/evaluation/LimitingCondition";
import Assumptions from "@/components/evaluation/Assumptions";
import PropertyLocation from "@/components/evaluation/PropertyLocation";
import TenureTenanciesPlot from "@/components/evaluation/TenureTenanciesPlot";
import ServiceSiteWorks from "@/components/evaluation/ServiceSiteWorks";
import Buildings from "@/components/evaluation/Buildings";
import GeneralRemarks from "@/components/evaluation/GeneralRemarks";
import ValuationComputationTable from "@/components/evaluation/ValuationComputationTable";
import Declaration from "@/components/evaluation/Declaration";

// Reusable PDF generator function
const generatePdf = (evaluationId: number, data: any) => {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("Valuation Report", 10, y);
  y += 12;

  doc.setFontSize(12);
  doc.text(`Evaluation ID: ${evaluationId}`, 10, y);
  y += 10;

  // Property Location
  if (data?.property?.location) {
    doc.text(`Property Location: ${data.property.location}`, 10, y);
    y += 10;
  }

  // Owners Table
  if (data?.property?.owners?.length) {
    doc.text("Owners:", 10, y);
    y += 6;

    const ownersTableData = data.property.owners.map((owner: any, idx: number) => [
      idx + 1,
      owner.name || "-",
      owner.share || "-",
      owner.idNumber || "-"
    ]);

    autoTable(doc, {
      startY: y,
      head: [["#", "Name", "Share", "ID Number"]],
      body: ownersTableData,
      margin: { left: 10, right: 10 },
      styles: { fontSize: 10 },
      headStyles: { fillColor: [41, 128, 185] }
    });

    y = (doc as any).lastAutoTable?.finalY + 10 || y + 10;
  }

  // Land Tenure
  if (data?.landTenure?.tenure) {
    doc.text(`Land Tenure: ${data.landTenure.tenure}`, 10, y);
    y += 10;
  }

  // Assumptions as bullet points
  if (data?.assumptions && Array.isArray(data.assumptions) && data.assumptions.length > 0) {
    doc.text("Assumptions:", 10, y);
    y += 8;

    data.assumptions.forEach((item: string) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(`- ${item}`, 15, y);
      y += 6;
    });
    y += 6;
  }

  // Buildings list
  if (data?.building && Array.isArray(data.building) && data.building.length > 0) {
    doc.text("Buildings:", 10, y);
    y += 8;

    data.building.forEach((building: any, idx: number) => {
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
      doc.text(`${idx + 1}. ${building.name || "Unnamed Building"}`, 15, y);
      y += 6;
    });
  }

  // Add other sections as needed...

  doc.save(`valuation-report-${evaluationId}.pdf`);
};

export default function ValuationReport() {
  const { id } = useParams();
  const evaluationId = Number(id);

  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchEvaluation() {
      setLoading(true);
      try {
        const data = await getEvaluationDetailsById(evaluationId);
        setEvaluationData(data);
      } catch (err) {
        console.error("Error fetching evaluation details:", err);
      } finally {
        setLoading(false);
      }
    }
    if (evaluationId) fetchEvaluation();
  }, [evaluationId]);

  if (loading) return <p>Loading...</p>;
  if (!evaluationData) return <p>No evaluation data found.</p>;

  const handleDownloadPdf = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const savedReport = await saveReport(evaluationId, evaluationData);
      alert(`Report saved successfully! Report ID: ${savedReport.id}`);

      generatePdf(evaluationId, evaluationData);
    } catch (error: any) {
      alert("Failed to save report: " + (error.message || error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={handleDownloadPdf}
        disabled={saving}
        className={`mb-4 px-4 py-2 text-white rounded ${
          saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saving ? "Saving..." : "Download PDF"}
      </button>

      <Instructions />
      <DefinitionOfValues />
      <BasisOfValuation />
      <LimitingCondition />
      <Assumptions />
      <Declaration />

      <PropertyLocation property={evaluationData.property} />

      <TenureTenanciesPlot
        landTenure={evaluationData.landTenure ?? null}
        owners={evaluationData.property?.owners ?? []}
      />

      <ServiceSiteWorks siteWorks={evaluationData.siteWorks ?? null} />
      <Buildings data={evaluationData.building ?? null} />
      <GeneralRemarks />
      <ValuationComputationTable />
    </div>
  );
}
