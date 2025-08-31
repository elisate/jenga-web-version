"use client";

import React, { useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

interface GeneralRemarksProps {
  value: string;
  onChange: (val: string) => void;
}

const generalRemarksList = [
  "The subject property is a modern single storied residential house...",
  "The subject property enjoys all the major facilities...",
  "The value principally reflects the construction materials...",
  "We have realized through Rwanda land management and use authority...",
  "Other...",
];

const GeneralRemarks: React.FC<GeneralRemarksProps> = ({ value, onChange }) => {
  const initialContent = value || `
    
    <ul style="margin-left:20px; font-size:16px; list-style-type:disc;">
      ${generalRemarksList.map((remark) => `<li>${remark}</li>`).join("")}
    </ul>
  `;

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialContent,
    editable: true,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Send initial content to parent on mount
  useEffect(() => {
    onChange(initialContent);
  }, [initialContent, onChange]);

  return (
    <div className="mb-8 border border-gray-300 rounded-md overflow-hidden bg-white text-black p-4">
      <h2 className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 font-bold text-lg">X. GENERAL REMARKS</h2>
      <EditorContent editor={editor} />
    </div>
  );
};

export default GeneralRemarks;
