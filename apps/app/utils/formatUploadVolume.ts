import { formatBytes } from "@/hooks/general/use-file-upload";

const BYTES_PER_GB = 1024 * 1024 * 1024;

export function formatUploadVolumeDisplay(uploadBytes: number, uploadGb: number) {
  if (uploadBytes <= 0) {
    return { primary: "0 GB", secondary: "0 B" };
  }

  if (uploadGb >= 0.01) {
    return {
      primary: `${uploadGb.toFixed(2)} GB`,
      secondary: formatBytes(uploadBytes),
    };
  }

  return {
    primary: formatBytes(uploadBytes),
    secondary: `${uploadGb.toFixed(4)} GB`,
  };
}

export function formatUploadVolumeHint(uploadBytes: number, uploadGb: number) {
  const { primary, secondary } = formatUploadVolumeDisplay(uploadBytes, uploadGb);
  return `Used: ${primary} (${secondary})`;
}

export { BYTES_PER_GB };
