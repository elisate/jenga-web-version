import { supabaseClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import {
  ValuationFilters,
  ValuationListItem,
  ValuationStats,
  ValuationWithProperty,
} from "@/types/valuations";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useValuations() {
  const [valuations, setValuations] = useState<ValuationListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ValuationFilters>({});
  const [organizationId, setOrganizationId] = useState<string | null>(null);

  // Initialize organization ID
  useEffect(() => {
    async function getOrganizationId() {
      try {
        const {
          data: { user },
        } = await supabaseClient.auth.getUser();
        if (!user) return;

        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("organization_id")
          .eq("user_id", user.id)
          .single();

        if (profile) {
          setOrganizationId(profile.organization_id);
        }
      } catch (err) {
        console.error("Error getting organization ID:", err);
      }
    }

    getOrganizationId();
  }, []);

  // Fetch valuations with filters
  const fetchValuations = useCallback(async () => {
    if (!organizationId) return;

    setLoading(true);
    setError(null);

    try {
      let query = supabaseClient
        .from("valuations")
        .select(
          `
          *,
          property:property_id(*)
        `
        )
        .eq("organization_id", organizationId)
        .order("created_at", { ascending: false });

      if (filters.status && filters.status !== "all") {
        query = query.eq(
          "status",
          filters.status as Database["public"]["Enums"]["valuation_status_enum"]
        );
      }

      if (filters.purpose && filters.purpose !== "all") {
        query = query.eq(
          "purpose",
          filters.purpose as Database["public"]["Enums"]["valuation_purpose_enum"]
        );
      }

      if (filters.method && filters.method !== "all") {
        query = query.eq(
          "valuation_method",
          filters.method as Database["public"]["Enums"]["valuation_method_enum"]
        );
      }

      const { data, error } = await query;

      if (error) throw error;

      // Transform data to match UI needs
      let transformed: ValuationListItem[] = (
        data as ValuationWithProperty[]
      ).map((v) => ({
        id: v.id,
        propertyAddress: v.property?.address || "-",
        propertyUPI: v.property?.upi || "-",
        clientName: v.client_name || "-",
        clientContact: v.client_contact,
        location:
          [v.property?.district, v.property?.province, v.property?.country]
            .filter(Boolean)
            .join(", ") || "-",
        propertyCondition: v.property_condition
          ? v.property_condition.charAt(0).toUpperCase() +
            v.property_condition.slice(1)
          : "-",
        status: v.status,
        purpose: v.purpose,
        valuationMethod: v.valuation_method,
        createdAt: v.created_at,
        valuationDate: v.valuation_date,
        inspectionDate: v.inspection_date,
        instructionDate: v.instruction_date,
        generalNotes: v.general_notes,
        assessmentNotes: v.assessment_notes,
      }));

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        transformed = transformed.filter(
          (v) =>
            v.clientName.toLowerCase().includes(searchTerm) ||
            v.propertyUPI.toLowerCase().includes(searchTerm)
        );
      }

      setValuations(transformed);
    } catch (err) {
      console.error("Error fetching valuations:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [organizationId, filters]);

  // Delete valuation function
  const deleteValuation = useCallback(
    async (valuationId: number) => {
      if (!organizationId)
        return { success: false, error: "Organization not found" };

      try {
        // Delete the valuation (cascade will handle valuation_data)
        const { error: valuationError } = await supabaseClient
          .from("valuations")
          .delete()
          .eq("id", valuationId)
          .eq("organization_id", organizationId);

        if (valuationError) throw valuationError;

        // Update local state
        setValuations((prev) => prev.filter((v) => v.id !== valuationId));

        return { success: true, error: null };
      } catch (err) {
        console.error("Error deleting valuation:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete valuation";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [organizationId]
  );

  // Fetch data when dependencies change
  useEffect(() => {
    fetchValuations();
  }, [fetchValuations]);

  // Calculate stats
  const stats: ValuationStats = useMemo(() => {
    const total = valuations.length;
    const draft = valuations.filter((v) => v.status === "draft").length;
    const underReview = valuations.filter(
      (v) => v.status === "under_review"
    ).length;
    const finalized = valuations.filter((v) => v.status === "finalized").length;

    return {
      total,
      draft,
      underReview,
      finalized,
    };
  }, [valuations]);

  return {
    valuations,
    loading,
    error,
    stats,
    filters,
    setFilters,
    refetch: fetchValuations,
    deleteValuation,
  };
}
