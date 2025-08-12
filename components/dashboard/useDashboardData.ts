import { supabaseClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

interface DashboardStats {
  total: number;
  draft: number;
  under_review: number;
  finalized: number;
  templates: number;
}

interface Valuation {
  id: number;
  client_name?: string | null;
  status: string | null;
  valuation_method?: string | null;
  created_at: string;
  properties: {
    upi: string;
  } | null;
}

export function useDashboardData(page: number, itemsPerPage: number = 10) {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [loading, setLoading] = useState(true);
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    total: 0,
    draft: 0,
    under_review: 0,
    finalized: 0,
    templates: 0,
  });
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    async function fetchDashboardData() {
      // Set appropriate loading state
      if (page === 1) {
        setLoading(true);
      } else {
        setPaginationLoading(true);
      }

      try {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();

        if (!user) {
          setLoading(false);
          setPaginationLoading(false);
          return;
        }

        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("organization_id")
          .eq("user_id", user.id)
          .single();

        if (!profile) {
          setLoading(false);
          setPaginationLoading(false);
          return;
        }

        // Get total count for pagination (only on first load)
        if (page === 1) {
          const { count: totalCount } = await supabaseClient
            .from("valuations")
            .select("*", { count: "exact", head: true })
            .eq("organization_id", profile.organization_id);

          if (totalCount !== null) {
            setTotalCount(totalCount);
          }
        }

        // Get paginated valuations data
        const from = (page - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        const { data: valuationsData, error } = await supabaseClient
          .from("valuations")
          .select(
            `
            id, 
            client_name, 
            status, 
            valuation_method, 
            created_at,
            properties(upi)
          `
          )
          .eq("organization_id", profile.organization_id)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (!error && valuationsData) {
          setValuations(valuationsData);
        }

        // Get stats for all data (only on first load)
        if (page === 1) {
          // Get valuations stats
          const { data: allValuations } = await supabaseClient
            .from("valuations")
            .select("status")
            .eq("organization_id", profile.organization_id);

          // Get templates count
          const { count: templatesCount } = await supabaseClient
            .from("templates")
            .select("*", { count: "exact", head: true })
            .eq("organization_id", profile.organization_id);

          if (allValuations) {
            const total = allValuations.length;
            const draft = allValuations.filter(
              (v) => v.status === "draft"
            ).length;
            const under_review = allValuations.filter(
              (v) => v.status === "under_review"
            ).length;
            const finalized = allValuations.filter(
              (v) => v.status === "finalized"
            ).length;

            setStats({
              total,
              draft,
              under_review,
              finalized,
              templates: templatesCount || 0,
            });
          }
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
        setPaginationLoading(false);
      }
    }

    fetchDashboardData();
  }, [page, itemsPerPage]);

  return {
    valuations,
    loading,
    paginationLoading,
    stats,
    totalCount,
  };
}
