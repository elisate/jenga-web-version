"use client";
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

//generate pdf
const generatePDF = async () => {
  try {
    const response = await fetch('/api/generate-pdf');
    if (!response.ok) throw new Error('Failed to generate PDF');

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'valuation-report.pdf';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};



  return (
    <div className="container mx-auto p-6">
      <button
        onClick={generatePDF}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download PDF
      </button>

      <div>
        <Instructions />
        <DefinitionOfValues />
        <BasisOfValuation />
        <LimitingCondition />
        <Assumptions />
        <Declaration />
        <PropertyLocation />
        <TenureTenanciesPlot />
        <ServiceSiteWorks />
        <Buildings />
        <GeneralRemarks />
        <ValuationComputationTable />
      </div>
    </div>
  );
}
