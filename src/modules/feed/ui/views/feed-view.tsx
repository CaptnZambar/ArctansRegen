"use client"

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

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
        <div>
            <p>Welcome {session.user.name}!</p>
        </div>
    )
}