"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function EditTemplatePage() {
  const router = useRouter();
  const { id } = useParams();
  const templateId = Number(id);

  const [template, setTemplate] = useState<Database["public"]["Tables"]["templates"]["Row"] | null>(null);
  const [sections, setSections] = useState<Database["public"]["Tables"]["template_sections"]["Row"][]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sectionValues, setSectionValues] = useState<Record<number, string>>({});
  const [sectionNames, setSectionNames] = useState<Record<number, string>>({});
  const [nextTempId, setNextTempId] = useState(-1);

  useEffect(() => {
    if (!templateId) return;

    async function fetchData() {
      setLoading(true);
      const { data: template, error: templateError } = await supabaseClient
        .from("templates")
        .select("*")
        .eq("id", templateId)
        .single();
      const { data: sections, error: sectionsError } = await supabaseClient
        .from("template_sections")
        .select("*")
        .eq("template_id", templateId)
        .order("display_order", { ascending: true });
      if (templateError || sectionsError) {
        setLoading(false);
        return;
      }
      setTemplate(template);
      setSections(sections || []);
      setSectionValues(
        Object.fromEntries((sections || []).map((s) => [s.id, s.value || ""]))
      );
      setSectionNames(
        Object.fromEntries((sections || []).map((s) => [s.id, s.section || ""]))
      );
      setLoading(false);
    }
    fetchData();
  }, [templateId]);

  const handleSectionChange = (id: number, value: string) => {
    setSectionValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSectionNameChange = (id: number, value: string) => {
    setSectionNames((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddSection = () => {
    const tempId = nextTempId;
    setNextTempId((id) => id - 1);
    setSections((prev) => [
      ...prev,
      {
        id: tempId,
        template_id: templateId,
        section: "",
        value: "",
        display_order: prev.length + 1,
        created_at: null,
        updated_at: null,
      },
    ]);
    setSectionValues((prev) => ({ ...prev, [tempId]: "" }));
    setSectionNames((prev) => ({ ...prev, [tempId]: "" }));
  };

  const handleSave = async () => {
    setSaving(true);
    // Save all sections
    for (const section of sections) {
      const value = sectionValues[section.id] || "";
      const sectionName = sectionNames[section.id] || "";
      if (section.id < 0) {
        // New section, insert (workaround: cast to any to avoid id requirement)
        const { error: insertError } = await supabaseClient
          .from("template_sections")
          .insert({
            template_id: templateId,
            section: sectionName,
            value,
            display_order: section.display_order,
          } as any);
        if (insertError) {
          setSaving(false);
          alert(`Error inserting section: ${insertError.message}`);
          return;
        }
      } else {
        // Existing section, update
        const { error: updateError } = await supabaseClient
          .from("template_sections")
          .update({ value, section: sectionName })
          .eq("id", section.id);
        if (updateError) {
          setSaving(false);
          alert(`Error updating section: ${updateError.message}`);
          return;
        }
      }
    }
    // After saving, re-fetch data to update state with correct IDs/values
    const { data: updatedTemplate } = await supabaseClient
      .from("templates")
      .select("*")
      .eq("id", templateId)
      .single();
    const { data: updatedSections } = await supabaseClient
      .from("template_sections")
      .select("*")
      .eq("template_id", templateId)
      .order("display_order", { ascending: true });
    setTemplate(updatedTemplate);
    setSections(updatedSections || []);
    setSectionValues(
      Object.fromEntries((updatedSections || []).map((s) => [s.id, s.value || ""]))
    );
    setSectionNames(
      Object.fromEntries((updatedSections || []).map((s) => [s.id, s.section || ""]))
    );
    setSaving(false);
    alert("Template updated successfully!");
    router.push("/dashboard/templates");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-slate-600">Loading template...</div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">Template not found.</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link href="/dashboard/templates">
          <Button variant="outline" size="sm" className="border-2 border-slate-200">
          <ArrowLeft />
          </Button>
        </Link>
        <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Edit Template: {template.name}</h2>
      </div>
      <Button
        type="button"
        onClick={handleAddSection}
        className="mb-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
      >
        Add Section
      </Button>
      {sections.map((section) => (
        <Card key={section.id} className="mb-4">
          <CardContent className="p-4">
            <Input
              value={sectionNames[section.id]}
              onChange={e => handleSectionNameChange(section.id, e.target.value)}
              placeholder="Section name"
              className="mb-2 border-2 border-slate-200 focus:border-violet-500 font-semibold text-slate-700"
            />
            <RichTextEditor
              value={sectionValues[section.id]}
              onChange={(val) => handleSectionChange(section.id, val)}
              placeholder={`Edit content for ${sectionNames[section.id] || section.section}`}
            />
          </CardContent>
        </Card>
      ))}
      <Button onClick={handleSave} disabled={saving} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
} 