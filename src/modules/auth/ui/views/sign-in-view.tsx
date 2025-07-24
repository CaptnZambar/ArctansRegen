"use client"

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";

const formSchema = z.object({
    email: z.email(),
    password: z.string().min(1, { message: "Password is required"})
})

export const SignInView = () => {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: () => {
                    router.push("/");
                },
                onError: ({ error }) => {
                    setError(error.message)
                }
            }
        );

    }

    return (
        <div>
            {/* In the tutorial, the guy wraps <form> with <Form> from ShadCN and gives it {...form}.ow can i do without shadcn?*/}
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col max-w-sm space-y-2">
                    <Input placeholder="Username" name="ez" id="ez" />
                    <Input placeholder="Password" name="ez" id="ez" />
                    <Button>Submit</Button>
                </div>
            </form>
            <Link href="/sign-up" className="text-custom-yellow-200">Sign Up</Link>
        </div>

    )
}