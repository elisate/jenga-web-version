"use client";

import React, { useEffect, useState } from "react";

export interface InstructionsData {
  verbalInstructions: string;
  writtenInstructions: string;
  date: string;
  purposes: string[];
  inspectedDate: string;
  inspectedBy: string;
}

interface InstructionsProps {
  value: InstructionsData;
  property?: {
    owner?: string;
    created_at?: string;
    bank_purpose?: string[] | string;
  } | null;
  user?: { first_name?: string; last_name?: string } | null;
  evaluationCreatedAt?: string;
  onChange?: (val: InstructionsData) => void;
}

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
    date: value.date || property?.created_at || new Date().toISOString(),
    purposes:
      value.purposes && value.purposes.length > 0
        ? value.purposes
        : Array.isArray(property?.bank_purpose)
        ? property.bank_purpose
        : property?.bank_purpose
        ? [property.bank_purpose]
        : [],
    inspectedDate: value.inspectedDate || evaluationCreatedAt || new Date().toISOString(),
    inspectedBy:
      value.inspectedBy ||
      `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
  });

  useEffect(() => {
    const updated: InstructionsData = {
      verbalInstructions: value.verbalInstructions || property?.owner || "",
      writtenInstructions:
        value.writtenInstructions ||
        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
      date: value.date || property?.created_at || new Date().toISOString(),
      purposes:
        value.purposes && value.purposes.length > 0
          ? value.purposes
          : Array.isArray(property?.bank_purpose)
          ? property.bank_purpose
          : property?.bank_purpose
          ? [property.bank_purpose]
          : [],
      inspectedDate: value.inspectedDate || evaluationCreatedAt || new Date().toISOString(),
      inspectedBy:
        value.inspectedBy ||
        `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim(),
    };

    setInstructions(updated);
    onChange?.(updated);
  }, [value, property, user, evaluationCreatedAt]);

  const labelWithStatus = (label: string, fieldValue: any) =>
    fieldValue && (Array.isArray(fieldValue) ? fieldValue.length > 0 : true)
      ? `${label} (Submitted)`
      : `${label} (—)`;

  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4">I. INSTRUCTIONS</h2>
      <table className="w-full border-collapse text-xs">
        <tbody>
          <tr>
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Verbal instructions given to us by", instructions.verbalInstructions)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.verbalInstructions || "—"}</td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Written instructions given to us by", instructions.writtenInstructions)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.writtenInstructions || "—"}</td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Date", instructions.date)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.date || "—"}</td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Purposes", instructions.purposes)}
            </th>
            <td className="border border-gray-300 p-2">
              <ul className="list-disc list-inside space-y-1">
                {instructions.purposes.length > 0 ? (
                  instructions.purposes.map((p, idx) => <li key={idx}>{p}</li>)
                ) : (
                  <li>—</li>
                )}
              </ul>
            </td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">
              {labelWithStatus("Inspected date", instructions.inspectedDate)}
            </th>
            <td className="border border-gray-300 p-2">{instructions.inspectedDate || "—"}</td>
          </tr>
          <tr>
            <th className="border border-gray-300 p-2 bg-[#f5f3ff]">
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
