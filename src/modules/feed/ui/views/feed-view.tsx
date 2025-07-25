"use client"

import Posts from "@/components/Posts";
import { authClient } from "@/lib/auth-client";

export const FeedView = () => {

    const { data: session } = authClient.useSession();

    if (!session) {
        return (
            <div>
                Loading...
            </div>
        )
    }

    return (
        <main className="min-h-screen text-white p-4 flex flex-col pb-20">
        <h1 className="text-4xl font-bold">Les Trades</h1>
        <Posts />
        </main>
    )
}