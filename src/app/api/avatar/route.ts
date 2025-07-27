// src/app/api/user/avatar/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/index";
import { user, cloudinaryFiles } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

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

  await db
    .update(user)
    .set({ image: secure_url })
    .where(eq(user.id, session.user.id));

  return NextResponse.json({ success: true });
}
