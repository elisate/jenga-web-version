"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface Definition {
  id: string;
  title: string;
  description: string;
}

interface DefinitionOfValuesProps {
  value: string;
  onChange: (val: string) => void;
}

const DefinitionOfValues: React.FC<DefinitionOfValuesProps> = ({ value, onChange }) => {
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

  const initialContent = `
    <h2 style="font-weight: bold; font-size: 24px;">II. DEFINITION OF VALUES</h2>
    ${definitions
      .map(
        (item) => `
      <h3 style="font-weight: bold; font-size: 20px;">${item.id}. ${item.title}:</h3>
      <p style="font-size: 16px;">${item.description}</p>
    `
      )
      .join("")}
  `;

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: false // make read-only
  });

  // Push initial content to parent on mount
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

export default DefinitionOfValues;
