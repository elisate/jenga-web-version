import React from 'react';

const services = {
  access: [
    "Tarmac road",
    "Murram road",
    "Stone roar",
    "Footpath",
  ],
  supply: [
    "Electricity",
    "Water",
    "Internet",
  ],
};

const siteWork = {
  boundaryWalls: ["Boundary walls"],

  foundation: [
    "Mud mortar and adobe blocks",
    "Mud mortar and stones",
    "Cement & sand mortar and stones",
  ],

  walls: [
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

  finishing: [
    "Plastered with mud mortar",
    "Plastered with cement & sand mortar",
    "Plastered & rendered with cement & sand mortar",
    "Roughcast",
    "Painted internally",
  ],

  gate: [
    "Double opening steel gate",
    "Manual sliding opening gate",
    "Automatic sliding opening gate",
  ],

  yard: [
    "Paved with pavers",
    "Paved with mass concrete",
    "Compacted soil",
  ],

  lighting: [
    "Light along the fence",
    "Light along the fence & garden",
    "Light in the garden",
  ],

  otherFeatures: [
    { label: "Swimming pool (sqm)", value: "" },
    { label: "Playground (sqm)", value: "" },
    { label: "CCTV Camera (No X)", value: "" },
    { label: "Solar panel system (No X)", value: "" },
  ],
};

function ServiceSiteWorks() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white text-black rounded-lg shadow-lg">
      <h2 className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-6 py-3 font-bold text-xl rounded-md mb-6 text-center">
        VIII. SERVICE & SITE WORKS
      </h2>

      {/* Services */}
      <section className="mb-8">
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">a. SERVICES</h3>

        <div className="mb-4">
          <h4 className="font-medium text-violet-700 mb-2">Access</h4>
          <ul className="list-disc list-inside space-y-1">
            {services.access.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-violet-700 mb-2">Supply</h4>
          <ul className="list-disc list-inside space-y-1">
            {services.supply.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* Site Work */}
      <section>
        <h3 className="text-lg font-semibold mb-4 border-b border-gray-300 pb-2">b. SITE WORK</h3>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Boundary Walls</h4>
          <ul className="list-disc list-inside">
            {siteWork.boundaryWalls.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Foundation</h4>
          <ul className="list-disc list-inside">
            {siteWork.foundation.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Walls</h4>
          <ul className="list-disc list-inside">
            {siteWork.walls.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Finishing</h4>
          <ul className="list-disc list-inside">
            {siteWork.finishing.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Gate</h4>
          <ul className="list-disc list-inside">
            {siteWork.gate.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Yard</h4>
          <ul className="list-disc list-inside">
            {siteWork.yard.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h4 className="font-medium text-violet-700 mb-2">Lighting</h4>
          <ul className="list-disc list-inside">
            {siteWork.lighting.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-medium text-violet-700 mb-2">Other Features</h4>
          <ul className="list-disc list-inside space-y-1">
            {siteWork.otherFeatures.map(({ label, value }, idx) => (
              <li key={idx}>
                <span className="font-semibold">{label}:</span> {value || <em>Not specified</em>}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default ServiceSiteWorks;
