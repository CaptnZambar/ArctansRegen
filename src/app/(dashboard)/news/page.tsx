import { NewsView } from "@/modules/news/ui/views/news-view";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async () => {

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session) {
        redirect("/sign-in")
    }

    return (
        <NewsView />
    )
}

export default Page;