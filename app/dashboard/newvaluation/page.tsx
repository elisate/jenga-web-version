"use client";
import { useEffect, useState } from 'react';
import { getEvaluationWithDetails } from '@/Reporting/evaluationDetail';
import Link from 'next/link';

interface EvaluationItem {
  evaluation_data_id: number;
  property_id: number;
  created_at: string | null;
  property?: Record<string, any> | null;
  building?: {
    foundation?: string;
    [key: string]: any;
  } | null;
  landTenure?: {
    tenure?: string;
    [key: string]: any;
  } | null;
  siteWorks?: {
    access_types?: string;
    [key: string]: any;
  } | null;
  user?: {
    id?: string;
    [key: string]: any;
  } | null;
}

export default function EvaluationList() {
  const [evaluations, setEvaluations] = useState<EvaluationItem[]>([]);

  useEffect(() => {
    getEvaluationWithDetails()
      .then((data) => {
        setEvaluations(data as EvaluationItem[]);
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      <h1>Evaluation Data</h1>
      {evaluations.length === 0 && <p>No evaluation data found.</p>}
      {evaluations.map((evalItem) => (
        <div key={evalItem.evaluation_data_id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
          <h2>Evaluation #{evalItem.evaluation_data_id}</h2>
          <p><strong>Building Foundation:</strong> {evalItem.building?.foundation ?? 'N/A'}</p>
          <p><strong>Land Tenure:</strong> {evalItem.landTenure?.tenure ?? 'N/A'}</p>
          <p><strong>Site Works Access Types:</strong> {evalItem.siteWorks?.access_types ?? 'N/A'}</p>
          <p><strong>Property Address:</strong> {evalItem.property?.address ?? 'N/A'}</p>
          <p><strong>Property ID:</strong> {evalItem.property_id}</p>
          <p><strong>Created At:</strong> {evalItem.created_at ? new Date(evalItem.created_at).toLocaleString() : 'N/A'}</p>
          <Link href={`/dashboard/newvaluation/${evalItem.evaluation_data_id}`}>
            <button className='bg-blue-400 p-2 cursor-pointer'>View Report</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
