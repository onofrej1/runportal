import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Filter } from "./resources";
import { format } from "date-fns";

export const subtractYears = (date: Date, years: number) => {
  // 👇 make copy with "Date" constructor
  const dateCopy = new Date(date);

  dateCopy.setFullYear(date.getFullYear() - years);

  return dateCopy;
};

export function slugify(str: string) {
  str = str.replace(/^\s+|\s+$/g, ""); // trim leading/trailing white space
  str = str.toLowerCase(); // convert string to lowercase
  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove any non-alphanumeric characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-"); // remove consecutive hyphens
  return str;
}

export const calculateAge = (birthday: Date) => {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, dateFormat?: string) {
  if (dateFormat) {
    return format(date instanceof Date ? date : new Date(date), dateFormat);
  }
  if (date instanceof Date) {
    return date.toLocaleDateString();
  }
  return new Date(date).toLocaleDateString();
}

export function random(list: unknown[]) {
  return list[Math.floor(Math.random() * list.length)];
}

export function randomValues(list: unknown[], count: number, unique = false) {
  if (list.length < count) {
    throw new Error("Count must be less or equal to list length");
  }

  const values: unknown[] = [];
  do {
    const value = list[Math.floor(Math.random() * list.length)];
    if (unique && values.includes(value)) {
      continue;
    }
    values.push(value);
  } while (values.length !== count);
  return values;
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

export function getErrorMessage(error: unknown) {
  return toErrorWithMessage(error).message;
}

type ErrorWithMessage = {
  message: string;
};

export function parseJson(json: string, defaultData = {}) {
  try {
    return JSON.parse(json);
  } catch {
    return defaultData;
  }
}

export function capitalize(str: string) {
  return `${str.charAt(0).toUpperCase()}${str.slice(1)}`;
}

function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError;

  try {
    return new Error(JSON.stringify(maybeError));
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError));
  }
}

export function generateVideoThumbnail(file: File): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    const video = document.createElement("video");

    // this is important
    video.autoplay = true;
    video.muted = true;
    video.src = URL.createObjectURL(file);

    video.onloadeddata = () => {
      const ctx = canvas.getContext("2d");

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      ctx?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      video.pause();
      return resolve(canvas.toDataURL("image/png"));
    };
  });
}

export const formatFileSize = (fileSize: number) => {
  let size = Math.abs(fileSize);

  if (Number.isNaN(size)) {
    return "Invalid file size";
  }

  if (size === 0) {
    return "0 bytes";
  }

  const units = ["bytes", "kB", "MB", "GB", "TB"];
  let quotient = Math.floor(Math.log10(size) / 3);
  quotient = quotient < units.length ? quotient : units.length - 1;
  size /= 1000 ** quotient;

  return `${+size.toFixed(2)} ${units[quotient]}`;
};

export async function urlToFile(
  url: string,
  filename: string,
  mimeType: "image/png"
) {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  return new File([buffer], filename, { type: mimeType });
}

export function getValidFilters(filters: Filter[]) {
  return filters.filter(
    (filter) =>
      filter.operator === "isEmpty" ||
      filter.operator === "isNotEmpty" ||
      (Array.isArray(filter.value)
        ? filter.value.length > 0
        : filter.value !== "" &&
          filter.value !== null &&
          filter.value !== undefined)
  );
}

export function toSentenceCase(str: string) {
  return str
    .replace(/_/g, " ")
    .replace(/([A-Z])/g, " $1")
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase())
    .replace(/\s+/g, " ")
    .trim();
}

export const parseCsv = (content: string, requiredHeaders: string[]) => {
  const lines = content.split("\n").filter(Boolean);
  const csvArray = [];

  const header = lines.shift();
  const headers = header?.split(",");

  const hasAllHeaders = requiredHeaders.every((header) =>
    headers?.includes(header)
  );
  if (!headers || !hasAllHeaders) {
    throw new Error("Missing headers");
  }

  for (const line of lines) {
    const splitLine = line.split(",");
    const record: Record<string, unknown> = {};
    headers.forEach((key, index) => {
      record[key] = splitLine[index].trim();
    });
    csvArray.push(record);
  }
  return csvArray;
};

export const hmsToSeconds = (hms: string) => {
  const a = hms.split(":");
  const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

  return seconds;
};

export const groupArrayByKey = function <T>(xs: T[], key: any) {
  return xs.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {} as Record<string, any>);
};

