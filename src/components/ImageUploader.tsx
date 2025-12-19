import React from "react";
import { SvgColor } from "./ui";
import { Assets } from "@/constants/assets";

interface ImageUploaderProps {
  loading?: boolean;
  fallbackLetter?: string;
  image?: string | File | null;
  onChange?: (file: File | null) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  image,
  loading,
  onChange,
  fallbackLetter,
}) => {
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const [preview, setPreview] = React.useState<string | null>(null);
  const objectUrlRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    if (!image) {
      setPreview(null);
      return;
    }

    if (typeof image === "string") {
      setPreview(image);
      return;
    }

    if (image instanceof File) {
      const url = URL.createObjectURL(image);
      objectUrlRef.current = url;
      setPreview(url);
    }
  }, [image]);

  React.useEffect(
    () => () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
    },
    []
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    onChange?.(file);
    e.target.value = "";
  };

  const handleClick = () => {
    if (!loading) {
      inputRef.current?.click();
    }
  };

  return (
    <div className="relative">
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={preview}
          alt="Profile"
          className="size-36 rounded-full object-cover"
        />
      ) : (
        <div className="size-36 rounded-full bg-primary text-white flex items-center justify-center">
          <span className="text-4xl leading-none font-semibold">
            {fallbackLetter}
          </span>
        </div>
      )}

      <div
        onClick={handleClick}
        className="bg-primary rounded-full size-11 absolute flex items-center justify-center right-1 -bottom-1 cursor-pointer disabled:cursor-not-allowed"
      >
        {loading ? (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <SvgColor src={Assets.Svgs.Camera} className="bg-white" />
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};
