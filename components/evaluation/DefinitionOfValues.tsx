import React from "react";

interface Definition {
  id: string;
  title: string;
  description: string;
}

const DefinitionOfValues: React.FC = () => {
  const definitions: Definition[] = [
    {
      id: "a",
      title: "Market Value",
      description:
        "Market Value is the estimated amount for which an asset or liability should exchange on the valuation date between a willing buyer and a willing seller in an arm’s length transaction, after proper marketing and where the parties had each acted knowledgeably, prudently and without compulsion.",
    },
    {
      id: "b",
      title: "Insurance Value",
      description:
        "Is an estimate of the cost at date of valuation (including relevant fees) of replacing the asset with a new modern equivalent asset, including, where appropriate, the use of current equivalent technology, material and services. (IVS-Defined Basis of Value – Market Value, 2017)",
    },
  ];

  return (
    <div className="mb-8 border border-gray-300 rounded-md overflow-hidden">
      {/* Title with gradient */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-2 font-bold text-lg">
        II. DEFINITION OF VALUES
      </div>

      {/* Content */}
      <div className="bg-white text-black p-4 space-y-4">
        {definitions.map((item) => (
          <div key={item.id}>
            <h3 className="font-semibold mb-1">
              {item.id}. {item.title}:
            </h3>
            <p className="text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DefinitionOfValues;
