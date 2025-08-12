import React from 'react';

const buildingData = [
  {
    category: "BUILDINGS",
    details: ["House I"],
  },
  {
    category: "FOUNDATION",
    details: [
      "Mud mortar and adobe blocks",
      "Mud mortar and stones",
      "Cement & sand mortar and stones",
    ],
  },
  {
    category: "FLOOR FINISHING/PAVEMENT",
    details: [
      "Unfinished",
      "Mass & plain concrete",
      "Cement screed",
      "Timber",
      "Ceramic tiles",
      "Recycled tiles",
      "Cement and sand concrete",
      "R.C.C",
    ],
  },
  {
    category: "WALL",
    details: [
      "Cob",
      "Timber members",
      "Adobe blocks",
      "Burnt clay bricks",
      "Cement blocks",
      "Hydrofroam",
      "R.C.C",
      "Glass sheets",
      "Plywood panels & boards",
    ],
  },
  {
    category: "WINDOWS",
    details: [
      "Timber members",
      "Grazed timber members",
      "Bol",
      "Full metallic window",
      "Grazed steel casement type",
      "Aluminum steel casement type",
    ],
  },
  {
    category: "DOORS",
    details: [
      "Battened timber doors",
      "Plywood & flush timber doors",
      "Paneled timber type",
      "Bamboo type",
      "Full metallic door",
      "Grazed steel casement type",
      "Aluminum steel casement type",
      "Double leaf steel lockable gate",
      "Single steel sliding gate",
    ],
  },
  {
    category: "WALL FINISHING",
    details: [
      "Plastered with mud mortar",
      "Plastered & rendered with mud mortar",
      "Plastered with mud mortar, rendered with cement & sand mortar",
      "Plastered with cement & sand mortar",
      "Plastered & rendered with cement & sand mortar",
      "Roughcast",
      "Painted internally",
      "Color washed",
    ],
  },
  {
    category: "CEILING",
    details: [
      "Unlined",
      "Tent",
      "Bamboo matt ceiling",
      "Plywood panels & boards",
      "Ply plastic boards & panels",
      "Gypsum panels & boards",
      "(tongue & groove) t& g panels & boards",
      "Strip",
      "Slab painted",
    ],
  },
  {
    category: "ROOF MEMBER",
    details: ["Mono pitched", "Double pitched", "Multi pitched"],
  },
  {
    category: "ROOF COVERING",
    details: [
      "(galvanized corrugated iron) g.c.i sheets",
      "Versatile sheets",
      "Modern tiles",
      "Traditional tiles",
      "R.C.C (reinforced cement concrete)",
      "Tent",
    ],
  },
  {
    category: "Fittings",
    details: ["Kitchen Cabinet", "…."],
  },
  {
    category: "Condition",
    details: [
      "New & strong structure",
      "Good & strong structure",
      "Fair & strong structure",
      "Fair & cracks",
      "Bad & weak structure, risky",
    ],
  },
  {
    category: "Accommodation",
    details: [
      "Unit 1",
      "Living room",
      "Dinning",
      "Kitchen",
      "Store",
      "Bedrooms",
      "Shower-rooms",
      "Bath-rooms",
      "Office",
      "Other",
    ],
  },
  {
    category: "PICTURES",
    details: ["(Pictures to be added)"],
  },
];

export default function Buildings() {
  return (
    <div className="max-w-6xl mx-auto p-6 bg-white text-black rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white py-3 px-5 rounded-md text-center">
        Building Details
      </h2>

      <table className="min-w-full border border-gray-300 table-auto">
        <thead>
          <tr className="bg-violet-600 text-white">
            <th className="border border-gray-300 px-4 py-2 text-left">Category</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Details / Items</th>
          </tr>
        </thead>
        <tbody>
          {buildingData.map(({ category, details }, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}>
              <td className="border border-gray-300 px-4 py-3 align-top font-semibold w-48">
                {category}
              </td>
              <td className="border border-gray-300 px-4 py-3">
                <ul className="list-disc list-inside space-y-1">
                  {details.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
