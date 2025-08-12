"use client";
import React, { useState } from "react";

interface Owner {
  name: string;
  share: string;
  idNumber: string;
}

interface Field {
  label: string;
  name: string;
  placeholder: string;
}

const TenureTenanciesPlot: React.FC = () => {
  // Default data (replace with API/DB fetch)
  const [formData, setFormData] = useState({
    tenure: "Emphyteutic Lease",
    years: "43",
    term: "02/12/2023",
    owners: [
      { name: "MUHAWENIMANA JOSELINE", share: "50%", idNumber: "1 198570102014070" },
      { name: "NIYITEGEKA DAMASCENE", share: "50%", idNumber: "1 198580102018020" },
    ] as Owner[],
    encumbrances: "Mortgage",
    user: "Residential",
    current: "Residential",
    nla: "T1-Road reserve size in sqm 122 & R1A-Low density residential densification zone size in sqm 854.",
    occupancy: "Owner",
    plotSize: "976",
    plotShape: "Rectangular",
    nlaMap: null as File | null,
    masterPlan: null as File | null,
    permittedUses: [
      "Row housing",
      "Low Rise apartments",
      "Home Occupation",
      "Accessory Residential Units",
    ],
    prohibitedUses: [
      "Major Industrial uses",
      "Major infrastructure",
      "Single Family Residential Developments",
    ],
    lotSize: [
      "Rowhouses: Max 200 m2",
      "Low Rise Apartments: N/A (shall be allowed, provided the development meets the minimum density requirement as per point 3.0)",
    ],
  });

  const basicFields: Field[] = [
    { label: "Tenure", name: "tenure", placeholder: "Enter tenure" },
    { label: "Years", name: "years", placeholder: "Enter years" },
    { label: "Term Start", name: "term", placeholder: "Enter start date" },
    { label: "Encumbrances", name: "encumbrances", placeholder: "Enter encumbrances" },
    { label: "User (Land title)", name: "user", placeholder: "Enter land title" },
    { label: "Current Use", name: "current", placeholder: "Enter current use" },
    { label: "NLA Details", name: "nla", placeholder: "Enter NLA details" },
    { label: "Occupancy", name: "occupancy", placeholder: "Enter occupancy type" },
    { label: "Plot Size (Sqm)", name: "plotSize", placeholder: "Enter plot size" },
    { label: "Plot Shape", name: "plotShape", placeholder: "Enter plot shape" },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleOwnerChange = (index: number, key: keyof Owner, value: string) => {
    const updatedOwners = [...formData.owners];
    updatedOwners[index][key] = value;
    setFormData((prev) => ({ ...prev, owners: updatedOwners }));
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
      {/* Section Title */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 font-bold text-lg">
        VII. TENURE, TENANCIES & PLOT
      </div>

      <div className="bg-white text-black p-4 text-sm">
        {/* Basic Fields */}
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
                    name={field.name}
                    value={(formData as any)[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
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
                    onChange={(e) => handleOwnerChange(idx, "name", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={owner.share}
                    onChange={(e) => handleOwnerChange(idx, "share", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
                <td className="border border-gray-300 p-2">
                  <input
                    type="text"
                    value={owner.idNumber}
                    onChange={(e) => handleOwnerChange(idx, "idNumber", e.target.value)}
                    className="w-full border p-1 rounded"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Image Uploads */}
        <h3 className="font-semibold mb-2">Extracted from Rwanda National Land Authority</h3>
        <input
          type="file"
          name="nlaMap"
          accept="image/*"
          onChange={handleChange}
          className="border p-1 rounded mb-4 w-full"
        />
        {formData.nlaMap && (
          <img
            src={URL.createObjectURL(formData.nlaMap)}
            alt="NLA Map"
            className="mt-2 border rounded max-h-64"
          />
        )}

        <h3 className="font-semibold mt-4 mb-2">Master Plan Extract</h3>
        <input
          type="file"
          name="masterPlan"
          accept="image/*"
          onChange={handleChange}
          className="border p-1 rounded mb-4 w-full"
        />
        {formData.masterPlan && (
          <img
            src={URL.createObjectURL(formData.masterPlan)}
            alt="Master Plan"
            className="mt-2 border rounded max-h-64"
          />
        )}

        {/* Permitted Uses */}
        <h3 className="font-semibold mt-4 mb-2">Permitted Uses</h3>
        <ul className="list-disc ml-6">
          {formData.permittedUses.map((use, i) => (
            <li key={i}>{use}</li>
          ))}
        </ul>

        {/* Prohibited Uses */}
        <h3 className="font-semibold mt-4 mb-2">Prohibited Uses</h3>
        <ul className="list-disc ml-6 text-red-600">
          {formData.prohibitedUses.map((use, i) => (
            <li key={i}>{use}</li>
          ))}
        </ul>

        {/* Lot Size */}
        <h3 className="font-semibold mt-4 mb-2">Lot Size</h3>
        <ul className="list-disc ml-6">
          {formData.lotSize.map((size, i) => (
            <li key={i}>{size}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TenureTenanciesPlot;
