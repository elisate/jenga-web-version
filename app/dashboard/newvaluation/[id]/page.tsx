"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEvaluationDetailsById } from "@/Reporting/evaluationDetail";
import { saveReport } from "@/Reporting/finalReport";

// Import all your reusable sections
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

export default function ValuationReport() {
  const { id } = useParams();
  const evaluationId = Number(id);

  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchEvaluation() {
      setLoading(true);
      try {
        const data = await getEvaluationDetailsById(evaluationId);
        setReportData({
          instructions: "",
          definitionOfValues: "",
          basisOfValuation: "",
          limitingCondition: "",
          assumptions: [],
          declaration: "",
          property: data?.property || {},
          landTenure: data?.landTenure || {},
          siteWorks: data?.siteWorks || {},
          building: data?.building || [],
          generalRemarks: "",
          valuationTable: {}
        });
      } catch (err) {
        console.error("Error fetching evaluation details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (evaluationId) fetchEvaluation();
  }, [evaluationId]);

  if (loading) return <p>Loading...</p>;
  if (!reportData) return <p>No evaluation data found.</p>;

  const handleSaveReport = async () => {
    if (saving) return;
    setSaving(true);
    try {
      const savedReport = await saveReport(evaluationId, reportData);
      alert(`Report saved successfully! Report ID: ${savedReport.id}`);
    } catch (error: any) {
      alert("Failed to save report: " + (error.message || error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={handleSaveReport}
        disabled={saving}
        className={`mb-4 px-4 py-2 text-white rounded ${
          saving ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {saving ? "Saving..." : "Save Report"}
      </button>

      <Instructions
        value={reportData.instructions}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, instructions: val }))}
      />

      <DefinitionOfValues
        value={reportData.definitionOfValues}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, definitionOfValues: val }))}
      />

      <BasisOfValuation
        value={reportData.basisOfValuation}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, basisOfValuation: val }))}
      />

      <LimitingCondition
        value={reportData.limitingCondition}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, limitingCondition: val }))}
      />

      <Assumptions
        value={reportData.assumptions}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, assumptions: val }))}
      />

      <Declaration
        value={reportData.declaration}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, declaration: val }))}
      />

      <PropertyLocation
        property={reportData.property}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, property: val }))}
      />

      <TenureTenanciesPlot
        landTenure={reportData.landTenure}
        owners={reportData.property?.owners || []}
        onChange={(landTenure, owners) =>
          setReportData((prev: any) => ({
            ...prev,
            landTenure,
            property: { ...prev.property, owners }
          }))
        }
      />

      <ServiceSiteWorks
        siteWorks={reportData.siteWorks}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, siteWorks: val }))}
      />

      <Buildings
        data={reportData.building}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, building: val }))}
      />

      <GeneralRemarks
        value={reportData.generalRemarks}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, generalRemarks: val }))}
      />

      <ValuationComputationTable
        value={reportData.valuationTable}
        onChange={(val) => setReportData((prev: any) => ({ ...prev, valuationTable: val }))}
      />
    </div>
  );
}
