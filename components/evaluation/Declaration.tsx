"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useUploadImagesToStorage } from "@/Reporting/uploading";

// Declaration data structure
export interface DeclarationData {
  techName: string;
  techPosition: string;
  techDate: string;
  techSignature: string | null;
  techStatement: string;
  assistantName: string;
  assistantDate: string;
  assistantSignature: string | null;
  assistantStatement: string;
  finalStatement: string;
  finalSignature: string | null;
}

// Props
interface DeclarationProps {
  user: any | null;
  value?: DeclarationData;
  createdAt?: string | null;
  onChange?: (val: DeclarationData) => void;
}

const Declaration: React.FC<DeclarationProps> = ({
  user,
  value,
  createdAt,
  onChange,
}) => {
  // ⬇️ Hook for uploading images
  const {
    uploading,
    uploadedImages,
    setUploadedImages,
    uploadImagesToStorage,
  } = useUploadImagesToStorage();

  const getInitialData = (): DeclarationData => ({
    techName: user
      ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
      : "_________",
    techPosition: user?.title || "n/a",
    techDate: createdAt
      ? new Date(createdAt).toLocaleDateString()
      : value?.techDate || "",
    techSignature: user?.signature || null,
    techStatement:
      value?.techStatement ||
      user?.declaration_content ||
      `Technician Valuer, hereby declare that I have personally captured and collected accurate and real information data related to the property / asset assessment, including but not limited to the following: Building dimensions; 	Photographs of the property; Geographic coordinates; Additional relevant data collected during the assessment.
I hold myself responsible and confirm that the information provided is true and certain to the best of my knowledge and belief."
`,
    assistantName: value?.assistantName || "_________",
    assistantDate: value?.assistantDate || "",
    assistantSignature: value?.assistantSignature || null,
    assistantStatement:
      value?.assistantStatement ||
      `I, Assistant Valuer name
have thoroughly reviewed and cross-checked this Valuation Report prepared by 
HABINSHUTI EVARISTE
I have: Examined the property description for accuracy and completeness; verified the maps, survey plans, and location details to ensure consistency with the valuation, assessed all supporting documents (title deeds, zoning certificates, etc.) for relevance and correctness, Scrutinized the computations, adjustments, and valuation methodology applied to confirm compliance with industry standards and regulatory requirements. Any discrepancies or concerns identified during the review have been addressed and resolved to ensure the integrity of the final valuation. I solemnly declare that the above statements are true and correct to the best of my knowledge and belief. 
`,
    finalStatement:
      value?.finalStatement ||
      `
I, Valuer Phocas NIYONGOMBWA, hereby certify that I have no direct or indirect interest, financial or otherwise, in the property being valued or the parties involved that would compromise my impartiality and independence in conducting this property valuation. I have not been influenced by any party to the transaction, and my valuation is based solely on my professional judgment and analysis.
`,
    finalSignature: value?.finalSignature || null,
  });

  const [formData, setFormData] = useState<DeclarationData>(getInitialData());

  useEffect(() => {
    setFormData(getInitialData());
  }, [user, value, createdAt]);

  const editor = useEditor({
    extensions: [StarterKit],
    content: formData.techStatement,
    onUpdate: ({ editor }) => updateField("techStatement", editor.getHTML()),
  });

  useEffect(() => {
    if (editor && formData.techStatement) {
      editor.commands.setContent(formData.techStatement);
    }
  }, [formData.techStatement, editor]);

  const updateField = (name: keyof DeclarationData, val: any) => {
    setFormData((prev) => {
      const updated = { ...prev, [name]: val };
      onChange?.(updated);
      return updated;
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    updateField(name as keyof DeclarationData, value);
  };

  const renderSignature = (signature: string | null) =>
    signature ? (
      <img
        src={signature}
        alt="Signature"
        className="w-32 h-16 object-contain border"
      />
    ) : (
      <p>_________</p>
    );

  // ⬇️ New handler for uploading signatures
  const handleSignatureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "assistantSignature" | "finalSignature"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // set file to hook state
    setUploadedImages([file]);

    // upload & get URLs
    const urls = await uploadImagesToStorage();
    if (urls.length > 0) {
      updateField(field, urls[0]); // save the uploaded image URL
    }
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden mb-8">
      <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white px-4 py-2 font-bold text-lg">
        DECLARATIONS
      </div>

      <div className="bg-white text-black p-4 text-sm">
        {/* Technical Declaration */}
        <Section title="1. Declaration of Data Collection and Accuracy">
          <p>
            I, <strong>{formData.techName.toUpperCase()}</strong> (
            {formData.techPosition}), hereby declare that:
          </p>
          <div className="border border-gray-200 rounded p-2 mb-2">
            <EditorContent editor={editor} />
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Position:</strong> {formData.techPosition}
              </p>
              <p>
                <strong>Date Evaluated:</strong> {formData.techDate || "N/A"}
              </p>
            </div>
            <div>
              <p>
                <strong>Signature:</strong>
              </p>
              {renderSignature(formData.techSignature)}
            </div>
          </div>
        </Section>

        {/* Assistant Declaration */}
        <Section title="2. Declaration Report Cross-Checking">
          <p>{formData.assistantStatement}</p>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p>
                <strong>Date:</strong>{" "}
                <input
                  type="date"
                  name="assistantDate"
                  value={formData.assistantDate}
                  onChange={handleChange}
                  className="border p-1 rounded"
                />
              </p>
            </div>
            <div>
              <p>
                <strong>Signature:</strong>
              </p>
              {renderSignature(formData.assistantSignature)}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSignatureUpload(e, "assistantSignature")}
                className="mt-2"
                disabled={uploading}
              />
            </div>
          </div>
        </Section>

        {/* Final Declaration */}
        <Section title="Final Declaration">
          <p>{formData.finalStatement}</p>
          <div className="mt-4 grid grid-cols-1 gap-4 text-sm">
            <div>
              <p>
                <strong>Signature:</strong>
              </p>
              {renderSignature(formData.finalSignature)}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleSignatureUpload(e, "finalSignature")}
                className="mt-2"
                disabled={uploading}
              />
            </div>
          </div>
        </Section>
      </div>
    </div>
  );
};

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div className="border border-gray-300 p-4 mb-4">
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

export default Declaration;
