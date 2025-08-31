"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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

const BasisOfValuation: React.FC<BasisOfValuationProps> = ({ onChange }) => {
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

  const initialContent = `
   
    ${basis
      .map(
        (item) => `
      <h3 style="font-weight:bold; font-size:20px;">${item.id}. ${item.title}:</h3>
      <p style="font-size:16px;">${item.description}</p>
      ${
        item.subPoints
          ? `<ul style="margin-left:20px;">
              ${item.subPoints
                .map(
                  (sub) =>
                    `<li><span style="font-weight:bold;">${sub.id}.</span> ${sub.text}</li>`
                )
                .join("")}
            </ul>`
          : ""
      }
    `
      )
      .join("")}
  `;

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: false, // Make read-only
  });

  // Send initial content to parent on mount
  useEffect(() => {
    onChange(initialContent);
  }, [initialContent, onChange]);

  return (
    <div className="mb-8 border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-white text-black p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default BasisOfValuation;
