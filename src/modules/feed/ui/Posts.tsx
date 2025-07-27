"use client";

import { Post } from "@/db/schema";
import { useEffect, useState, useRef } from "react";

function Posts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [areMorePosts, setAreMorePosts] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const getPosts = async () => {
    setLoading(true);
    const limit = 5;
    const res = await fetch(`/api/posts?page=${page}&limit=${limit}`);
    const { posts: newPosts } = await res.json();

    if (newPosts.length < limit) {
      setAreMorePosts(false);
    }

    setPosts((prev) => (page === 1 ? newPosts : [...prev, ...newPosts]));
    setLoading(false);
  };

  useEffect(() => {
    if (areMorePosts) {
      getPosts();
    }
  }, [page, areMorePosts]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !loading && areMorePosts) {
          setPage((prev) => prev + 1);
        }
      },
      {
        root: null,
        rootMargin: '100px',
      }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loading, areMorePosts]);

  return (
    <div className="mt-10 w-full max-w-lg flex flex-col gap-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white/10 rounded-lg p-4">
          <div className="flex justify-between items-baseline mb-2">
            <div>
              <h3 className="text-xl font-semibold">{post.title}</h3>
              <p className="text-sm opacity-75">
                by {post.authorId} •{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
            </div>
            <span className="text-zinc-500">#{post.id}</span>
          </div>
          <p className="mb-4">{post.text}</p>
          {post.imageUrl && (
            <img
              src={`${post.imageUrl}?random=${post.id}`}
              alt="post"
              className="w-full h-60 object-cover rounded-md"
            />
          )}
        </div>
      ))}

      <div ref={loaderRef} className="h-1">{loading && <p className="text-center">Loading more posts...</p>}</div>
    </div>
  );
}

export default Posts;
