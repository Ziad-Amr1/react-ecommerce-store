import { useEffect, useState } from "react";

export default function ProductImagePreview({ file, alt }) {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) return undefined;

    let isActive = true;
    let objectUrl = "";

    const loadPreview = () => {
      if (typeof file === "string" && file.startsWith("blob:")) {
        setPreviewUrl(file);
        return;
      }

      if (typeof FileReader !== "undefined") {
        const reader = new FileReader();

        reader.onload = () => {
          if (isActive) {
            setPreviewUrl(String(reader.result || ""));
          }
        };

        reader.onerror = () => {
          try {
            objectUrl = URL.createObjectURL(file);
            if (isActive) {
              setPreviewUrl(objectUrl);
            }
          } catch {
            if (isActive) {
              setPreviewUrl("");
            }
          }
        };

        reader.readAsDataURL(file);
        return;
      }

      try {
        objectUrl = URL.createObjectURL(file);
        if (isActive) {
          setPreviewUrl(objectUrl);
        }
      } catch {
        if (isActive) {
          setPreviewUrl("");
        }
      }
    };

    loadPreview();

    return () => {
      isActive = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [file]);

  if (!file) return null;

  if (!previewUrl) {
    return null;
  }

  return <img src={previewUrl} alt={alt} className="h-full w-full object-cover" />;
}