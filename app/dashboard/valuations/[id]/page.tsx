"use client";

import {
  PropertySectionSkeleton,
  ValuationDataSectionSkeleton,
  ValuationSectionSkeleton,
} from "@/components/skeleton";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PropertySection } from "@/components/valuations/PropertySection";
import { ValuationDataSection } from "@/components/valuations/ValuationDataSection";
import { ValuationSection } from "@/components/valuations/ValuationSection";
import { usePDFGeneration } from "@/hooks/usePDFGeneration";
import { useValuationForm } from "@/hooks/useValuationForm";
import { useMounted } from "@/lib/hooks";
import { ValuationFormData } from "@/types/valuation-form";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, Download, Eye, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function ValuationEditPage() {
  const params = useParams();
  const id = params.id as string;
  const { push } = useRouter();
  const isMounted = useMounted();
  const [success, setSuccess] = useState("");

  const {
    loading,
    saving,
    error,
    valuationId,
    loadValuation,
    saveValuation,
    setError,
  } = useValuationForm(id);

  // PDF generation hook
  const { isGenerating, downloadPDF, previewPDF } = usePDFGeneration({
    valuationId: valuationId || 0,
  });

  const form = useForm<ValuationFormData>({
    defaultValues: {
      address: "",
      upi: "",
      owner: "",
      country: "Rwanda",
      province: "",
      district: "",
      sector: "",
      cell: "",
      village: "",
      client_name: "",
      client_contact: "",
      assessed_value: "",
      status: "draft",
      valuation_method: "comparative",
      purpose: "mortgage_security",
      property_condition: "good",
      valuation_date: "",
      inspection_date: "",
      instruction_date: "",
      general_notes: "",
      assessment_notes: "",
      rental_income: "",
      operating_expenses: "",
      cap_rate: "",
      vacancy_rate: "",
      valuation_data: [],
    },
  });

  useEffect(() => {
    if (id && isMounted && !isNaN(parseInt(id))) {
      const loadData = async () => {
        try {
          const data = await loadValuation(parseInt(id));
          if (data) {
            form.reset(data);
          }
        } catch (err) {
          console.error("Error loading valuation:", err);
        }
      };
      loadData();
    }
  }, [id, isMounted]);

  const onSubmit = async (values: ValuationFormData) => {
    setError(null);
    setSuccess("");

    try {
      const result = await saveValuation(values);

      if (result) {
        setSuccess("Valuation updated successfully!");
        push("/dashboard/valuations");
      }
    } catch (err) {
      console.error("Error saving valuation:", err);
      // Error is already set by the hook
    }
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-8">
        {/* Skeleton Loaders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <PropertySectionSkeleton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ValuationSectionSkeleton />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <ValuationDataSectionSkeleton />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex w-full justify-between items-center ">
        <Link href="/dashboard/valuations">
          <Button
            variant="outline"
            size="icon"
            className="border-2 border-slate-200 hover:border-purple-300"
          >
            <ArrowLeft />
          </Button>
        </Link>
        <h3 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
          Edit Valuation
        </h3>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3"
        >
          <AlertCircle className="w-5 h-5 text-red-600" />
          <span className="text-red-800">{error}</span>
        </motion.div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-800">{success}</span>
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Property Section */}
          <PropertySection form={form} />
          {/* Valuation Section */}

          <ValuationSection form={form} />
          {/* Valuation Data Section */}
          <ValuationDataSection
            form={form}
            valuationId={valuationId || undefined}
          />
          {/* Submit Buttons */}
          <div className="flex justify-between gap-4 pt-4">
            {/* PDF Actions */}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={isGenerating || !valuationId}
                onClick={previewPDF}
                className="border-2 border-blue-200 hover:border-blue-300"
              >
                <Eye className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Preview PDF"}
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={isGenerating || !valuationId}
                onClick={downloadPDF}
                className="border-2 border-green-200 hover:border-green-300"
              >
                <Download className="w-4 h-4 mr-2" />
                {isGenerating ? "Generating..." : "Download PDF"}
              </Button>
            </div>

            {/* Form Actions */}
            <div className="flex gap-4">
              <Link href="/dashboard/valuations">
                <Button
                  variant="outline"
                  className="border-2 border-slate-200 hover:border-slate-300"
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              >
                <Save className="w-4 h-4 mr-2" />
                {saving ? "Saving..." : "Update Valuation"}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
