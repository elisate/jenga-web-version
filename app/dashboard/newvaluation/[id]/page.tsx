"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getEvaluationDetailsById } from "@/Reporting/evaluationDetail";

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

  const [evaluationData, setEvaluationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvaluation() {
      setLoading(true);
      const data = await getEvaluationDetailsById(evaluationId);
      setEvaluationData(data);
      setLoading(false);
    }
    if (evaluationId) fetchEvaluation();
  }, [evaluationId]);

  if (loading) return <p>Loading...</p>;
  if (!evaluationData) return <p>No evaluation data found.</p>;

  // Safely extract property and owners info (adjust if your data shape differs)
  const property = evaluationData?.property ?? null;
  // Assuming owners is a field inside property or related somewhere
  // Adjust according to your actual data structure
  const owners = property?.owners ?? [];

  return (
    <div className="container mx-auto p-6">
      <button
        onClick={() => {
          // TODO: PDF generation logic
        }}
        className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download PDF
      </button>

      <Instructions />
      <DefinitionOfValues />
      <BasisOfValuation />
      <LimitingCondition />
      <Assumptions />
      <Declaration />

      <PropertyLocation property={evaluationData?.property ?? null }/>

      <TenureTenanciesPlot
        landTenure={evaluationData?.landTenure ?? null}
        owners={owners?.properties ?? null}
      />

      <ServiceSiteWorks siteWorks={evaluationData?.siteWorks ?? null} />
      <Buildings data={evaluationData?.building ?? null} />
      <GeneralRemarks />
      <ValuationComputationTable />
    </div>
  );
}
