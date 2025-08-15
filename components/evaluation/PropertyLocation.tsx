"use client";
import React, { useState, useEffect } from "react";

interface Property {
  location?: string;
  upi?: string;
  geographical_coordinate?: string;
  mapImage?: File | null;
  village?: string;
  cell?: string;
  sector?: string;
  district?: string;
  province?: string;
}

interface PropertyLocationProps {
  property: Partial<Property> | null;
  onChange?: (updated: PropertyLocationState) => void; // Add this
}

interface PropertyLocationState {
  location: string;
  propertyUPI: string;
  coordinates: string;
  mapImage: File | null;
  village: string;
  cell: string;
  sector: string;
  district: string;
  province: string;
}

const PropertyLocation: React.FC<PropertyLocationProps> = ({ property, onChange }) => {
  const [formData, setFormData] = useState<PropertyLocationState>({
    location: property?.location || "",
    propertyUPI: property?.upi || "",
    coordinates: property?.geographical_coordinate || "",
    mapImage: null,
    village: property?.village || "",
    cell: property?.cell || "",
    sector: property?.sector || "",
    district: property?.district || "",
    province: property?.province || "",
  });

  useEffect(() => {
    setFormData({
      location: property?.location || "",
      propertyUPI: property?.upi || "",
      coordinates: property?.geographical_coordinate || "",
      mapImage: null,
      village: property?.village || "",
      cell: property?.cell || "",
      sector: property?.sector || "",
      district: property?.district || "",
      province: property?.province || "",
    });
  }, [property]);

  const buildFullLocation = () => {
    const parts = [
      formData.village ? `${formData.village} Village` : null,
      formData.cell ? `${formData.cell} Cell` : null,
      formData.sector ? `${formData.sector} Sector` : null,
      formData.district ? `${formData.district} District` : null,
    ].filter(Boolean);
    const locationStr = parts.join(", ");
    return formData.province
      ? locationStr
        ? `${locationStr} in ${formData.province} Province`
        : `${formData.province} Province`
      : locationStr;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: files?.[0] ?? value } as PropertyLocationState;

      // Update full location if location parts changed
      if (["village", "cell", "sector", "district", "province"].includes(name)) {
        updated.location = buildFullLocation();
      }

      if (onChange) onChange(updated); // propagate changes
      return updated;
    });
  };

  const fields = [
    { label: "Location", name: "location", placeholder: "Full location will appear here", type: "text" },
    { label: "Property UPI", name: "propertyUPI", placeholder: "Enter Property UPI", type: "text" },
    { label: "GPS Coordinates", name: "coordinates", placeholder: "Enter coordinates", type: "text" },
  ];

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 font-bold text-lg">
        VI. PROPERTY LOCATION
      </div>

      <div className="bg-white text-black p-4 text-sm">
        <table className="w-full border-collapse mb-4">
          <tbody>
            {fields.map((field) => (
              <tr key={field.name}>
                <td className="border border-gray-300 p-2 w-1/3 font-semibold">{field.label}</td>
                <td className="border border-gray-300 p-2">
                  <input
                    type={field.type}
                    name={field.name}
                    value={field.name === "location" ? buildFullLocation() : (formData as any)[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border p-1 rounded"
                    readOnly={field.name === "location"}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3 className="font-semibold mb-2">Location Map</h3>
        <div className="border border-gray-300 p-3 rounded mb-3">
          <input
            type="file"
            name="mapImage"
            accept="image/*"
            onChange={handleChange}
            className="border p-1 rounded w-full"
          />
          {formData.mapImage && (
            <div className="mt-3">
              <p className="text-sm text-gray-600">Preview:</p>
              <img
                src={URL.createObjectURL(formData.mapImage)}
                alt="Map Preview"
                className="mt-1 border rounded max-h-64"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyLocation;
