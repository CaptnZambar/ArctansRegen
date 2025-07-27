import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/index";
import { cloudinaryFiles } from "@/db/schema";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const { public_id, secure_url, resource_type } = await request.json();
    if (!public_id || !secure_url || !resource_type) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    await db.insert(cloudinaryFiles).values({
      publicId:     public_id,
      mediaUrl:     secure_url,
      resourceType: resource_type,
      userId:       session.user.id,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Drizzle insert error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to save metadata" },
      { status: 500 }
    );
  }
}