"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { supabaseClient } from "@/lib/supabase/client";
import { ValuationDataItem } from "@/types/valuation-form";
import {
  ArrowDown,
  ArrowUp,
  FileText,
  GripVertical,
  Plus,
  Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { UseFormReturn } from "react-hook-form";

interface ValuationDataSectionProps {
  form: UseFormReturn<any>;
  valuationId?: number;
}

export function ValuationDataSection({
  form,
  valuationId,
}: ValuationDataSectionProps) {
  const [sections, setSections] = useState<ValuationDataItem[]>([]);
  const [loading, setLoading] = useState(false);

  const [isInitialized, setIsInitialized] = useState(false);

  const loadValuationData = async () => {
    if (!valuationId) return;

    setLoading(true);
    try {
      const { data, error } = await supabaseClient
        .from("valuation_data")
        .select("*")
        .eq("valuation_id", valuationId)
        .order("display_order");

      if (error) throw error;

      if (data && data.length > 0) {
        setSections(data);
        form.setValue("valuation_data", data, { shouldDirty: false });
      } else {
        // No data exists, start with empty sections
        setSections([]);
        form.setValue("valuation_data", [], { shouldDirty: false });
      }
    } catch (error) {
      console.error("Error loading valuation data:", error);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  useEffect(() => {
    if (isInitialized) return;

    const formData = form.getValues("valuation_data") || [];

    if (formData.length > 0) {
      // Use data from form (already loaded from backend)
      setSections(formData);
      setIsInitialized(true);
    } else if (valuationId) {
      // Load data if not available in form
      loadValuationData();
    } else {
      // Initialize with empty sections for new valuations
      setSections([]);
      form.setValue("valuation_data", [], { shouldDirty: false });
      setIsInitialized(true);
    }
  }, [valuationId, isInitialized, form]);

  const addSection = () => {
    const newOrder = Math.max(...sections.map((s) => s.display_order), 0) + 1;
    const newSections = [
      ...sections,
      {
        section: "New Section",
        value: "",
        display_order: newOrder,
      },
    ];
    setSections(newSections);
    form.setValue("valuation_data", newSections, { shouldDirty: true });
  };

  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index);
    setSections(newSections);
    form.setValue("valuation_data", newSections, { shouldDirty: true });
  };

  const updateSection = (
    index: number,
    field: keyof ValuationDataItem,
    value: string | number
  ) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], [field]: value };
    setSections(updated);
    form.setValue("valuation_data", updated, { shouldDirty: true });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newSections = [...sections];
    const swapIndex = direction === "up" ? index - 1 : index + 1;

    if (swapIndex >= 0 && swapIndex < sections.length) {
      // Swap display_order
      const tempOrder = newSections[index].display_order;
      newSections[index].display_order = newSections[swapIndex].display_order;
      newSections[swapIndex].display_order = tempOrder;

      // Swap positions
      [newSections[index], newSections[swapIndex]] = [
        newSections[swapIndex],
        newSections[index],
      ];

      // Sort by display_order
      newSections.sort((a, b) => a.display_order - b.display_order);
      setSections(newSections);
      form.setValue("valuation_data", newSections, { shouldDirty: true });
    }
  };

  // Only update form when user makes changes, not on initialization

  if (loading) {
    return (
      <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardContent className="p-6 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-2 py-0 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
      <CardHeader className="flex pt-4 flex-row justify-between  bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200">
        <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
          <FileText className="w-5 h-5 text-violet-600" />
          Valuation Report Sections
        </CardTitle>
        <Button
          type="button"
          onClick={addSection}
          className="w-fit bg-gradient-to-r text-white from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Section
        </Button>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        {sections.map((section, index) => (
          <div
            key={index}
            className="border rounded-lg p-4 bg-slate-50/50 space-y-4"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <GripVertical className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-medium text-slate-600">
                  Order: {section.display_order}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveSection(index, "up")}
                  disabled={index === 0}
                >
                  <ArrowUp className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => moveSection(index, "down")}
                  disabled={index === sections.length - 1}
                >
                  <ArrowDown className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeSection(index)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Section Title
                </label>
                <Input
                  value={section.section}
                  onChange={(e) =>
                    updateSection(index, "section", e.target.value)
                  }
                  placeholder="Enter section title"
                  className="border-2 border-slate-200 focus:border-violet-500"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
                  Content
                </label>
                <RichTextEditor
                  key={`editor-${index}-${section.id || "new"}`}
                  value={section.value || ""}
                  onChange={(value: string) => {
                    updateSection(index, "value", value);
                  }}
                  placeholder={`Enter content for ${section.section}...`}
                  className="min-h-[150px] border-2 border-slate-200 focus:border-violet-500"
                />
              </div>{" "}
            </div>
          </div>
        ))}

        {sections.length === 0 && (
          <div className="text-center py-8 text-slate-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-slate-300" />
            <p>No sections added yet. Click "Add Section" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
