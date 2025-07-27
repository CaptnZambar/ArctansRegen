"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export const PostView = () => {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const [apiKey, setApiKey] = useState<string>();
  const [signature, setSignature] = useState<string>();
  const [timestamp, setTimestamp] = useState<number>();

  const [secureUrl, setSecureUrl] = useState<string>();

  useEffect(() => {
    fetch("/api/cloudinary/signature")
      .then((res) => res.json())
      .then((body) => {
        if (body.success) {
          setApiKey(body.apiKey);
          setSignature(body.signature);
          setTimestamp(body.timestamp);
        } else {
          console.error("Could not fetch Cloudinary signature");
        }
      });
  }, []);

  useEffect(() => {
    if (file && apiKey && signature && timestamp) {
      const upload = async () => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("api_key", apiKey);
        formData.append("timestamp", String(timestamp));
        formData.append("signature", signature);

        const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
        const url = `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`;

        const res = await fetch(url, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!data.secure_url) {
          throw new Error("Upload to Cloudinary failed");
        }

        await fetch("/api/cloudinary/metadata", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            public_id: data.public_id,
            secure_url: data.secure_url,
            resource_type: data.resource_type,
          }),
        });

        setSecureUrl(data.secure_url);
      };

      upload().catch((err) => {
        console.error(err);
        alert("Image upload failed");
      });
    }
  }, [file, apiKey, signature, timestamp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secureUrl) {
      alert("Please select a file and wait for upload to finish.");
      return;
    }
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, text, imageUrl: secureUrl }),
    });
    if (res.ok) {
      router.push("/feed");
    } else {
      const { error } = await res.json();
      alert("Error: " + error);
    }
  };

  return (
    <main className="max-w-lg mx-auto p-4 text-white">
      <h2 className="text-2xl mb-4">New Trade Analysis</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Title"
          className="p-2 bg-white/10 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Explain your analysis..."
          className="p-2 bg-white/10 rounded h-32"
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
        />

        <label className="flex flex-col">
          <span>Select an image</span>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            required
          />
          {!secureUrl && file && (
            <span className="text-sm opacity-75">
              Uploading image...
            </span>
          )}
          {secureUrl && (
            <img
              src={secureUrl}
              alt="Uploaded preview"
              className="mt-2 h-40 object-contain rounded"
            />
          )}
        </label>

        <button
          type="submit"
          disabled={!secureUrl}
          className="py-2 bg-blue-600 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Publish
        </button>
      </form>
    </main>
  );
};
