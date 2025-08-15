"use client";
import React, { useState } from "react";

type TableRow = (string | number)[];

interface ValuationTableProps {
  value?: {
    main?: TableRow[];
    land?: TableRow;
    summary?: TableRow[];
  };
  onChange?: (updated: {
    main: TableRow[];
    land: TableRow;
    summary: TableRow[];
  }) => void;
}

const ValuationTable: React.FC<ValuationTableProps> = ({ value, onChange }) => {
  const [data, setData] = useState<TableRow[]>(
    value?.main || [
      ["Main house (Main area)", "sqm", "", 248.99, 250000, 62247500, "6%", 58512650],
      ["Main house (Porch area)", "sqm", "", 55.17, 250000, 13792500, "6%", 12964950],
      ["Annex house (area)", "sqm", "", 15.12, 200000, 3024000, "6%", 2842560],
      ["Gate house (area)", "sqm", "", 6.25, 170000, 1062500, "6%", 998750],
      ["Bungalow house (area)", "sqm", "", 12.58, 200000, 2516000, "6%", 2365040],
    ]
  );

  const [landValueRow, setLandValueRow] = useState<TableRow>(
    value?.land || ["Land value", "sqm", "", 1107, 225000, "", "", 249075000]
  );

  const [summaryRows, setSummaryRows] = useState<TableRow[]>(
    value?.summary || [
      ["Open Market Value", "", "", "", "", "", "", 344591350],
      ["Forced Sale Value @ 70%", "", "", "", "", "", "", 241213945],
      ["Insurance Value", "", "", "", "", "", "", 101902500],
    ]
  );

  const handleChange = (
    val: string | number,
    rowIndex: number,
    colIndex: number,
    table: "main" | "land" | "summary"
  ) => {
    if (table === "main") {
      const updated = [...data];
      updated[rowIndex][colIndex] = val;
      setData(updated);
      onChange?.({ main: updated, land: landValueRow, summary: summaryRows });
    } else if (table === "land") {
      const updated = [...landValueRow];
      updated[colIndex] = val;
      setLandValueRow(updated);
      onChange?.({ main: data, land: updated, summary: summaryRows });
    } else {
      const updated = [...summaryRows];
      updated[rowIndex][colIndex] = val;
      setSummaryRows(updated);
      onChange?.({ main: data, land: landValueRow, summary: updated });
    }
  };

  const renderRow = (
    row: TableRow,
    rowIndex: number,
    table: "main" | "land" | "summary"
  ) => (
    <tr key={rowIndex}>
      {row.map((cell, colIndex) => (
        <td
          key={colIndex}
          className={`border border-gray-400 px-3 py-2 ${
            colIndex > 2 ? "text-right" : "text-left"
          }`}
        >
          <input
            type={colIndex > 2 ? "number" : "text"}
            value={cell}
            onChange={(e) =>
              handleChange(
                colIndex > 2 ? parseFloat(e.target.value) || 0 : e.target.value,
                rowIndex,
                colIndex,
                table
              )
            }
            className="w-full bg-transparent outline-none"
          />
        </td>
      ))}
    </tr>
  );

  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">
        XI. VALUATION COMPUTATION TABLE
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-400 border-collapse text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 px-3 py-2 text-left">
                Property Description
              </th>
              <th className="border border-gray-400 px-3 py-2 text-left">Unit</th>
              <th className="border border-gray-400 px-3 py-2 text-left">
                Condition
              </th>
              <th className="border border-gray-400 px-3 py-2 text-right">
                Area in m²
              </th>
              <th className="border border-gray-400 px-3 py-2 text-right">
                Rate / Sqm
              </th>
              <th className="border border-gray-400 px-3 py-2 text-right">
                Replacement cost
              </th>
              <th className="border border-gray-400 px-3 py-2 text-right">
                Dep rate
              </th>
              <th className="border border-gray-400 px-3 py-2 text-right">
                Value in Rwf
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="bg-gray-50 font-bold">
              <td className="border border-gray-400 px-3 py-2" colSpan={8}>
                BUILDING
              </td>
            </tr>

            {data.map((row, i) => renderRow(row, i, "main"))}

            <tr className="bg-gray-50 font-bold">
              <td className="border border-gray-400 px-3 py-2" colSpan={3}>
                Sub-total I
              </td>
              <td className="border border-gray-400 px-3 py-2 text-right">338</td>
              <td className="border border-gray-400 px-3 py-2"></td>
              <td className="border border-gray-400 px-3 py-2 text-right">
                82,642,500
              </td>
              <td className="border border-gray-400 px-3 py-2"></td>
              <td className="border border-gray-400 px-3 py-2 text-right">
                77,683,950
              </td>
            </tr>

            {renderRow(landValueRow, 0, "land")}
            {summaryRows.map((row, i) => renderRow(row, i, "summary"))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValuationTable;
