import { supabaseClient } from "@/lib/supabase/client";

export async function saveReport(evaluationId: number, reportData: any) {
  if (!evaluationId || !reportData) {
    throw new Error("Missing evaluationId or reportData");
  }

  const { data, error } = await supabaseClient
    .from("reports")
    .upsert(
      [
        {
          evaluation_id: evaluationId,
          report_data: reportData,
          created_at: new Date().toISOString()
        }
      ],
      { onConflict: "evaluation_id" } // now this works
    )
    .select()
    .single();

  if (error) {
    console.error("Error saving report:", error);
    throw error;
  }

  return data;
}
