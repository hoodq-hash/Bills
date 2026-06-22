import { v2 as cloudinary } from "cloudinary";

export function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export function isCloudinaryConfigured() {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export async function uploadToCloudinary(
  source: Buffer | string,
  options?: { publicId?: string }
) {
  if (!isCloudinaryConfigured()) {
    throw new Error("Cloudinary is not configured");
  }

  configureCloudinary();

  const uploadOptions = {
    folder: "elite-notes/products",
    ...(options?.publicId ? { public_id: options.publicId } : {}),
  };

  if (Buffer.isBuffer(source)) {
    return new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          uploadOptions,
          (error, result) => {
            if (error || !result) reject(error ?? new Error("Upload failed"));
            else resolve({ secure_url: result.secure_url, public_id: result.public_id });
          }
        );
        stream.end(source);
      }
    );
  }

  const result = await cloudinary.uploader.upload(source, uploadOptions);
  return { secure_url: result.secure_url, public_id: result.public_id };
}

export function getPublicIdFromUrl(imageUrl: string): string | null {
  try {
    const marker = "/upload/";
    const idx = imageUrl.indexOf(marker);
    if (idx === -1) return null;
    const path = imageUrl.slice(idx + marker.length).replace(/^v\d+\//, "");
    return path.replace(/\.[^/.]+$/, "");
  } catch {
    return null;
  }
}

export async function deleteFromCloudinary(imageUrl: string) {
  if (!imageUrl.includes("cloudinary") || !isCloudinaryConfigured()) return;

  configureCloudinary();
  const publicId = getPublicIdFromUrl(imageUrl);
  if (publicId) {
    await cloudinary.uploader.destroy(publicId);
  }
}
