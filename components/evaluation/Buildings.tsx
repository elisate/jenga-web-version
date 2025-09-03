"use client";
import React from "react";

interface BuildingData {
  house_name: string;
  condition?: string;
  walls?: string[];
  windows?: string[];
  doors?: string[];
  wall_finishing?: string[];
  ceiling?: string[];
  roof_member?: string;
  roof_covering?: string[];
  fittings?: string[];
  pictures?: string[];
  accommodation_units?: string;
  other_accommodation_unit?: string;
  foundation?: string[];
  flooring?: string[];
}

interface BuildingsProps {
  data: BuildingData[];  // 👈 multiple houses
  onChange?: (val: BuildingData[]) => void;
}

export default function Buildings({ data, onChange }: BuildingsProps) {
  if (!data || data.length === 0) return <p>No building data available.</p>;

  React.useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  const renderList = (items?: string[]) =>
    items?.length ? (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ) : (
      <span>N/A</span>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white text-black rounded-lg shadow-md space-y-10">
      {data.map((house, index) => (
        <div key={index}>
          <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-3 px-5 rounded-md text-center">
            Building Details - {house.house_name}
          </h2>

          <table className="min-w-full border border-gray-300 table-auto">
            <tbody>
              <tr className="bg-gray-50">
                <td className="border px-4 py-3 font-semibold w-48">Condition</td>
                <td className="border px-4 py-3">{house.condition ?? "N/A"}</td>
              </tr>
              <tr>
                <td className="border px-4 py-3 font-semibold">Walls</td>
                <td className="border px-4 py-3">{renderList(house.walls)}</td>
              </tr>
              <tr>
                <td className="border px-4 py-3 font-semibold">Windows</td>
                <td className="border px-4 py-3">{renderList(house.windows)}</td>
              </tr>
              <tr>
                <td className="border px-4 py-3 font-semibold">Doors</td>
                <td className="border px-4 py-3">{renderList(house.doors)}</td>
              </tr>
              <tr>
                <td className="border px-4 py-3 font-semibold">Pictures</td>
                <td className="border px-4 py-3">
                  {house.pictures?.map((pic, idx) => (
                    <img
                      key={idx}
                      src={pic}
                      alt={`House ${index + 1} - Pic ${idx + 1}`}
                      className="w-24 h-24 object-cover mb-2 rounded"
                    />
                  )) || "N/A"}
                </td>
              </tr>
              {/* add the rest fields like ceiling, flooring, etc. same pattern */}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
