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
  data: BuildingData | null | undefined;
  
  onChange?: (val: BuildingData | null | undefined) => void;
}

export default function Buildings({ data, onChange }: BuildingsProps) {
  if (!data) return <p>No building data available.</p>;

  // Optional: call onChange if needed when data changes
  React.useEffect(() => {
    if (onChange) onChange(data);
  }, [data, onChange]);

  // Helper to render a list or show "N/A"
  const renderList = (items?: string[]) =>
    items && items.length > 0 ? (
      <ul className="list-disc list-inside space-y-1">
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    ) : (
      <span>N/A</span>
    );

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white text-black rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-3 px-5 rounded-md text-center">
        Building Details - {data.house_name}
      </h2>

      <table className="min-w-full border border-gray-300 table-auto">
        <thead>
          <tr className="bg-violet-600 text-white">
            <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Details / Items</th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Condition</td>
            <td className="border border-gray-300 px-4 py-3">{data.condition ?? 'N/A'}</td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Walls</td>
            <td className="border border-gray-300 px-4 py-3">{renderList(data.walls)}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Windows</td>
            <td className="border border-gray-300 px-4 py-3">{renderList(data.windows)}</td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Doors</td>
            <td className="border border-gray-300 px-4 py-3">{renderList(data.doors)}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Wall Finishing</td>
            <td className="border border-gray-300 px-4 py-3">{renderList(data.wall_finishing)}</td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Ceiling</td>
            <td className="border border-gray-300 px-4 py-3">{renderList(data.ceiling)}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Roof Member</td>
            <td className="border border-gray-300 px-4 py-3">{data.roof_member ?? 'N/A'}</td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Roof Covering</td>
            <td className="border border-gray-300 px-4 py-3">{renderList(data.roof_covering)}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Fittings</td>
            <td className="border border-gray-300 px-4 py-3">{renderList(data.fittings)}</td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Pictures</td>
            <td className="border border-gray-300 px-4 py-3">
              {Array.isArray(data.pictures) &&
                data.pictures.map((pic, idx) => (
                  <img
                    key={idx}
                    src={pic}
                    alt={`Picture ${idx + 1}`}
                    className="w-24 h-24 object-cover mb-2 rounded"
                  />
                ))}
            </td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Accommodation Units</td>
            <td className="border border-gray-300 px-4 py-3">{data.accommodation_units ?? 'N/A'}</td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Other Accommodation Unit</td>
            <td className="border border-gray-300 px-4 py-3">{data.other_accommodation_unit ?? 'N/A'}</td>
          </tr>
          <tr className="bg-gray-50">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Foundation</td>
            <td className="border border-gray-300 px-4 py-3">{renderList(data.foundation)}</td>
          </tr>
          <tr className="bg-white">
            <td className="border border-gray-300 px-4 py-3 font-semibold w-48">Flooring</td>
            <td className="border border-gray-300 px-4 py-3">{renderList(data.flooring)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
