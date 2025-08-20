"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Point {
  id: string;
  text: string;
  assumptions?: string; // Add this field
}

interface AssumptionsProps {
  value: string;
  onChange: (val: string) => void;
}

const Assumptions: React.FC<AssumptionsProps> = ({ value, onChange }) => {
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

  const initialContent = `
    <h2 style="font-weight:bold; font-size:24px;">V. ASSUMPTIONS</h2>
    <p style="font-size:16px; margin-bottom:12px;">
      In preparing this report, unless otherwise stated, the following assumptions have been made which we shall be under no duty to verify:
    </p>
    <ol style="margin-left:20px; font-size:16px;">
      ${assumptions
        .map(
          (item) => `<li><span style="font-weight:bold;">${item.id}.</span> ${item.text}</li>`
        )
        .join("")}
    </ol>
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

export default Assumptions;
