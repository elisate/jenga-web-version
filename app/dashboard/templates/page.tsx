"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMounted } from "@/lib/hooks";
import { 
  Plus, 
  Search,  
  Edit, 
  Clipboard,
  Building,
  Home,
  FileText,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { supabaseClient } from "@/lib/supabase/client";
import type { Database } from "@/types/supabase";

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Database["public"]["Tables"]["templates"]["Row"][]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const isMounted = useMounted();

  const [filteredTemplates, setFilteredTemplates] = useState<typeof templates>([]);

  // Fetch templates from Supabase
  useEffect(() => {
    async function fetchTemplates() {
      const { data, error } = await supabaseClient
        .from("templates")
        .select("*");
      if (error) {
        // Handle error as needed
        return;
      }
      setTemplates(data || []);
    }
    fetchTemplates();
  }, []);

  useEffect(() => {
    let filtered = templates;

    if (searchTerm) {
      filtered = filtered.filter(template =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.description?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        template.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== "all") {
      filtered = filtered.filter(template => template.type === categoryFilter);
    }

    setFilteredTemplates(filtered);
  }, [searchTerm, categoryFilter, templates]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "residential":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "commercial":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "land":
        return "bg-green-100 text-green-800 border-green-200";
      case "industrial":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "residential":
        return <Home className="w-4 h-4" />;
      case "commercial":
        return <Building className="w-4 h-4" />;
      case "land":
        return <FileText className="w-4 h-4" />;
      case "industrial":
        return <Clipboard className="w-4 h-4" />;
      default:
        return <Clipboard className="w-4 h-4" />;
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this template?")) return;
    await supabaseClient.from("templates").delete().eq("id", id);
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // Don't render until mounted to prevent hydration issues
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading templates...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
            Templates
          </h2>
        </div>
        
        <Link href="/dashboard/templates/new">
          <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="border border-slate-200 shadow bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Total Templates</p>
                <p className="text-lg font-bold text-slate-800">{templates.length}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50">
                <Clipboard className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-slate-200 shadow bg-white/90 backdrop-blur-sm">
          <CardContent className="p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-500">Categories</p>
                <p className="text-lg font-bold text-blue-600">{new Set(templates.map(t => t.type)).size}</p>
              </div>
              <div className="p-2 rounded-full bg-blue-50">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-2 border-slate-200 focus:border-violet-500"
          />
        </div>
        
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-40 border-2 border-slate-200">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="residential">Residential</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="land">Land</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Templates List */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="relative overflow-x-auto">
          <table className="w-full text-base">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-700  tracking-wide">Name</th>
                <th className="text-left p-4 font-semibold text-gray-700  tracking-wide">Type</th>
                <th className="text-left p-4 font-semibold text-gray-700  tracking-wide">Description</th>
                <th className="text-left p-4 font-semibold text-gray-700  tracking-wide">Created</th>
                <th className="text-left p-4 font-semibold text-gray-700  tracking-wide">Updated</th>
                <th className="text-center p-4 font-semibold text-gray-700  tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredTemplates.map((template) => (
                <tr key={template.id} className="hover:bg-purple-50 transition-colors duration-150">
                  <td className="py-4 px-6 font-medium text-gray-900">{template.name}</td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2 py-1 rounded ${getTypeColor(template.type)}`}>
                      {getTypeIcon(template.type)}
                      <span className="ml-1 capitalize">{template.type}</span>
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-600 truncate max-w-32">{template.description ?? "No description"}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{template.created_at ? new Date(template.created_at).toLocaleDateString() : "N/A"}</td>
                  <td className="py-4 px-6 text-gray-600 text-sm">{template.updated_at ? new Date(template.updated_at).toLocaleDateString() : "N/A"}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center gap-2 justify-center">
                        <Button variant="outline" size="sm" className="border-2 border-slate-200">
                          <Trash2 className="w-4 h-4 "  color="red" onClick={() => handleDelete(template.id)}/>
                        </Button>
                      
                      <Link href={`/dashboard/templates/${template.id}/edit`}>
                        <Button variant="outline" size="sm" className="border-2 border-slate-200">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredTemplates.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center">
                    <Clipboard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-slate-800 mb-2">No templates found</h3>
                    <p className="text-slate-600 mb-4">Try adjusting your search or filter criteria</p>
                    <Link href="/dashboard/templates/new">
                      <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Template
                      </Button>
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
