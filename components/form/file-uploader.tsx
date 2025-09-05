import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Upload, File as FileIcon, Pen } from "lucide-react";
import { formatFileSize, generateVideoThumbnail, urlToFile } from "@/lib/utils";
import { ControllerRenderProps } from "react-hook-form";
import Image from "next/image";

interface FileUploaderProps {
  field: ControllerRenderProps;
  allowedTypes?: string[];
  maxSize?: number;
  label?: string;
}

export default function FileUploader(props: FileUploaderProps) {
  const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
  ];
  const {
    label,
    field,
    allowedTypes = allowedFileTypes,
    maxSize = 1024 * 1024,
  } = props;
  const [file, setFile] = useState<File | null>();
  const imageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFile = async (filePath: string) => {
    const uploadPath = process.env.NEXT_PUBLIC_UPLOAD_DIR;
    return await urlToFile(`${uploadPath}/${filePath}`, filePath, "image/png");
  };

  useEffect(() => {
    if (field.value?.file) {
      setFile(field.value.file);
    } else if (field.value && typeof field.value === "string") {
      getFile(field.value).then((file) => {
        const fieldValue = { file, previousFile: file, isDirty: false };

        field.onChange(fieldValue);
        setFile(file);
      });
    }
  }, [field, field.value]);

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files ? event.target.files[0] : null;
    if (uploadedFile) {
      handleFileChange(uploadedFile);
    }
  };

  const handleFileChange = async (uploadedFile: File) => {
    if (!allowedTypes.includes(uploadedFile.type.toLowerCase())) {
      alert("This file type is not supported !");
      return;
    }

    if (uploadedFile.size > maxSize) {
      //alert("Uploaded file is too big !");
      //return;
    }

    if (uploadedFile.type.startsWith("video")) {
      const thumbnail = await generateVideoThumbnail(uploadedFile);
      if (imageRef && imageRef.current) {
        imageRef.current.src = thumbnail;
      }
    }
    setFile(uploadedFile);
    field.onChange({ ...field.value, file: uploadedFile, isDirty: true });
  };

  const removeFile = async () => {
    setFile(null);
    field.onChange({ ...field.value, file: null, isDirty: true });
  };

  const isImage = (type: string) => {
    return ["image/jpeg", "image/png", "image/jpg", "image/gif"].includes(
      type.toLowerCase()
    );
  };

  const isVideo = (type: string) => {
    return ["video/mp4", "video/avi"].includes(type);
  };

  const handleFileDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const uploadedFile = event.dataTransfer.files[0];
    if (uploadedFile) {
      handleFileChange(uploadedFile);
    }
  };

  const uploadFileMessage = () => {
    const types = allowedFileTypes.map((t) => {
      const type = t.split("/");
      if (type.length === 2) {
        return type[1];
      }
      return t;
    });
    return `${types
      .map((t) => t.toUpperCase())
      .join(", ")} (MAX. ${formatFileSize(maxSize)})`;
  };

  return (
    <div>
      <div className="mb-2">{label}</div>
      {file ? (
        <div className="flex items-center gap-2 border border-gray-400 border-dashed p-3">
          {isImage(file.type) && (
            <div className="grid grid-cols-1 mb-2">
              <Image
                alt="imagePreview"
                width={150}
                height={150}
                src={URL.createObjectURL(file)}
              />
            </div>
          )}

          {isVideo(file.type) && (
            <div className="grid grid-cols-1 mb-2">
              <Image
                alt="videoPreview"
                ref={imageRef}
                width={100}
                height={100}
                src="/assets/images/upload.png"
              />
            </div>
          )}

          {!isVideo(file.type) && !isImage(file.type) && (
            <div className="grid grid-cols-1 mb-2">
              <FileIcon /> {file.name} [${formatFileSize(file.size)}]
            </div>
          )}

          <Button
            type="button"
            variant="destructive"
            size={"sm"}
            onClick={removeFile}
          >
            <Trash2 /> Remove file
          </Button>
          <Button
            type="button"
            size={"sm"}
            onClick={() => fileInputRef.current?.click()}
          >
            <Pen /> Change file
          </Button>
        </div>
      ) : (
        <>
          <div
            className="flex items-center justify-center w-full"
            onDrop={handleFileDrop}
            onDragOver={(event) => event.preventDefault()}
          >
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-52 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload />
                <p className="mb-2 mt-2 text-sm text-gray-500">
                  <span className="font-semibold">Click to upload</span> or drag
                  and drop
                </p>
                <p className="text-xs text-gray-500">{uploadFileMessage()}</p>
              </div>
            </label>
          </div>
        </>
      )}
      <input
        id="dropzone-file"
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
