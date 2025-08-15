"use client";

import React from "react";

interface Purpose {
  id: number;
  text: string;
}

export interface InstructionsData {
  verbalInstructions: string;
  writtenInstructions: string;
  date: string;
  purposes: string[]; // always an array
  inspectedDate: string;
  inspectedBy: string;
}

interface InstructionsProps {
  value: InstructionsData;
  onChange: (val: InstructionsData) => void;
}

const Instructions: React.FC<InstructionsProps> = ({ value, onChange }) => {
  const purposes: Purpose[] = [
    { id: 1, text: "Bank purposes" },
    { id: 2, text: "Auction purposes" },
    { id: 3, text: "Court purposes" },
    { id: 4, text: "Book keeping purposes" },
    { id: 5, text: "VISA Application purposes" },
    { id: 6, text: "Insurance purposes" },
  ];

  const handleFieldChange = (field: keyof InstructionsData, newVal: any) => {
    onChange({ ...value, [field]: newVal });
  };

  const handlePurposeToggle = (purposeText: string) => {
    const updatedPurposes = value.purposes?.includes(purposeText)
      ? value.purposes.filter((p) => p !== purposeText)
      : [...(value.purposes || []), purposeText];
    handleFieldChange("purposes", updatedPurposes);
  };

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">I. INSTRUCTIONS</h2>
      <table className="w-full border-collapse text-xs">
        <tbody>
          <tr className="border border-gray-300">
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">
              Verbal instructions given to us by
            </th>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                className="w-full border p-1"
                value={value.verbalInstructions}
                onChange={(e) => handleFieldChange("verbalInstructions", e.target.value)}
              />
            </td>
          </tr>

          <tr className="border border-gray-300">
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">
              Written instructions given to us by
            </th>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                className="w-full border p-1"
                value={value.writtenInstructions}
                onChange={(e) => handleFieldChange("writtenInstructions", e.target.value)}
              />
            </td>
          </tr>

          <tr className="border border-gray-300">
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">Date</th>
            <td className="border border-gray-300 p-2">
              <input
                type="date"
                className="w-full border p-1"
                value={value.date}
                onChange={(e) => handleFieldChange("date", e.target.value)}
              />
            </td>
          </tr>

          <tr className="border border-gray-300">
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">Purposes</th>
            <td className="border border-gray-300 p-2">
              {purposes.map((p) => (
                <label key={p.id} className="block">
                  <input
                    type="checkbox"
                    checked={value.purposes?.includes(p.text) || false} // safe check
                    onChange={() => handlePurposeToggle(p.text)}
                  />{" "}
                  {p.text}
                </label>
              ))}
            </td>
          </tr>

          <tr className="border border-gray-300">
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">Inspected date</th>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                className="w-full border p-1"
                value={value.inspectedDate}
                onChange={(e) => handleFieldChange("inspectedDate", e.target.value)}
              />
            </td>
          </tr>

          <tr className="border border-gray-300">
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">Inspected by</th>
            <td className="border border-gray-300 p-2">
              <input
                type="text"
                className="w-full border p-1"
                value={value.inspectedBy}
                onChange={(e) => handleFieldChange("inspectedBy", e.target.value)}
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Instructions;
