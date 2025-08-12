import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function getEvaluationData() {
  const { data, error } = await supabase
    .from('evaluation_data')
    .select(`
      evaluation_data_id,
      property_id,
      created_at,
      buildings (*),
      landtenures (*),
      site_works (*),
      users (*)
    `);

  if (error) {
    console.error('Error fetching evaluation data:', error);
    return [];
  }
  return data;
}
