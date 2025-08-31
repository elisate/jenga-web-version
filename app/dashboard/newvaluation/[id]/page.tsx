"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEvaluationDetailsById } from "@/Reporting/evaluationDetail";
import { saveReport } from "@/Reporting/finalReport";
import { 
  FileText, 
  Download, 
  Save, 
  ArrowLeft,
  CheckCircle,
  Loader2
} from "lucide-react";
import Link from "next/link";

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

// ✅ Helper: always return YYYY-MM-DD
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

export default function ValuationReport() {
  const { id } = useParams();
  const evaluationId = Number(id);

  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reportSaved, setReportSaved] = useState(false);
  const [savedReportId, setSavedReportId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvaluation() {
      setLoading(true);
      try {
        const data = await getEvaluationDetailsById(evaluationId);

        const declaration: DeclarationData = {
          techName: data?.user
            ? `${data.user.first_name ?? ""} ${data.user.last_name ?? ""}`.trim()
            : "_________",
          techPosition: data?.user?.title || "n/a",
          techDate: formatDate(data?.created_at || new Date().toISOString()), // ✅ fill date
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
            writtenInstructions:
              `${data?.user?.first_name ?? ""} ${data?.user?.last_name ?? ""}`.trim() || "—",
            date: formatDate(data?.property?.created_at || new Date().toISOString()),
            purpose: Array.isArray(data?.property?.purpose)
              ? data.property.purpose
              : data?.property?.purpose
              ? [data.property.purpose]
              : ["Purpose"], // ✅ fallback
            inspectedDate: formatDate(data?.created_at || new Date().toISOString()),
            inspectedBy:
              `${data?.user?.first_name ?? ""} ${data?.user?.last_name ?? ""}`.trim() || "—",
            bank_name: data?.property?.bank_name || "—",
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-6 h-6 text-violet-600 animate-spin" />
        <span className="ml-2 text-gray-600">Loading report...</span>
      </div>
    );
  }

  if (!reportData) return <p className="text-center mt-10">No evaluation data found.</p>;

  const handleSaveReport = async () => {
    if (saving) return;

    // ✅ Basic validation
    if (
      !reportData.instructions.verbalInstructions ||
      !reportData.instructions.writtenInstructions
    ) {
      alert("Please fill in all instruction fields before saving.");
      return;
    }

    setSaving(true);
    try {
      const savedReport = await saveReport(evaluationId, reportData);
      setSavedReportId(savedReport.id);
      setReportSaved(true);
      alert(`Report saved successfully! Report ID: ${savedReport.id}`);
    } catch (error: any) {
      alert("Failed to save report: " + (error.message || error));
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadReport = async () => {
    if (!savedReportId) return;
    
    try {
      const res = await fetch(`/api/reports/${savedReportId}`);
      if (!res.ok) throw new Error("Failed to download PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `valuation-report-${savedReportId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      alert("Error downloading PDF");
    }
  };

  const updateReport = <K extends keyof ReportData>(key: K, value: ReportData[K]) => {
    setReportData((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard/evaluations"
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-3 rounded-xl">
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Valuation Report #{evaluationId}
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {reportData.property?.address || "Property Evaluation Report"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-3">
              {reportSaved && (
                <div className="flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                  <CheckCircle className="w-4 h-4" />
                  Report Saved
                </div>
              )}
              <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                <FileText className="w-4 h-4" />
                Draft
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-6">
        <Instructions
          value={reportData.instructions}
          property={reportData.property}
          user={reportData.user}
          evaluationCreatedAt={reportData.createdAt ?? undefined}
          onChange={(val) => updateReport("instructions", val)}
        />

        <DefinitionOfValues
          value={reportData.definitionOfValues}
          onChange={(val) => updateReport("definitionOfValues", val)}
        />
        <BasisOfValuation
          value={reportData.basisOfValuation}
          onChange={(val) => updateReport("basisOfValuation", val)}
        />
        <LimitingCondition
          value={reportData.limitingCondition}
          onChange={(val) => updateReport("limitingCondition", val)}
        />
        <Assumptions
          value={reportData.assumptions}
          onChange={(val) => updateReport("assumptions", val)}
        />
        <Declaration
          user={reportData.user ?? null}
          value={reportData.declaration}
          onChange={(val) => updateReport("declaration", val)}
          createdAt={reportData.createdAt}
        />
        <PropertyLocation
          property={reportData.property}
          onChange={(val) => updateReport("property", val)}
        />
        <TenureTenanciesPlot
          landTenure={reportData.landTenure}
          owners={reportData.property?.owners || []}
          onChange={(landTenure, owners) =>
            setReportData((prev) =>
              prev
                ? { ...prev, landTenure, property: { ...prev.property, owners } }
                : prev
            )
          }
        />
        <ServiceSiteWorks
          siteWorks={reportData.siteWorks}
          onChange={(val) => updateReport("siteWorks", val)}
        />
        <Buildings
          data={reportData.building}
          onChange={(val) =>
            setReportData((prev: any) => ({ ...prev, building: val }))
          }
        />
        <GeneralRemarks
          value={reportData.generalRemarks}
          onChange={(val) => updateReport("generalRemarks", val)}
        />
        <ValuationComputationTable
          value={reportData.valuationTable}
          onChange={(val) => updateReport("valuationTable", val)}
        />

        {/* Action Buttons */}
        <div className="flex items-center gap-4 pt-6 pl-6 border-t border-gray-200">
          <button
            onClick={handleSaveReport}
            disabled={saving}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 ${
              saving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 hover:shadow-lg transform hover:-translate-y-0.5"
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Report
              </>
            )}
          </button>

          <button
            onClick={handleDownloadReport}
            disabled={!reportSaved || !savedReportId}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              reportSaved && savedReportId
                ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 hover:shadow-lg transform hover:-translate-y-0.5"
                : "bg-gray-200 text-gray-500 cursor-not-allowed"
            }`}
          >
            <Download className="w-5 h-5" />
            Download PDF
          </button>
        </div>
      </div>
    </div>
  );
}
