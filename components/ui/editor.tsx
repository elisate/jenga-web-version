"use client";

import { Editor } from "primereact/editor";
import { useEffect, useState } from "react";

interface EditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function BasicDemo({
  value = "",
  onChange,
  placeholder = "Start writing...",
  className = "",
}: EditorProps) {
  const [content, setContent] = useState(value || "");

  console.log(
    "Editor component - value prop:",
    value,
    "content state:",
    content
  );

  // Update content when value prop changes
  useEffect(() => {
    console.log("Editor useEffect - value changed to:", value);
    setContent(value || "");
  }, [value]);

  const handleTextChange = (e: any) => {
    const newValue = e.htmlValue ?? "";
    console.log("Editor text changed to:", newValue);
    setContent(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  return (
    <div className={`card ${className}`}>
      <Editor
        value={content}
        onTextChange={handleTextChange}
        style={{ height: "320px" }}
        placeholder={placeholder}
      />
    </div>
  );
}
