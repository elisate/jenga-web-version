"use client";

import React, { useEffect, useState } from "react";

export interface InstructionsData {
  verbalInstructions: string;
  writtenInstructions: string;
  date: string;
  purpose: string[];
  inspectedDate: string;
  inspectedBy: string;
  bank_name: string;
}

interface InstructionsProps {
  value: InstructionsData;
  property?: {
    owner?: string;
    created_at?: string;
    purpose?: string[] | string; // ✅ fixed: matches Supabase field
    bank_name?: string;
  } | null;
  user?: { first_name?: string; last_name?: string } | null;
  evaluationCreatedAt?: string;
  onChange?: (val: InstructionsData) => void;
}

// Helper: format date to only YYYY-MM-DD
const formatDate = (dateStr?: string) => {
  if (!dateStr) return "";
  return new Date(dateStr).toISOString().split("T")[0];
};

const Instructions: React.FC<InstructionsProps> = ({
  value,
  property,
  user,
  evaluationCreatedAt,
  onChange,
}) => {
  const [instructions, setInstructions] = useState<InstructionsData>({
    verbalInstructions: value.verbalInstructions || property?.owner || "",
    writtenInstructions:
      value.writtenInstructions ||
      `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
    date: formatDate(value.date || property?.created_at || new Date().toISOString()),
    purpose:
      value.purpose && value.purpose.length > 0
        ? value.purpose
        : Array.isArray(property?.purpose) // ✅ use Supabase `purposes`
        ? property.purpose
        : property?.purpose
        ? [property.purpose]
        : [],
    inspectedDate: formatDate(value.inspectedDate || evaluationCreatedAt || new Date().toISOString()),
    inspectedBy:
      value.inspectedBy ||
      `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
    bank_name: value.bank_name || property?.bank_name || "",
  });

  useEffect(() => {
    const updated: InstructionsData = {
      verbalInstructions: value.verbalInstructions || property?.owner || "",
      writtenInstructions:
        value.writtenInstructions ||
        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
      date: formatDate(value.date || property?.created_at || new Date().toISOString()),
      purpose:
        value.purpose && value.purpose.length > 0
          ? value.purpose
          : Array.isArray(property?.purpose) // ✅ fixed here too
          ? property.purpose
          : property?.purpose
          ? [property.purpose]
          : [],
      inspectedDate: formatDate(value.inspectedDate || evaluationCreatedAt || new Date().toISOString()),
      inspectedBy:
        value.inspectedBy ||
        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
      bank_name: value.bank_name || property?.bank_name || "",
    };

    setInstructions(updated);
    onChange?.(updated);
  }, [value, property, user, evaluationCreatedAt]);

  const labelWithStatus = (label: string, fieldValue: any) =>
    fieldValue && (Array.isArray(fieldValue) ? fieldValue.length > 0 : true)
      ? `${label}`
      : `${label}`;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">I. INSTRUCTIONS</h2>
      <table className="w-full border-collapse text-xs">
        <tbody>
          <tr>
            <th className="border text-left border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Verbal instructions given to us by", instructions.verbalInstructions)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.verbalInstructions || "—"}</td>
          </tr>
          {/* <tr>
            <th className="border text-left border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Written instructions given to us by", instructions.writtenInstructions)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.writtenInstructions || "—"}</td>
          </tr> */}
          <tr>
            <th className="border text-left border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Date", instructions.date)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.date || "—"}</td>
          </tr>
         
          <tr>
            <th className="border text-left border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Purpose", instructions.purpose)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.purpose || "—"}</td>
          </tr>
           <tr>
            <th className="border text-left border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Bank name", instructions.bank_name)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.bank_name || "—"}</td>
          </tr>
          <tr>
            <th className="border text-left border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Inspected date", instructions.inspectedDate)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.inspectedDate || "—"}</td>
          </tr>
          <tr>
            <th className="border text-left border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Inspected by", instructions.inspectedBy)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.inspectedBy || "—"}</td>
          </tr>
         
        </tbody>
      </table>
    </div>
  );
};

export default Instructions;
