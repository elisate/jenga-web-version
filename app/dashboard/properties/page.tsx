"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus, 
  Building, 
  MapPin, 
  Calendar,
  Ruler,
  Car,
  Edit,
  Trash2,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/client";


export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyTypeFilter] = useState("all");

  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    async function fetchProperties() {
      setLoading(true);
      setError(null);
      const { data, error } = await supabaseClient
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        setError(error.message);
        setProperties([]);
      } else {
        setProperties(data || []);
      }
      setLoading(false);
    }
    fetchProperties();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteClick = async (property: any) => {
    setDeleting(true);
    try {
      const { error } = await supabaseClient
        .from("properties")
        .delete()
        .eq("id", property.id);
      
      if (error) {
        setError(error.message);
      } else {
        // Remove the property from the local state
        setProperties(properties.filter(p => p.id !== property.id));
      }
    } catch (err) {
      setError("Failed to delete property");
      console.error("Delete error:", err);
    } finally {
      setDeleting(false);
    }
  };

  // Filter properties by type and search term
  const filteredProperties = properties.filter((property) => {
    // Filter by property type
    const matchesType = propertyTypeFilter === "all" || property.property_type === propertyTypeFilter;
    // Filter by search term (case-insensitive, checks address, district, county, plot_number)
    const search = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !search ||
      (property.address && property.address.toLowerCase().includes(search)) ||
      (property.district && property.district.toLowerCase().includes(search)) ||
      (property.county && property.county.toLowerCase().includes(search)) ||
      (property.plot_number && property.plot_number.toLowerCase().includes(search));
    return matchesType && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Properties</h2>
        </div>
        <Button className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white" onClick={() => router.push("/dashboard/properties/new")}>
          <Plus className="w-4 h-4 mr-2" />
          Add Property
        </Button>
      </div>

      {/* Filters */}
      
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
      </div>

      {/* Properties Table */}
      {loading ? (
        <div className="text-center py-12">Loading properties...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{error}</div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="relative overflow-x-auto">
            <table className="w-full text-base">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left p-3 font-semibold text-gray-700 tracking-wide">UPI</th>
                  <th className="text-left p-3 font-semibold text-gray-700 tracking-wide">Location</th>
                  <th className="text-left p-3 font-semibold text-gray-700 tracking-wide">Area</th>
                  <th className="text-left p-3 font-semibold text-gray-700 tracking-wide">Details</th>
                  <th className="text-left p-3 font-semibold text-gray-700 tracking-wide">Created</th>
                  <th className="text-center p-3 font-semibold text-gray-700 tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-purple-50 transition-colors duration-150">
                    <td className="py-3 px-4 font-medium text-gray-900">
                      <div>
                        <p className="text-slate-900 font-semibold">{property.upi}</p>
                        {property.plot_number && (
                          <p className="text-sm text-slate-600">Plot: {property.plot_number}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">git 
                      <div className="flex items-center gap-1 text-slate-700">
                        <MapPin className="w-4 h-4 text-slate-400" />
                        <span>{property.district}{property.county ? `, ${property.county}` : ""}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Ruler className="w-3 h-3 text-slate-400" />
                          <span>Built: {property.built_area} m²</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>Land: {property.land_area} {property.land_area_units}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      <div className="space-y-1 text-sm text-slate-600">
                        <div>Floors: {property.total_floors}</div>
                        <div>Year: {property.year_built}</div>
                        <div className="flex items-center gap-1">
                          <Car className="w-3 h-3" />
                          {property.parking_spaces} parking
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      <div className="flex items-center gap-1 text-sm text-slate-600">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {property.created_at ? formatDate(property.created_at) : "-"}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Button variant="outline" size="sm" className="border-2 border-slate-200" onClick={() => router.push(`/dashboard/properties/${property.id}`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
  variant="outline"
  size="sm"
  className="border-2 border-slate-200 text-red-600 hover:text-red-700"
  onClick={() => handleDeleteClick(property)}
  disabled={deleting} 
>
  <Trash2 className="w-4 h-4" />
</Button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 