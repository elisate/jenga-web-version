import React from 'react'

interface Point {
  id: string;
  text: string;
}
function Assumptions() {
    const assumptions: Point[] = [
    {
      id: "1",
      text: "That no deleterious or hazardous materials or techniques were used in the construction of the property or have since been incorporated;",
    },
    {
      id: "2",
      text: "That good title can be shown and that the property is not subject to any unusual or especially onerous restrictions, encumbrances or outgoings;",
    },
    {
      id: "3",
      text: "That the property and its value are unaffected by any matters which would be revealed by a local search and replies to the usual enquiries, or by any statutory notice, and that neither the property, nor its condition, nor its use, nor its intended use, is or will be unlawful;",
    },
    {
      id: "4",
      text: "That inspection of those parts that have not been inspected would neither reveal material defects nor cause the Valuer to alter the valuation(s) materially;",
    },
    {
      id: "5",
      text: "Unless otherwise stated, that no contaminative or potentially contaminative uses have ever been carried out on the property and that there is no potential for contamination of the subject property from past or present uses of the property or from any neighboring property;",
    },
    {
      id: "6",
      text: "That the tenure details availed to us are correct.",
    },
  ];
  return (
    <div>
         {/* Assumptions */}
      <div className="mb-8 border border-gray-300 rounded-md overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-2 font-bold text-lg">
          V. ASSUMPTIONS
        </div>
        <div className="bg-white text-black p-4">
          <p className="text-sm mb-3">
            In preparing this report, unless otherwise stated, the following assumptions have been made which we shall be under no duty to verify:
          </p>
          <ul className="list-decimal list-inside space-y-2 text-sm">
            {assumptions.map((item) => (
              <li key={item.id}>{item.text}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Assumptions