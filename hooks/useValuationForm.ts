import { supabaseClient } from "@/lib/supabase/client";
import { Database } from "@/types/supabase";
import { ValuationFormData } from "@/types/valuation-form";
import { useState } from "react";

export function useValuationForm(id?: string) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyId, setPropertyId] = useState<number | null>(null);
  const [valuationId, setValuationId] = useState<number | null>(null);
  const [templateId, setTemplateId] = useState<number | null>(null);

  const isNew = id === "new" || !id;

  const loadValuation = async (
    valuationId: number
  ): Promise<ValuationFormData | null> => {
    setLoading(true);
    setError(null);

    try {
      // Load valuation with property data and valuation_data
      const { data: valuation, error: valuationError } = await supabaseClient
        .from("valuations")
        .select(
          `
          *,
          property:property_id(*),
          valuation_data(*)
        `
        )
        .eq("id", valuationId)
        .single();

      if (valuationError) throw valuationError;

      if (valuation) {
        setPropertyId(valuation.property_id);
        setValuationId(valuation.id);
        setTemplateId(valuation.template_id);

        // Sort valuation_data by display_order
        const sortedValuationData = (valuation.valuation_data || []).sort(
          (a: any, b: any) => a.display_order - b.display_order
        );

        // Convert to form format
        const formData: ValuationFormData = {
          // Property data
          address: valuation.property?.address || "",
          upi: valuation.property?.upi || "",
          owner: valuation.property?.owner || "",
          country: valuation.property?.country || "Rwanda",
          province: valuation.property?.province || "",
          district: valuation.property?.district || "",
          sector: valuation.property?.sector || "",
          cell: valuation.property?.cell || "",
          village: valuation.property?.village || "",

          // Valuation data
          client_name: valuation.client_name || "",
          client_contact: valuation.client_contact || "",
          assessed_value: valuation.assessed_value?.toString() || "",
          status: valuation.status || "draft",
          valuation_method: valuation.valuation_method || "",
          purpose: valuation.purpose || "",
          property_condition: valuation.property_condition || "",
          valuation_date: valuation.valuation_date || "",
          inspection_date: valuation.inspection_date || "",
          instruction_date: valuation.instruction_date || "",
          general_notes: valuation.general_notes || "",
          assessment_notes: valuation.assessment_notes || "",
          rental_income: valuation.rental_income?.toString() || "",
          operating_expenses: valuation.operating_expenses?.toString() || "",
          cap_rate: valuation.cap_rate?.toString() || "",
          vacancy_rate: valuation.vacancy_rate?.toString() || "",

          // Valuation data sections
          valuation_data: sortedValuationData.map((item: any) => ({
            id: item.id,
            section: item.section,
            value: item.value,
            display_order: item.display_order,
          })),
        };

        return formData;
      }
    } catch (err) {
      console.error("Error loading valuation:", err);
      setError(err instanceof Error ? err.message : "Failed to load valuation");
      return null;
    } finally {
      setLoading(false);
    }

    return null;
  };

  const saveValuation = async (formData: ValuationFormData) => {
    setSaving(true);
    setError(null);

    try {
      // Get user and organization
      const {
        data: { user },
      } = await supabaseClient.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: profile } = await supabaseClient
        .from("profiles")
        .select("organization_id")
        .eq("user_id", user.id)
        .single();

      if (!profile) throw new Error("Profile not found");

      let currentPropertyId = propertyId;
      let currentValuationId = valuationId;

      // Step 1: Handle Property
      const propertyData = {
        address: formData.address,
        upi: formData.upi || `UPI-${Date.now()}`, // Generate UPI if not provided
        owner: formData.owner || null,
        country: formData.country || null,
        province: formData.province || null,
        district: formData.district || null,
        sector: formData.sector || null,
        cell: formData.cell || null,
        village: formData.village || null,
        organization_id: profile.organization_id,
        created_by: user.id,
      };

      if (currentPropertyId) {
        // Update existing property
        const { data: updatedProperty, error: propertyError } =
          await supabaseClient
            .from("properties")
            .update(propertyData)
            .eq("id", currentPropertyId)
            .select()
            .single();

        if (propertyError) throw propertyError;
        currentPropertyId = updatedProperty.id;
      } else {
        // Create new property - generate a unique ID
        const timestamp = Date.now();
        const { data: newProperty, error: propertyError } = await supabaseClient
          .from("properties")
          .insert({
            ...propertyData,
            id: timestamp, // Use timestamp as unique ID
          })
          .select()
          .single();

        if (propertyError) throw propertyError;
        currentPropertyId = newProperty.id;
        setPropertyId(currentPropertyId);
      }

      // Step 2: Handle Valuation
      const valuationData = {
        client_name: formData.client_name,
        client_contact: formData.client_contact,
        assessed_value: formData.assessed_value
          ? parseFloat(formData.assessed_value)
          : null,
        status:
          formData.status as Database["public"]["Enums"]["valuation_status_enum"],
        valuation_method:
          formData.valuation_method as Database["public"]["Enums"]["valuation_method_enum"],
        purpose:
          formData.purpose as Database["public"]["Enums"]["valuation_purpose_enum"],
        property_condition:
          formData.property_condition as Database["public"]["Enums"]["property_condition_enum"],
        valuation_date: formData.valuation_date || null,
        inspection_date: formData.inspection_date || null,
        instruction_date: formData.instruction_date || null,
        general_notes: formData.general_notes || null,
        assessment_notes: formData.assessment_notes || null,
        rental_income: formData.rental_income
          ? parseFloat(formData.rental_income)
          : null,
        operating_expenses: formData.operating_expenses
          ? parseFloat(formData.operating_expenses)
          : null,
        cap_rate: formData.cap_rate ? parseFloat(formData.cap_rate) : null,
        vacancy_rate: formData.vacancy_rate
          ? parseFloat(formData.vacancy_rate)
          : null,
        property_id: currentPropertyId,
        organization_id: profile.organization_id,
        created_by: user.id,
      };

      if (currentValuationId) {
        // Update existing valuation - template_id is preserved automatically
        const { data: updatedValuation, error: valuationError } =
          await supabaseClient
            .from("valuations")
            .update(valuationData)
            .eq("id", currentValuationId)
            .select()
            .single();

        if (valuationError) throw valuationError;
        currentValuationId = updatedValuation.id;
      } else {
        // Create new valuation - include template_id
        const { data: newValuation, error: valuationError } =
          await supabaseClient
            .from("valuations")
            .insert({
              ...valuationData,
              template_id: templateId || 1, // Use stored template_id or fallback to 1
            } as any)
            .select()
            .single();

        if (valuationError) throw valuationError;
        currentValuationId = newValuation.id;
        setValuationId(currentValuationId);
      }

      // Step 3: Handle Valuation Data Sections
      if (formData.valuation_data && formData.valuation_data.length > 0) {
        // Delete existing valuation data
        if (currentValuationId) {
          await supabaseClient
            .from("valuation_data")
            .delete()
            .eq("valuation_id", currentValuationId);
        }

        // Insert new valuation data
        const valuationDataItems = formData.valuation_data.map(
          (item, index) => ({
            valuation_id: currentValuationId!,
            section: item.section,
            value: item.value,
            display_order: item.display_order || index + 1,
          })
        );

        const { error: dataError } = await supabaseClient
          .from("valuation_data")
          .insert(valuationDataItems);

        if (dataError) throw dataError;
      }

      return {
        propertyId: currentPropertyId,
        valuationId: currentValuationId,
      };
    } catch (err) {
      console.error("Error saving valuation:", err);
      setError(err instanceof Error ? err.message : "Failed to save valuation");
      throw err;
    } finally {
      setSaving(false);
    }
  };

  return {
    loading,
    saving,
    error,
    propertyId,
    valuationId,
    isNew,
    loadValuation,
    saveValuation,
    setError,
  };
}
