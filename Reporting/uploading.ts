import { useState } from "react";

export const useUploadImagesToStorage = () => {
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);

  // Upload images to /api/propertyimg (Supabase handler)
  const uploadImagesToStorage = async (): Promise<string[]> => {
    if (uploadedImages.length === 0) return [];

    const urls: string[] = [];
    setUploading(true);

    try {
      for (const file of uploadedImages) {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/propertyimg", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          let errorMsg = "Failed to upload image";
          try {
            const errorData: { error?: string } = await response.json();
            errorMsg = errorData.error ?? errorMsg;
          } catch {
            // fallback if response isn't JSON
          }
          throw new Error(errorMsg);
        }

        const { url }: { url: string } = await response.json();
        urls.push(url);
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      throw error;
    } finally {
      setUploading(false);
    }

    return urls;
  };

  return {
    uploading,
    uploadedImages,
    setUploadedImages, // call this with File[] from <input type="file" />
    uploadImagesToStorage,
  };
};
