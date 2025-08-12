"use client";

import BulletList from "@tiptap/extension-bullet-list";
import Color from "@tiptap/extension-color";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Image as ImageIcon,
  Italic,
  List,
  ListOrdered,
  Loader2,
  Redo,
  Table as TableIcon,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "./button";

interface RichTextEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function RichTextEditor({
  value = "",
  onChange,
  placeholder = "Start writing...",
  className = "",
}: RichTextEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isUpdatingFromProp = useRef(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // Disable the default bullet and ordered lists from StarterKit
        bulletList: false,
        orderedList: false,
        listItem: false,
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "my-bullet-list",
        },
      }),
      OrderedList.configure({
        HTMLAttributes: {
          class: "my-ordered-list",
        },
      }),
      ListItem,
      Underline,
      TextAlign.configure({
        types: [
          "heading",
          "paragraph",
          "div",
          "listItem",
          "bulletList",
          "orderedList",
        ],
      }),
      TextStyle,
      Color,
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto",
        },
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: value,
    onUpdate: ({ editor }) => {
      if (isUpdatingFromProp.current) {
        isUpdatingFromProp.current = false;
        return;
      }

      const html = editor.getHTML();
      if (onChange) {
        onChange(html);
      }
    },
    editorProps: {
      attributes: {
        class: `prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[200px] p-4 ${className}`,
      },
    },
  });

  // Update editor content when value prop changes
  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      isUpdatingFromProp.current = true;
      editor.commands.setContent(value || "", false);
    }
  }, [editor, value]);

  const addImage = useCallback(() => {
    if (!editor || !fileInputRef.current) return;

    fileInputRef.current.click();
  }, [editor]);

  const handleImageUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!editor) return;

      const file = event.target.files?.[0];
      if (!file) return;

      setIsUploadingImage(true);

      try {
        // Create FormData to upload the file
        const formData = new FormData();
        formData.append("image", file);

        // Upload to valuationimg endpoint
        const response = await fetch("/api/valuationimg", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Failed to upload image");
        }

        const { url } = await response.json();

        // Insert the uploaded image URL into the editor
        editor.chain().focus().setImage({ src: url }).run();
      } catch (error) {
        console.error("Error uploading image:", error);
        // Fallback to base64 if upload fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result === "string") {
            editor.chain().focus().setImage({ src: result }).run();
          }
        };
        reader.readAsDataURL(file);
      } finally {
        setIsUploadingImage(false);
      }

      // Reset the input
      event.target.value = "";
    },
    [editor]
  );

  const insertTable = useCallback(() => {
    if (!editor) return;
    editor
      .chain()
      .focus()
      .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
      .run();
  }, [editor]);

  if (!editor) {
    return null;
  }

  return (
    <div className={`border rounded-lg ${className}`}>
      {/* Hidden file input for image uploads */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Toolbar */}
      <div className="border-b p-2 flex flex-wrap gap-1">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "bg-slate-200" : ""}
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "bg-slate-200" : ""}
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive("underline") ? "bg-slate-200" : ""}
        >
          <UnderlineIcon className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "bg-slate-200" : ""}
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "bg-slate-200" : ""}
        >
          <ListOrdered className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Setting left align");
            editor.chain().focus().setTextAlign("left").run();
          }}
          className={
            editor.isActive({ textAlign: "left" }) ? "bg-slate-200" : ""
          }
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Setting center align");
            editor.chain().focus().setTextAlign("center").run();
          }}
          className={
            editor.isActive({ textAlign: "center" }) ? "bg-slate-200" : ""
          }
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            console.log("Setting right align");
            editor.chain().focus().setTextAlign("right").run();
          }}
          className={
            editor.isActive({ textAlign: "right" }) ? "bg-slate-200" : ""
          }
        >
          <AlignRight className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addImage}
          disabled={isUploadingImage}
        >
          {isUploadingImage ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <ImageIcon className="w-4 h-4" />
          )}
        </Button>

        <Button type="button" variant="outline" size="sm" onClick={insertTable}>
          <TableIcon className="w-4 h-4" />
        </Button>

        <div className="w-px h-6 bg-slate-300 mx-1" />

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          <Undo className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          <Redo className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Content */}
      <EditorContent
        editor={editor}
        placeholder={placeholder}
        className="min-h-[200px]"
      />

      {/* Table and List styles */}
      <style jsx global>{`
        .ProseMirror table {
          border-collapse: collapse;
          table-layout: fixed;
          width: 100%;
          margin: 0;
          overflow: hidden;
        }

        .ProseMirror td,
        .ProseMirror th {
          min-width: 1em;
          border: 2px solid #ced4da;
          padding: 3px 5px;
          vertical-align: top;
          box-sizing: border-box;
          position: relative;
        }

        .ProseMirror th {
          font-weight: bold;
          text-align: left;
          background-color: #f1f3f4;
        }

        .ProseMirror .selectedCell:after {
          z-index: 2;
          position: absolute;
          content: "";
          left: 0;
          right: 0;
          top: 0;
          bottom: 0;
          background: rgba(200, 200, 255, 0.4);
          pointer-events: none;
        }

        .ProseMirror img {
          max-width: 100%;
          height: auto;
        }

        /* Base list styles */
        .ProseMirror ul,
        .ProseMirror ol {
          padding-left: 1.5rem;
          margin: 1rem 0;
        }

        .ProseMirror ul {
          list-style-type: disc;
        }

        .ProseMirror ol {
          list-style-type: decimal;
        }

        .ProseMirror li {
          margin: 0.5rem 0;
        }

        .ProseMirror ul ul {
          list-style-type: circle;
        }

        .ProseMirror ul ul ul {
          list-style-type: square;
        }

        /* Alignment styles for individual list items */
        .ProseMirror li[style*="text-align: center"] {
          text-align: center !important;
          list-style-position: inside;
          display: list-item;
          padding-left: 0;
        }

        .ProseMirror li[style*="text-align: right"] {
          text-align: right !important;
          list-style-position: inside;
          display: list-item;
          padding-left: 0;
        }

        .ProseMirror li[style*="text-align: left"] {
          text-align: left !important;
          display: list-item;
        }

        /* Alignment styles for entire lists */
        .ProseMirror ul[style*="text-align: center"],
        .ProseMirror ol[style*="text-align: center"] {
          text-align: center;
          list-style-position: inside;
          padding-left: 0;
          display: block;
          width: 100%;
        }

        .ProseMirror ul[style*="text-align: center"] li,
        .ProseMirror ol[style*="text-align: center"] li {
          text-align: center;
          list-style-position: inside;
        }

        .ProseMirror ul[style*="text-align: right"],
        .ProseMirror ol[style*="text-align: right"] {
          text-align: right;
          list-style-position: inside;
          padding-left: 0;
          display: block;
          width: 100%;
        }

        .ProseMirror ul[style*="text-align: right"] li,
        .ProseMirror ol[style*="text-align: right"] li {
          text-align: right;
          list-style-position: inside;
        }

        .ProseMirror ul[style*="text-align: left"],
        .ProseMirror ol[style*="text-align: left"] {
          text-align: left;
          padding-left: 1.5rem;
        }

        .ProseMirror ul[style*="text-align: left"] li,
        .ProseMirror ol[style*="text-align: left"] li {
          text-align: left;
        }

        /* Override prose styles */
        .prose .ProseMirror ul[style*="text-align: center"],
        .prose .ProseMirror ol[style*="text-align: center"] {
          margin-left: auto;
          margin-right: auto;
        }

        .prose .ProseMirror ul[style*="text-align: right"],
        .prose .ProseMirror ol[style*="text-align: right"] {
          margin-left: auto;
          margin-right: 0;
        }
      `}</style>
    </div>
  );
}
