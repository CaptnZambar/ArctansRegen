"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export const SettingsView = () => {
  const router = useRouter();
  const [file, setFile]             = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [apiKey, setApiKey]         = useState<string>();
  const [signature, setSignature]   = useState<string>();
  const [timestamp, setTimestamp]   = useState<number>();
  const [Uploading, setUploading]   = useState(false);

  useEffect(() => {
    fetch("/api/cloudinary/signature")
      .then((r) => r.json())
      .then((b) => {
        if (b.success) {
          setApiKey(b.apiKey);
          setSignature(b.signature);
          setTimestamp(b.timestamp);
        } else {
          console.error("Cloudinary signature failed", b);
        }
      });
  }, []);

  useEffect(() => {
    if (!file || !apiKey || !signature || !timestamp) return;

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

    const upload = async () => {
      setUploading(true);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", apiKey);
      fd.append("timestamp", String(timestamp));
      fd.append("signature", signature);

      const res = await fetch(url, { method: "POST", body: fd });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Cloudinary HTTP ${res.status}: ${errText}`);
      }
      const data = await res.json();

      if (!data.secure_url) {
        throw new Error("No secure_url in Cloudinary response");
      }

      const saveRes = await fetch("/api/avatar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          public_id:     data.public_id,
          secure_url:    data.secure_url,
          resource_type: data.resource_type,
        }),
      });
      const saveBody = await saveRes.json();
      if (!saveBody.success) {
        throw new Error("Failed to save avatar: " + saveBody.error);
      }

      setPreviewUrl(data.secure_url);
      setUploading(false);
    };

    upload().catch((err) => {
      console.error(err);
      alert("Avatar upload failed: " + err.message);
      setUploading(false);
    });
  }, [file, apiKey, signature, timestamp]);

  return (
    <div className="max-w-md mx-auto p-4 text-white">
      <h1 className="text-3xl mb-6">Settings</h1>

      <label className="block mb-4">
        <span className="block mb-1">Upload Avatar</span>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </label>

      {Uploading && <p>Uploading avatar…</p>}

      {previewUrl && (
        <div className="mb-4">
          <p className="mb-2">Preview:</p>
          <img
            src={previewUrl}
            alt="Avatar preview"
            className="h-24 w-24 rounded-full object-cover"
          />
        </div>
      )}

      <button
        onClick={() => router.refresh()}
        className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
      >
        Refresh Profile
      </button>
    </div>
  );
};
