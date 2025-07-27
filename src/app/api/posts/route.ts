// src/app/api/posts/route.ts
import { NextResponse } from "next/server";
import { db } from "@/db/index";
import { posts } from "@/db/schema";
import { desc } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 5);
  const offset = (page - 1) * limit;

  // fetch posts with author name
  const result = await db
    .select({
      id: posts.id,
      title: posts.title,
      text: posts.text,
      imageUrl: posts.imageUrl,
      createdAt: posts.createdAt,
      authorId: posts.authorId,
    })
    .from(posts)
    .orderBy(desc(posts.createdAt))
    .limit(limit)
    .offset(offset);

  return NextResponse.json({ posts: result });
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, text, imageUrl } = await request.json();

  if (!title || !text) {
    return NextResponse.json(
      { error: "Title and text are required" },
      { status: 400 }
    );
  }

  const insertResult = await db
    .insert(posts)
    .values({
      title,
      text,
      imageUrl,
      authorId: session.user.id,
    })
    .returning({
      id: posts.id,
      title: posts.title,
      text: posts.text,
      imageUrl: posts.imageUrl,
      createdAt: posts.createdAt,
      authorId: posts.authorId,
    });

  return NextResponse.json({ post: insertResult[0] }, { status: 201 });
}
