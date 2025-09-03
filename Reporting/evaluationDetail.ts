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
export async function getEvaluationDetailsWithHouses(evaluation_data_id: string | number) {
  const id = Number(evaluation_data_id);

  // Step 1: Fetch the evaluation details
  const { data: evaluation, error: evalError } = await supabaseClient
    .from("evaluation_data")
    .select(
      `
      evaluation_data_id,
      property_id,
      building_id,
      created_at,
      property:property_id ( * ),
      building:building_id ( * ),
      landTenure:landtenure_id ( * ),
      siteWorks:site_works_id ( * ),
      user:user_id ( * )
      `
    )
    .eq("evaluation_data_id", id)
    .single();

  if (evalError || !evaluation) {
    console.error("Error fetching evaluation details:", evalError);
    return null;
  }

  // Step 2: Fetch houses only if building_id exists
  let houses: any[] = [];
  if (evaluation.building_id) {
    const { data, error } = await supabaseClient
      .from("houses")
      .select("*")
      .eq("building_id", evaluation.building_id);

    if (error) {
      console.error("Error fetching houses:", error);
    } else {
      houses = data || [];
    }
  }

  // Step 3: Combine result
  return {
    ...evaluation,
    houses,
  };
}




