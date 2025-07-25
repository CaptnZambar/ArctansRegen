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
    const container = document.querySelector('main') || window;
    // IntersectionObserver watching loaderRef in viewport
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
      {posts.map((post) => {
        const imageSrc = post.imageUrl + `?random=${post.id}`;
        return (
          <div
            key={post.id}
            className="bg-white/10 rounded-lg overflow-hidden p-4"
          >
            <div className="flex justify-between items-center mb-2">
              <p>{post.text}</p>
              <p>{post.id}</p>
            </div>

            <img
              src={imageSrc}
              alt="post"
              className="w-full object-cover h-60 rounded-md"
            />
          </div>
        );
      })}

      <div ref={loaderRef} className="h-1">{loading && <p className="text-center">Loading more posts...</p>}</div>
    </div>
  );
}

export default Posts;
