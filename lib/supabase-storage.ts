function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`${name} is not set`);
  }
  return value;
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
}

export async function uploadResumeFileToSupabaseStorage(input: {
  userId: string;
  file: File;
}) {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "resumes";

  const safeFileName = sanitizeFileName(input.file.name);
  const storageKey = `${input.userId}/${Date.now()}_${safeFileName}`;
  const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${storageKey}`;

  const arrayBuffer = await input.file.arrayBuffer();
  const body = new Uint8Array(arrayBuffer);

  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": input.file.type || "application/octet-stream",
      "x-upsert": "false",
    },
    body,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase storage upload failed: ${text || response.statusText}`);
  }

  return {
    bucket,
    storageKey,
  };
}

export async function downloadResumeFileFromSupabaseStorage(input: {
  storageKey: string;
  bucket?: string;
}) {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = input.bucket ?? process.env.SUPABASE_STORAGE_BUCKET ?? "resumes";

  const downloadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${input.storageKey}`;
  const response = await fetch(downloadUrl, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase storage download failed: ${text || response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

export async function deleteResumeFileFromSupabaseStorage(input: {
  storageKey: string;
  bucket?: string;
}) {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = input.bucket ?? process.env.SUPABASE_STORAGE_BUCKET ?? "resumes";
  const objectUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${input.storageKey}`;

  const response = await fetch(objectUrl, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase storage delete failed: ${text || response.statusText}`);
  }
}

export async function createSignedResumeFileUrl(input: {
  storageKey: string;
  expiresIn?: number;
  bucket?: string;
}) {
  const supabaseUrl = getRequiredEnv("SUPABASE_URL");
  const serviceRoleKey = getRequiredEnv("SUPABASE_SERVICE_ROLE_KEY");
  const bucket = input.bucket ?? process.env.SUPABASE_STORAGE_BUCKET ?? "resumes";
  const expiresIn = input.expiresIn ?? 60;
  const url = `${supabaseUrl}/storage/v1/object/sign/${bucket}/${input.storageKey}`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${serviceRoleKey}`,
      apikey: serviceRoleKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ expiresIn }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase storage sign failed: ${text || response.statusText}`);
  }

  const data = (await response.json()) as { signedURL?: string };
  if (!data.signedURL) {
    throw new Error("Supabase storage sign failed: missing signed URL");
  }

  return `${supabaseUrl}/storage/v1${data.signedURL}`;
}
