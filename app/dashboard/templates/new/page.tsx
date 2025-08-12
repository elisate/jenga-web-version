"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import RichTextEditor from "@/components/ui/rich-text-editor";
import { 
  ArrowLeft,
  Save,
  FileText,
  
  Plus,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";

export default function NewTemplatePage() {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: ""
  });

  const [sections, setSections] = useState([
    { id: Date.now(), section: "", value: "" }
  ]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSectionChange = (id: number, field: "section" | "value", value: string) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const addSection = () => {
    setSections(prev => [...prev, { id: Date.now(), section: "", value: "" }]);
  };

  const removeSection = (id: number) => {
    setSections(prev => prev.length > 1 ? prev.filter(s => s.id !== id) : prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Get current user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      alert("User not authenticated");
      return;
    }
    // Get user profile for organization_id
    const { data: profile } = await supabaseClient
      .from("profiles")
      .select("organization_id")
      .eq("user_id", user.id)
      .single();
    if (!profile) {
      alert("User profile not found");
      return;
    }
    // 1. Create template
    const templateId = Date.now() + Math.floor(Math.random() * 10000);
    const { data: template, error: templateError } = await supabaseClient
      .from("templates")
      .insert({
        id: templateId,
        name: formData.name,
        description: formData.description,
        type: formData.category as any,
        active: true,
        organization_id: profile.organization_id,
        created_by: user.id,
      })
      .select()
      .single();
    if (templateError || !template) {
      alert("Failed to create template");
      return;
    }
    // 2. Create sections
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      if (!s.section) continue;
      await supabaseClient.from("template_sections").insert({
        id: Date.now() + Math.floor(Math.random() * 10000),
        section: s.section,
        value: s.value,
        template_id: templateId,
        display_order: i + 1
      });
    }
    window.location.href = `/dashboard/templates`;
  };

  const categoryOptions = [
    { value: "residential", label: "Residential Property" },
    { value: "commercial", label: "Commercial Property" },
    { value: "land", label: "Land Valuation" },
    { value: "industrial", label: "Industrial Property" },
    { value: "mixed", label: "Mixed Use Property" }
  ];


  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
          <Link href="/dashboard/templates">
            <Button variant="outline" size="sm" className="border-2 border-slate-200">
              <ArrowLeft className="w-4 h-4 mr-2" />
            </Button>
          </Link>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Create New Template
            </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Basic Information */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-violet-600" />
                  Basic Information
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Template name, description, and category
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Template Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter template name"
                    className="border-2 border-slate-200 focus:border-violet-500"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the template purpose..."
                    className="border-2 border-slate-200 focus:border-violet-500 min-h-[100px]"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-slate-700">Category</Label>
                  <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                    <SelectTrigger className="border-2 border-slate-200 focus:border-violet-500">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      {categoryOptions.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Template Sections */}
          <div className="lg:col-span-2">
            <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b border-slate-200">
                <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-orange-600" />
                  Template Sections
                </CardTitle>
                <CardDescription className="text-slate-600">
                  Add sections to your template. Each section has a name and rich content.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                {sections.map((s) => (
                  <div key={s.id} className="mb-6 border-2 border-slate-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-4 mb-2">
                      <Label className="text-sm font-medium text-slate-700 flex-1">Section Name</Label>
                      {sections.length > 1 && (
                        <Button type="button" variant="outline" size="sm" onClick={() => removeSection(s.id)} className="border-2 border-slate-200 text-red-600 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <Input
                      value={s.section}
                      onChange={e => handleSectionChange(s.id, "section", e.target.value)}
                      placeholder="Section name"
                      className="mb-2 border-2 border-slate-200 focus:border-violet-500"
                      required
                    />
                    <RichTextEditor
                      value={s.value}
                      onChange={(val) => handleSectionChange(s.id, "value", val)}
                      placeholder={`Section content...`}
                    />
                  </div>
                ))}
                <Button type="button" onClick={addSection} className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Section
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4 pt-8">
          <Link href="/dashboard/templates">
            <Button variant="outline" className="border-2 border-slate-200">
              Cancel
            </Button>
          </Link>
          <Button type="submit" className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
            <Save className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>
      </form>
    </div>
  );
} 