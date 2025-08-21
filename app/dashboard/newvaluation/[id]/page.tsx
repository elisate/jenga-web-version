"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEvaluationDetailsById } from "@/Reporting/evaluationDetail";
import { saveReport } from "@/Reporting/finalReport";

// Import components
import Instructions, { InstructionsData } from "@/components/evaluation/Instructions";
import DefinitionOfValues from "@/components/evaluation/DefinitionOfValues";
import BasisOfValuation from "@/components/evaluation/BasisOfValuation";
import LimitingCondition from "@/components/evaluation/LimitingCondition";
import Assumptions from "@/components/evaluation/Assumptions";
import Declaration, { DeclarationData } from "@/components/evaluation/Declaration";
import PropertyLocation from "@/components/evaluation/PropertyLocation";
import TenureTenanciesPlot from "@/components/evaluation/TenureTenanciesPlot";
import ServiceSiteWorks from "@/components/evaluation/ServiceSiteWorks";
import Buildings from "@/components/evaluation/Buildings";
import GeneralRemarks from "@/components/evaluation/GeneralRemarks";
import ValuationComputationTable from "@/components/evaluation/ValuationComputationTable";

interface ReportData {
  instructions: InstructionsData;
  definitionOfValues: string;
  basisOfValuation: string;
  limitingCondition: string;
  assumptions: string;
  declaration: DeclarationData;
  property: any;
  landTenure: any;
  siteWorks: any;
  building: any;
  generalRemarks: string;
  valuationTable: any;
  user?: any;
  createdAt?: string | null;
}

export default function ValuationReport() {
  const { id } = useParams();
  const evaluationId = Number(id);

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchEvaluation() {
      setLoading(true);
      try {
        const data = await getEvaluationDetailsById(evaluationId);

        const declaration: DeclarationData = {
          techName: data?.user ? `${data.user.first_name ?? ""} ${data.user.last_name ?? ""}` : "_________",
          techPosition: data?.user?.title || "n/a",
          techDate: "",
          techSignature: data?.user?.signature || null,
          techStatement: data?.user?.declaration_content || "",
          assistantName: "",
          assistantDate: "",
          assistantSignature: null,
          assistantStatement: "",
          finalStatement: "",
          finalSignature: null,
        };

        setReportData({
          instructions: {
            verbalInstructions: data?.property?.owner || "—",
            writtenInstructions: `${data?.user?.first_name ?? ""} ${data?.user?.last_name ?? ""}`.trim() || "—",
            date: data?.property?.created_at || new Date().toISOString().split("T")[0],
            purposes: Array.isArray(data?.property?.bank_purpose)
              ? data.property.bank_purpose
              : data?.property?.bank_purpose
              ? [data.property.bank_purpose]
              : ["Bank purposes"],
            inspectedDate: data?.created_at || new Date().toISOString().split("T")[0],
            inspectedBy: `${data?.user?.first_name ?? ""} ${data?.user?.last_name ?? ""}`.trim() || "—",
          },
          definitionOfValues: "",
          basisOfValuation: "",
          limitingCondition: "",
          assumptions: "",
          declaration,
          property: data?.property || {},
          landTenure: data?.landTenure || {},
          siteWorks: data?.siteWorks || {},
          building: data?.building || null,
          generalRemarks: "",
          valuationTable: {},
          user: data?.user || null,
          createdAt: data?.created_at || null,
        });
      } catch (err) {
        console.error("Error fetching evaluation details:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!isNaN(evaluationId)) fetchEvaluation();
  }, [evaluationId]);

  if (loading) return <p>Loading...</p>;
  if (!reportData) return <p>No evaluation data found.</p>;

  const handleSaveReport = async () => {
    if (saving) return;

    // ✅ Validation to avoid "not submitted please"
    if (!reportData.instructions.verbalInstructions || !reportData.instructions.writtenInstructions) {
      alert("Please fill in all instruction fields before saving.");
      return;
    }

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

  const updateReport = <K extends keyof ReportData>(key: K, value: ReportData[K]) => {
    setReportData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <button
  onClick={handleSaveReport}
  disabled={saving}
  className={`px-4 py-2 text-white rounded ${
    saving ? "bg-gray-400 cursor-not-allowed" : "bg-violet-600 hover:bg-violet-700"
  }`}
>
  {saving ? "Saving..." : "Save Report"}
</button>

      <Instructions
        value={reportData.instructions}
        property={reportData.property}
        user={reportData.user}
        evaluationCreatedAt={reportData.createdAt ?? undefined}
        onChange={(val) => updateReport("instructions", val)}
      />

      <DefinitionOfValues value={reportData.definitionOfValues} onChange={(val) => updateReport("definitionOfValues", val)} />
      <BasisOfValuation value={reportData.basisOfValuation} onChange={(val) => updateReport("basisOfValuation", val)} />
      <LimitingCondition value={reportData.limitingCondition} onChange={(val) => updateReport("limitingCondition", val)} />
      <Assumptions value={reportData.assumptions} onChange={(val) => updateReport("assumptions", val)} />
      <Declaration user={reportData.user ?? null} value={reportData.declaration} onChange={(val) => updateReport("declaration", val)} createdAt={reportData.createdAt} />
      <PropertyLocation property={reportData.property} onChange={(val) => updateReport("property", val)} />
      <TenureTenanciesPlot
        landTenure={reportData.landTenure}
        owners={reportData.property?.owners || []}
        onChange={(landTenure, owners) =>
          setReportData((prev) => prev ? { ...prev, landTenure, property: { ...prev.property, owners } } : prev)
        }
      />
      <ServiceSiteWorks siteWorks={reportData.siteWorks} onChange={(val) => updateReport("siteWorks", val)} />
      <Buildings data={reportData.building} onChange={(val) => setReportData((prev: any) => ({ ...prev, building: val }))} />
      <GeneralRemarks value={reportData.generalRemarks} onChange={(val) => updateReport("generalRemarks", val)} />
      <ValuationComputationTable value={reportData.valuationTable} onChange={(val) => updateReport("valuationTable", val)} />
    </div>
  );
}
