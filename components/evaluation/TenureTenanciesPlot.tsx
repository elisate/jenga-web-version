"use client";
import React, { useState, useMemo } from "react";

interface Owner {
  name: string;
  share: string;
  idNumber: string;
}

interface LandTenureData {
  tenure: string;
  tenure_years?: number;
  tenure_start_date?: string;
  encumbrances: string;
  land_title_use: string;
  land_current_use: string;
  nla_zoning: string;
  occupancy: string;
  plot_size_sqm?: number;
  plot_shape: string;
  map_from_nla?: File | null;
  map_from_masterplan?: File[] | null;
  permitted_uses: string;
  prohibited_uses: string;
  lot_size_notes: string;
}

interface TenureTenanciesPlotProps {
  landTenure: Partial<LandTenureData> | null;
  owners: Owner[] | null;
  onChange?: (landTenure: Partial<LandTenureData>, owners: Owner[]) => void; // ✅ Add onChange
}

const TenureTenanciesPlot: React.FC<TenureTenanciesPlotProps> = ({
  landTenure,
  owners,
  onChange,
}) => {
  const parsedOwners = useMemo(() => owners ?? [], [owners]);

  const [formData, setFormData] = useState({
    tenure: landTenure?.tenure || "",
    years: landTenure?.tenure_years?.toString() || "",
    term: landTenure?.tenure_start_date || "",
    owners: parsedOwners,
    encumbrances: landTenure?.encumbrances || "",
    user: landTenure?.land_title_use || "",
    current: landTenure?.land_current_use || "",
    nla: landTenure?.nla_zoning || "",
    occupancy: landTenure?.occupancy || "",
    plotSize: landTenure?.plot_size_sqm?.toString() || "",
    plotShape: landTenure?.plot_shape || "",
    nlaMap: landTenure?.map_from_nla || null,
    masterPlan:
      Array.isArray(landTenure?.map_from_masterplan) &&
      landTenure.map_from_masterplan.length > 0
        ? landTenure.map_from_masterplan[0]
        : null,
    permittedUses: landTenure?.permitted_uses
      ? landTenure.permitted_uses.split(",")
      : [],
    prohibitedUses: landTenure?.prohibited_uses
      ? landTenure.prohibited_uses.split(",")
      : [],
    lotSize: landTenure?.lot_size_notes
      ? landTenure.lot_size_notes.split(",")
      : [],
  });

  const basicFields = [
    { label: "Tenure", name: "tenure" },
    { label: "Years", name: "years" },
    { label: "Term Start", name: "term" },
    { label: "Encumbrances", name: "encumbrances" },
    { label: "User (Land title)", name: "user" },
    { label: "Current Use", name: "current" },
    { label: "NLA Details", name: "nla" },
    { label: "Occupancy", name: "occupancy" },
    { label: "Plot Size (Sqm)", name: "plotSize" },
    { label: "Plot Shape", name: "plotShape" },
  ];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    name: keyof typeof formData
  ) => {
    const { value, files } = e.target;
    setFormData((prev) => {
      const updated = { ...prev, [name]: files?.[0] ?? value };
      if (onChange) onChange(updated, updated.owners);
      return updated;
    });
  };

  const handleOwnerChange = (index: number, key: keyof Owner, value: string) => {
    const updatedOwners = [...formData.owners];
    updatedOwners[index] = { ...updatedOwners[index], [key]: value };
    setFormData((prev) => {
      const updated = { ...prev, owners: updatedOwners };
      if (onChange) onChange(updated, updatedOwners);
      return updated;
    });
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 font-bold text-lg">
        VII. TENURE, TENANCIES & PLOT
      </div>

      <div className="bg-white text-black p-4 text-sm">
        <table className="w-full border-collapse mb-4">
          <tbody>
            {basicFields.map((field) => (
              <tr key={field.name}>
                <td className="border border-gray-300 p-2 w-1/3 font-semibold">
                  {field.label}
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={(formData as any)[field.name]}
                    onChange={(e) => handleChange(e, field.name as keyof typeof formData)}
                    placeholder={`Enter ${field.label}`}
                    className="w-full border p-1 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Owners Section */}
        <h3 className="font-semibold mb-2">Owners</h3>
        <table className="w-full border-collapse mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Share</th>
              <th className="border border-gray-300 p-2">ID</th>
            </tr>
          </thead>
          <tbody>
            {formData.owners.map((owner, idx) => (
              <tr key={idx}>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={owner.name}
                    onChange={(e) =>
                      handleOwnerChange(idx, "name", e.target.value)
                    }
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={owner.share}
                    onChange={(e) =>
                      handleOwnerChange(idx, "share", e.target.value)
                    }
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={owner.idNumber}
                    onChange={(e) =>
                      handleOwnerChange(idx, "idNumber", e.target.value)
                    }
                    className="w-full border p-1 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TenureTenanciesPlot;
