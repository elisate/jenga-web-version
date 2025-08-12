// Reporting/evaluationDetail.ts
import { supabaseClient } from "@/lib/supabase/client";

/**
 * Fetch all evaluation data with full related records:
 * property, building, landTenure, siteWorks, user.
 */
export async function getEvaluationData() {
  const { data, error } = await supabaseClient
    .from('evaluation_data')
    .select(`
      evaluation_data_id,
      property_id,
      created_at,
      property:property_id ( * ),
      building:building_id ( * ),
      landTenure:landtenure_id ( * ),
      siteWorks:site_works_id ( * ),
      user:user_id ( * )
    `);

  if (error) {
    console.error('Error fetching evaluation data:', error);
    return [];
  }

  console.log("Fetched evaluation data:", data);  // Add this to check data
  return data;
}

export async function getEvaluationWithDetails() {
  return await getEvaluationData();
}

/**
 * Fetch a single evaluation by ID with full related data.
 */
export async function getEvaluationDetailsById(evaluation_data_id: string | number) {
  const id = Number(evaluation_data_id);

  const { data, error } = await supabaseClient
    .from('evaluation_data')
    .select(`
      evaluation_data_id,
      property_id,
      created_at,
      property:property_id ( * ),
      building:building_id ( * ),
      landTenure:landtenure_id ( * ),
      siteWorks:site_works_id ( * ),
      user:user_id ( * )
    `)
    .eq('evaluation_data_id', id)
    .single();

  if (error) {
    console.error('Error fetching evaluation details:', error);
    return null;
  }

  return data;
}
