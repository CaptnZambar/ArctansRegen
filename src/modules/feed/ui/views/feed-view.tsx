"use client"

import Button from "@/components/Button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export const FeedView = () => {

    const router = useRouter()
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
            This is feed
            <p>Welcome {session.user.name}!</p>
            <Button onClick={() => authClient.signOut({
                fetchOptions: { 
                    onSuccess: () => router.push("/sign-in")} 
                })
                }>
                Sign Out
            </Button>
        </div>
    )
}