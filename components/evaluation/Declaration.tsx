"use client";
import React, { useState } from "react";

const Declaration: React.FC = () => {
  const [formData, setFormData] = useState({
    techName: "",
    techPosition: "Technician Valuer",
    techDate: "",
    techSignature: null,
    assistantName: "",
    assistantDate: "",
    assistantSignature: null,
    finalSignature: null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (files && files.length > 0) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
      {/* Title */}
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white px-4 py-2 font-bold text-lg">
        DECLARATIONS
      </div>

      <div className="bg-white text-black p-4 text-sm">
        {/* 1. Declaration of Data Collection */}
        <h3 className="font-semibold mb-2">1. DECLARATION OF DATA COLLECTION AND ACCURACY</h3>
        <table className="w-full border-collapse mb-4">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 w-1/3 font-semibold">Automatic</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  name="techName"
                  value={formData.techName}
                  onChange={handleChange}
                  placeholder="Tech Name"
                  className="w-full border p-1 rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Position</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  name="techPosition"
                  value={formData.techPosition}
                  onChange={handleChange}
                  className="w-full border p-1 rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold align-top">Statement</td>
              <td className="border border-gray-300 p-2">
                <textarea
                  name="techStatement"
                  defaultValue={`Technician Valuer, hereby declare that I have personally captured and collected accurate and real information data related to the property / asset assessment, including but not limited to the following: Building dimensions; Photographs of the property; Geographic coordinates; Additional relevant data collected during the assessment.\nI hold myself responsible and confirm that the information provided is true and certain to the best of my knowledge and belief.`}
                  className="w-full border p-1 rounded min-h-[100px]"
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Date</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="date"
                  name="techDate"
                  value={formData.techDate}
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Signature</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="file"
                  name="techSignature"
                  accept="image/*"
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* 2. Declaration Report Cross Checking */}
        <h3 className="font-semibold mb-2">2. DECLARATION REPORT CROSS CHECKING</h3>
        <table className="w-full border-collapse mb-4">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 w-1/3 font-semibold">Name</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  name="assistantName"
                  value={formData.assistantName}
                  onChange={handleChange}
                  className="w-full border p-1 rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Statement</td>
              <td className="border border-gray-300 p-2">
                <textarea
                  name="assistantStatement"
                  defaultValue={`I have thoroughly reviewed and cross-checked this Valuation Report prepared by HABINSHUTI EVARISTE.\nI have: Examined the property description for accuracy and completeness; verified the maps, survey plans, and location details to ensure consistency with the valuation, assessed all supporting documents (title deeds, zoning certificates, etc.) for relevance and correctness, Scrutinized the computations, adjustments, and valuation methodology applied to confirm compliance with industry standards and regulatory requirements.\nAny discrepancies or concerns identified during the review have been addressed and resolved to ensure the integrity of the final valuation. I solemnly declare that the above statements are true and correct to the best of my knowledge and belief.`}
                  className="w-full border p-1 rounded min-h-[100px]"
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Date</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="date"
                  name="assistantDate"
                  value={formData.assistantDate}
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Signature</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="file"
                  name="assistantSignature"
                  accept="image/*"
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>

        {/* Final Declaration */}
        <h3 className="font-semibold mb-2">Final Declaration</h3>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Statement</td>
              <td className="border border-gray-300 p-2">
                <textarea
                  name="finalStatement"
                  defaultValue={`I, Valuer Phocas NIYONGOMBWA, hereby certify that I have no direct or indirect interest, financial or otherwise, in the property being valued or the parties involved that would compromise my impartiality and independence in conducting this property valuation. I have not been influenced by any party to the transaction, and my valuation is based solely on my professional judgment and analysis.`}
                  className="w-full border p-1 rounded min-h-[80px]"
                  onChange={handleChange}
                />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-2 font-semibold">Signature</td>
              <td className="border border-gray-300 p-2">
                <input
                  type="file"
                  name="finalSignature"
                  accept="image/*"
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Declaration;
