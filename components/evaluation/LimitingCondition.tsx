"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Point {
  id: string;
  text: string;
}

interface LimitingConditionProps {
  value: string;
  onChange: (val: string) => void;
}

const LimitingCondition: React.FC<LimitingConditionProps> = ({ onChange }) => {
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

  const initialContent = `
   
    <ul style="margin-left:20px; font-size:16px;">
      ${limitingConditions
        .map(
          (item) => `<li><span style="font-weight:bold;">${item.id}.</span> ${item.text}</li>`
        )
        .join("")}
    </ul>
  `;

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: false, // Make read-only
  });

  // Send content to parent on mount
  useEffect(() => {
    onChange(initialContent);
  }, [initialContent, onChange]);

  return (
    <div className="mb-8 border border-gray-300 rounded-md overflow-hidden">
       <h2 className="font-weight:bold; font-size:24px;">IV. LIMITING CONDITIONS IN THIS VALUATION</h2>
      <div className="bg-white text-black p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
};

export default LimitingCondition;
