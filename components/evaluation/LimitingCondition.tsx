import React from "react";

interface Point {
  id: string;
  text: string;
}

interface LimitingConditionProps {
  value: string;
  onChange: (val: string) => void;
}

const LimitingCondition: React.FC<LimitingConditionProps> = ({ value, onChange }) => {
  const limitingConditions: Point[] = [
    {
      id: "i",
      text: "The legal land ownership documents provided to us shows that the land is free from encumbrances. We did not carry out research to investigate any encumbrances or subsidiary interests registered on the land. For legal guarantee of property rights, consultation should be forwarded to relevant authorities.",
    },
    {
      id: "ii",
      text: "This valuation report is limited to the client whom it is addressed to and it is for mentioned purposes only. We are not liable if it is used otherwise without our prior written permission.",
    },
    {
      id: "iii",
      text: "The Valuation is only valid if in original and without alteration and signed and stamped. We do not guarantee the validity or authenticity of any copies that may be presented to any person, organization or entity as being made from the original.",
    },
    {
      id: "iv",
      text: "Where Open Market Values are assessed, they reflect the full contract value and no account is taken of any liability for taxation on sale or of the costs involved in effecting a sale.",
    },
    {
      id: "v",
      text: "Where it is stated in the Report that another party has supplied information to the Valuer, this information is believed to be reliable but the Valuer can accept no responsibility if this should prove not to be so.",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="mb-8 border border-gray-300 rounded-md overflow-hidden">
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-2 font-bold text-lg">
          IV. LIMITING CONDITIONS IN THIS VALUATION
        </div>
        <div className="bg-white text-black p-4">
          <ul className="list-disc list-inside space-y-2 text-sm">
            {limitingConditions.map((item) => (
              <li key={item.id}>
                <span className="font-semibold">{item.id}.</span> {item.text}
              </li>
            ))}
          </ul>

          {/* Editable field */}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full border rounded p-2 mt-4"
            placeholder="Add any additional limiting conditions..."
          />
        </div>
      </div>
    </div>
  );
};

export default LimitingCondition;
