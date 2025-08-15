"use client";
import React, { useState, useEffect } from "react";

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
  const [data, setData] = useState<TableRow[]>(value?.main || [
    ["Main house (Main area)", "sqm", "", 248.99, 250000, 0, "6%", 0],
    ["Main house (Porch area)", "sqm", "", 55.17, 250000, 0, "6%", 0],
    ["Annex house (area)", "sqm", "", 15.12, 200000, 0, "6%", 0],
    ["Gate house (area)", "sqm", "", 6.25, 170000, 0, "6%", 0],
    ["Bungalow house (area)", "sqm", "", 12.58, 200000, 0, "6%", 0],
  ]);

  const [landValueRow, setLandValueRow] = useState<TableRow>(
    value?.land || ["Land value", "sqm", "", 1107, 225000, 0, "", 0]
  );

  const [summaryRows, setSummaryRows] = useState<TableRow[]>(value?.summary || [
    ["Open Market Value", "", "", "", "", "", "", 0],
    ["Forced Sale Value @ 70%", "", "", "", "", "", "", 0],
    ["Insurance Value", "", "", "", "", "", "", 0],
  ]);

  // Auto compute replacement cost and value in Rwf
  const computeRow = (row: TableRow): TableRow => {
    const area = Number(row[3]) || 0;
    const rate = Number(row[4]) || 0;
    const depRate = parseFloat(String(row[6]).replace("%", "")) || 0;

    const replacementCost = area * rate;
    const valueInRwf = replacementCost * (1 - depRate / 100);

    return [
      row[0],
      row[1],
      row[2],
      area,
      rate,
      replacementCost,
      row[6],
      valueInRwf,
    ];
  };

  const handleChange = (
    val: string | number,
    rowIndex: number,
    colIndex: number,
    table: "main" | "land" | "summary"
  ) => {
    if (table === "main") {
      const updated = [...data];
      updated[rowIndex][colIndex] = val;
      updated[rowIndex] = computeRow(updated[rowIndex]);
      setData(updated);
      onChange?.({ main: updated, land: landValueRow, summary: summaryRows });
    }else if (table === "land") {
    const updated = computeRow([
        ...landValueRow.slice(0, colIndex),
        val,
        ...landValueRow.slice(colIndex + 1)
    ]);
    setLandValueRow(updated);
    onChange?.({ main: data, land: updated, summary: summaryRows });
}

  };

  // Compute summary automatically
  useEffect(() => {
    const buildingTotal = data.reduce((acc, row) => acc + Number(row[7] || 0), 0);
    const landValue = Number(landValueRow[7] || 0);

    const openMarket = buildingTotal + landValue;
    const forcedSale = openMarket * 0.7;
    const insuranceValue = buildingTotal * 0.3; // example fraction

    const updatedSummary = [
      ["Open Market Value", "", "", "", "", "", "", openMarket],
      ["Forced Sale Value @ 70%", "", "", "", "", "", "", forcedSale],
      ["Insurance Value", "", "", "", "", "", "", insuranceValue],
    ];

    setSummaryRows(updatedSummary);
    onChange?.({ main: data, land: landValueRow, summary: updatedSummary });
  }, [data, landValueRow]);

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
          {table === "summary" || colIndex === 5 || colIndex === 7 ? (
            <span>{cell.toLocaleString()}</span>
          ) : (
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
          )}
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
                LAND
              </td>
              <td className="border border-gray-400 px-3 py-2 text-right">
                {landValueRow[3]}
              </td>
              <td className="border border-gray-400 px-3 py-2 text-right">
                {landValueRow[4]}
              </td>
              <td className="border border-gray-400 px-3 py-2 text-right">
                {landValueRow[5]}
              </td>
              <td className="border border-gray-400 px-3 py-2 text-right">
                {landValueRow[6]}
              </td>
              <td className="border border-gray-400 px-3 py-2 text-right">
                {landValueRow[7]}
              </td>
            </tr>

            {summaryRows.map((row, i) => renderRow(row, i, "summary"))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ValuationTable;
