import { supabaseClient } from "@/lib/supabase/client";

export async function saveReport(evaluationId: number, evaluationData: any) {
  if (!evaluationId || !evaluationData) {
    throw new Error("Missing evaluationId or evaluationData");
  }

  const reportPayload = {
    evaluationId,
    evaluationData,
    createdAt: new Date().toISOString(),
  };

  const { data, error } = await supabaseClient
    .from("reports")
    .insert([
      {
        evaluation_id: evaluationId,
        report_data: reportPayload,
      },
    ])
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data; // inserted report record
}
