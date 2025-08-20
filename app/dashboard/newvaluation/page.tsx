"use client";
import React, { useEffect, useState } from "react";
import { getEvaluationWithDetails } from "@/Reporting/evaluationDetail";
import Link from "next/link";

interface EvaluationItem {
  evaluation_data_id: number;
  property_id: number;
  created_at: string | null;
  property?: { address?: string; [key: string]: any } | null;
  building?: { foundation?: string; [key: string]: any } | null;
  landTenure?: { tenure?: string; [key: string]: any } | null;
  siteWorks?: { access_types?: string; [key: string]: any } | null;
  user?: {
    id?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    role?: string;
    title?: string;
    avatar_url?: string;
    signature?: string; // URL
    [key: string]: any;
  } | null;
}

export default function EvaluationList() {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);

  useEffect(() => {
    getEvaluationWithDetails()
      .then((data) => setEvaluations(data as EvaluationItem[]))
      .catch(console.error);
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Evaluation Data</h1>
      {evaluations.length === 0 && <p>No evaluation data found.</p>}

      {evaluations.map((evalItem) => (
        <div key={evalItem.evaluation_data_id} className="border-b border-gray-300 py-4">
          <h2 className="font-semibold">Evaluation #{evalItem.evaluation_data_id}</h2>

          <p><strong>Building Foundation:</strong> {evalItem.building?.foundation || 'N/A'}</p>
          <p><strong>Land Tenure:</strong> {evalItem.landTenure?.tenure || 'N/A'}</p>
          <p><strong>Site Works Access Types:</strong> {evalItem.siteWorks?.access_types || 'N/A'}</p>
          <p><strong>Property Address:</strong> {evalItem.property?.address || 'N/A'}</p>
          <p><strong>Property ID:</strong> {evalItem.property_id}</p>

          <h3 className="font-semibold mt-2">Evaluator Details</h3>
          <p><strong>Name:</strong> {evalItem.user?.first_name} {evalItem.user?.last_name}</p>
          <p><strong>Email:</strong> {evalItem.user?.email || 'N/A'}</p>
          <p><strong>Phone:</strong> {evalItem.user?.phone || 'N/A'}</p>
          <p><strong>Role:</strong> {evalItem.user?.role || 'N/A'}</p>

          {evalItem.user?.avatar_url && (
            <img src={evalItem.user.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full mt-2" />
          )}
          {evalItem.user?.signature && (
            <div className="mt-2">
              <p><strong>Signature:</strong></p>
              <img src={evalItem.user.signature} alt="Signature" className="w-32 mt-1" />
            </div>
          )}

          <p><strong>Created At:</strong> {evalItem.created_at ? new Date(evalItem.created_at).toLocaleString() : 'N/A'}</p>

          <Link href={`/dashboard/newvaluation/${evalItem.evaluation_data_id}`}>
            <button className="bg-blue-500 text-white px-3 py-1 mt-2 rounded">View Report</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
