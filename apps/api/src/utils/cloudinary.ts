import cloudinary from "cloudinary";
import config from "../config";
cloudinary.v2.config({
  cloud_name: config.CLOUDINARY_CLOUD_NAME,
  api_key: config.CLOUDINARY_API_KEY,
  API_SECRET: config.CLOUDINARY_API_SECRET,
});

export async function generateSignature(
  userId: number,
  context?: Record<string, any>,
) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = "post_uploads";
  context = context || {};
  context = { ...context, userId };

  const s_context = Object.entries(context)
    .map(([k, v]) => {
      k = k.replaceAll("=", "\=");
      v = `${v}`.replaceAll("=", "\=");
      return `${k}=${v}`;
    })
    .join("|");

  const signature = cloudinary.v2.utils.api_sign_request(
    {
      timestamp,
      folder,
      context: s_context,
    },
    config.CLOUDINARY_API_SECRET,
  );

  return {
    timestamp,
    signature,
    apiKey: config.CLOUDINARY_API_KEY,
    folder,
    context: s_context,
  } as const;
}
