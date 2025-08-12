"use client";
import { useState, useEffect } from "react";
import data from "@/lib/data.json";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, X } from "lucide-react";
import { supabaseClient } from "@/lib/supabase/client";


// Define the form type
interface PropertyForm {
  address: string;
  built_area: string;
  land_area: string;
  land_area_units: string;
  property_type: string;
  building_class: string;
  organization_id: string;
  owner: string;
  parking_spaces: string;
  plot_number: string;
  title_deed_number: string;
  province: string;
  district: string;
  sector: string;
  cell: string;
  village: string;
  year_built: string;
  total_floors: string;
  development_potential: string;
  road_access: string;
  soil_type: string;
  topography: string;
  utilities: string[];
  country: string;
  imgs: any[];
  upi: string;
}

interface Organization {
  id: string;
  name: string;
}

export default function NewPropertyPage() {
  const [form, setForm] = useState<PropertyForm>({
    address: "",
    built_area: "",
    land_area: "",
    land_area_units: "sqm",
    property_type: "residential",
    building_class: "",
    organization_id: "",
    owner: "",
    parking_spaces: "",
    plot_number: "",
    title_deed_number: "",
    province: "",
    district: "",
    sector: "",
    cell: "",
    village: "",
    year_built: "",
    total_floors: "",
    development_potential: "",
    road_access: "",
    soil_type: "",
    topography: "",
    utilities: [],
    country: "Rwanda",
    imgs: [],
    upi: "",
  });
  const [districts, setDistricts] = useState<string[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [cells, setCells] = useState<string[]>([]);
  const [villages, setVillages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [orgLoading, setOrgLoading] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);

  
  useEffect(() => {
    if (form.province && (data as Record<string, any>)[form.province]) {
      setDistricts(Object.keys((data as Record<string, any>)[form.province]));
    } else {
      setDistricts([]);
    }
  }, [form.province]);
  
  useEffect(() => {
    if (form.province && form.district && (data as Record<string, any>)[form.province]?.[form.district]) {
      setSectors(Object.keys((data as Record<string, any>)[form.province][form.district]));
    } else {
      setSectors([]);
    }
  }, [form.district, form.province]);
  
  useEffect(() => {
    if (form.province && form.district && form.sector && (data as Record<string, any>)[form.province]?.[form.district]?.[form.sector]) {
      setCells(Object.keys((data as Record<string, any>)[form.province][form.district][form.sector]));
    } else {
      setCells([]);
    }
  }, [form.sector, form.district, form.province]);
  
  useEffect(() => {
    if (form.province && form.district && form.sector && form.cell && (data as Record<string, any>)[form.province]?.[form.district]?.[form.sector]?.[form.cell]) {
      setVillages((data as Record<string, any>)[form.province][form.district][form.sector][form.cell]);
    } else {
      setVillages([]);
    }
  }, [form.cell, form.sector, form.district, form.province]);

  // Fetch organizations on mount
  useEffect(() => {
    async function fetchOrganizations() {
      setOrgLoading(true);
      const { data} = await supabaseClient.from("organizations").select("id, name");
      if (data) setOrganizations(data);
      setOrgLoading(false);
    }
    fetchOrganizations();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSelect = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setUploadedImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };



  const uploadImagesToStorage = async (): Promise<string[]> => {
    if (uploadedImages.length === 0) return [];
  
    const urls: string[] = [];
    setUploading(true);
  
    try {
      for (const file of uploadedImages) {
        // Create FormData to upload the file
        const formData = new FormData();
        formData.append("image", file);

        // Upload to propertyimg endpoint
        const response = await fetch("/api/propertyimg", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to upload image");
        }

        const { url } = await response.json();
        urls.push(url);
      }
  
      return urls;
    } catch (err: any) {
      console.error("Image upload failed:", err);
      setError(`Image upload failed: ${err.message}`);
      return [];
    } finally {
      setUploading(false);
    }
  };
  
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
  
    // Validate required fields
    if (!form.address || !form.organization_id || !form.upi) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      // Get current user
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) {
        setError("User not authenticated.");
        setLoading(false);
        return;
      }

      // Upload images first
      let imageUrls: string[] = [];
      if (uploadedImages.length > 0) {
        try {
          imageUrls = await uploadImagesToStorage();
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError);
          setError(`Image upload failed: ${uploadError instanceof Error ? uploadError.message : 'Unknown error'}`);
          setLoading(false);
          return;
        }
      }
  
      // Prepare insert object matching database schema
      const insertObj = {
        address: form.address,
        organization_id: form.organization_id,
        upi: form.upi,
        owner: form.owner || null,
        province: form.province || null,
        district: form.district || null,
        sector: form.sector || null,
        cell: form.cell || null,
        village: form.village || null,
        country: form.country || "Rwanda",
        created_by: user.id,
        imgs: imageUrls,
      };
  
      // Insert into Supabase
      const { error: dbError } = await supabaseClient
        .from("properties")
        .insert(insertObj as any);
  
      setLoading(false);
      if (dbError) {
        setError(dbError.message);
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/dashboard/properties"), 1200);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
      setError("An error occurred while creating the property.");
    }
  };
  

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between  mb-6">
        <Button variant="outline" size="sm" className="border-2 border-slate-200" onClick={() => router.push("/dashboard/properties")}> 
          <ArrowLeft className="w-4 h-4 mr-2" />
        
        </Button>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">Add New Property</h2>
      </div>
      <Card className="border-2 border-slate-200 shadow-xl bg-white/90 backdrop-blur-sm">
        <CardHeader className="bg-gradient-to-r from-violet-50 to-purple-50 border-b border-slate-200">
          <CardTitle className="text-xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">Property Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Address <span className="text-red-500">*</span></Label>
              <Input name="address" value={form.address} onChange={handleChange} placeholder="Address" required />
            </div>
            <div>
              <Label>UPI <span className="text-red-500">*</span></Label>
              <Input name="upi" value={form.upi} onChange={handleChange} placeholder="UPI" required />
            </div>
            <div>
              <Label>Organization <span className="text-red-500">*</span></Label>
              <select
                name="organization_id"
                value={form.organization_id}
                onChange={e => handleSelect("organization_id", e.target.value)}
                className="w-full border rounded px-3 py-2"
                required
                disabled={orgLoading}
              >
                <option value="">{orgLoading ? "Loading organizations..." : "Select Organization"}</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>{org.name}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Owner</Label>
              <Input name="owner" value={form.owner} onChange={handleChange} placeholder="Owner" />
            </div>
            <div>
              <Label>Country</Label>
              <Input name="country" value={form.country} onChange={handleChange} placeholder="Country" />
            </div>
            <div>
              <Label>Province</Label>
              <select name="province" value={form.province} onChange={e => handleSelect("province", e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="">Select Province</option>
                {Object.keys(data).map(prov => (
                  <option key={prov} value={prov}>{prov}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>District</Label>
              <select name="district" value={form.district} onChange={e => handleSelect("district", e.target.value)} className="w-full border rounded px-3 py-2" disabled={!districts.length}>
                <option value="">Select District</option>
                {districts.map(dist => (
                  <option key={dist} value={dist}>{dist}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Sector</Label>
              <select name="sector" value={form.sector} onChange={e => handleSelect("sector", e.target.value)} className="w-full border rounded px-3 py-2" disabled={!sectors.length}>
                <option value="">Select Sector</option>
                {sectors.map(sec => (
                  <option key={sec} value={sec}>{sec}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Cell</Label>
              <select name="cell" value={form.cell} onChange={e => handleSelect("cell", e.target.value)} className="w-full border rounded px-3 py-2" disabled={!cells.length}>
                <option value="">Select Cell</option>
                {cells.map(cell => (
                  <option key={cell} value={cell}>{cell}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Village</Label>
              <select name="village" value={form.village} onChange={e => handleSelect("village", e.target.value)} className="w-full border rounded px-3 py-2" disabled={!villages.length}>
                <option value="">Select Village</option>
                {villages.map(vil => (
                  <option key={vil} value={vil}>{vil}</option>
                ))}
              </select>
            </div>

            {/* Image Upload Section */}
            <div>
              <Label>Property Images</Label>
              <div className="space-y-4">
                {/* Upload Button */}
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-8 h-8 mb-2 text-gray-400" />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 10MB</p>
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                    />
                  </label>
                </div>

                {/* Preview Uploaded Images */}
                {uploadedImages.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">New Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {uploadedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-24 object-cover rounded-lg border"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            {error && <div className="text-red-600 text-sm">{error}</div>}
            {success && <div className="text-green-600 text-sm">Property created successfully!</div>}
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white"
              disabled={loading}
            >
              {loading ? "Submitting..." : "Create Property"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}