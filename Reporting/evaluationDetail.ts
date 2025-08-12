import { supabaseClient } from "@/lib/supabase/client";



export async function getEvaluationData() {
  const { data, error } = await supabaseClient
    .from('evaluation_data')
    .select(`
      evaluation_data_id,
      property_id,
      created_at,
      building:building_id ( * ),
      landTenure:landtenure_id ( * ),
      siteWorks:site_works_id ( * ),
      user:user_id ( * )
    `);

  if (error) {
    console.error('Error fetching evaluation data:', error);
    return [];
  }

  return data;
}

export async function getEvaluationWithDetails() {
  // Since the above query already fetches the related details,
  // just return the evaluations directly.
  return await getEvaluationData();
}
