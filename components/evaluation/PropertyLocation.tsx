"use client";
import React, { useState } from "react";

interface Field {
  label: string;
  name: string;
  placeholder: string;
  type: "text" | "file";
}

const PropertyLocation: React.FC = () => {
  // Default values (could be replaced with props or fetched DB data)
  const initialData = {
    location: "Ngororero Village, Kazabe Cell, Ngororero Sector, Ngororero District in Western Province",
    propertyUPI: "1/03/05/04/259",
    coordinates: "1.9770464, 30.1006159",
    mapImage: null as File | null,
  };

  const [formData, setFormData] = useState(initialData);

  // Define form fields dynamically
  const fields: Field[] = [
    {
      label: "Location",
      name: "location",
      placeholder: "Enter location",
      type: "text",
    },
    {
      label: "Property UPI",
      name: "propertyUPI",
      placeholder: "Enter Property UPI",
      type: "text",
    },
    {
      label: "GPS Coordinates",
      name: "coordinates",
      placeholder: "Enter coordinates",
      type: "text",
    },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
      {/* Section Title */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 font-bold text-lg">
        VI. PROPERTY LOCATION
      </div>

      <div className="bg-white text-black p-4 text-sm">
        <table className="w-full border-collapse mb-4">
          <tbody>
            {fields.map((field) => (
              <tr key={field.name}>
                <td className="border border-gray-300 p-2 w-1/3 font-semibold">
                  {field.label}
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type={field.type}
                    name={field.name}
                    value={
                      field.type === "text"
                        ? (formData as any)[field.name]
                        : undefined
                    }
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    className="w-full border p-1 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Location Map Upload */}
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
