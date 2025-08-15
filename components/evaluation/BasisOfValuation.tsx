import React from "react";

interface SubPoint {
  id: string;
  text: string;
}

interface Basis {
  id: string;
  title: string;
  description: string;
  subPoints?: SubPoint[];
}

interface BasisOfValuationProps {
  value: string;
  onChange: (val: string) => void;
}

const BasisOfValuation: React.FC<BasisOfValuationProps> = ({ value, onChange }) => {
  const basis: Basis[] = [
    {
      id: "a",
      title: "OPEN MARKET VALUE (O.M.V)",
      description:
        "The current Open Market Value of the subject property has been derived by summing the individual values of the land and depreciated improvements thereon.",
      subPoints: [
        {
          id: "i",
          text: "Land — The land has been valued based on analyzed rates of similar properties in the area or comparable locations, taking into consideration its size, topography, and the availability or proximity of essential services.",
        },
        {
          id: "ii",
          text: "Buildings/Improvements — The buildings and improvements have been valued using the cost of construction method, with appropriate depreciation applied to reflect the age and present condition of the structures.",
        },
      ],
    },
    {
      id: "b",
      title: "FORCED SALE VALUE",
      description:
        "The Forced Sale Value (Auction Value) has been determined by applying a further discount to the Open Market Value. This accounts for the inherent risks and shorter time frame typically associated with mortgage realizations through auction sales.",
    },
    {
      id: "c",
      title: "INSURANCE VALUE",
      description:
        "The Insurance Value (Replacement Cost Value) has been assessed using the direct Replacement Cost Approach, excluding the land value. This reflects the cost of reinstating the buildings and improvements in their current form.",
    },
  ];

  return (
    <div className="mb-8 border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-2 font-bold text-lg">
        III. BASIS OF VALUATION
      </div>

      <div className="bg-white text-black p-4 space-y-4">
        {basis.map((item) => (
          <div key={item.id}>
            <h3 className="font-semibold mb-1">
              {item.id}. {item.title}:
            </h3>
            <p className="text-sm mb-2">{item.description}</p>

            {item.subPoints && (
              <ul className="list-disc list-inside text-sm space-y-1">
                {item.subPoints.map((sub) => (
                  <li key={sub.id}>
                    <span className="font-semibold">{sub.id}.</span> {sub.text}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}

        {/* Optional editable field */}
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full border rounded p-2 mt-4"
          placeholder="Add your notes or observations here..."
        />
      </div>
    </div>
  );
};

export default BasisOfValuation;
