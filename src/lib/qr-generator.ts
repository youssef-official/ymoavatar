import QRCode from "qrcode";

export async function generateQRCode(url: string): Promise<string> {
  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      width: 400,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
    });
    return qrDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

export async function uploadQRCode(
  qrDataUrl: string,
  projectId: string
): Promise<string> {
  // Convert data URL to blob
  const response = await fetch(qrDataUrl);
  const blob = await response.blob();
  const file = new File([blob], `qr-${projectId}.png`, { type: "image/png" });

  const { supabase } = await import("@/integrations/supabase/client");
  const { data, error } = await supabase.storage
    .from("ar-content")
    .upload(`qr-codes/${projectId}.png`, file, {
      cacheControl: "3600",
      upsert: true,
    });

  if (error) throw error;

  const { data: { publicUrl } } = supabase.storage
    .from("ar-content")
    .getPublicUrl(data.path);

  return publicUrl;
}
