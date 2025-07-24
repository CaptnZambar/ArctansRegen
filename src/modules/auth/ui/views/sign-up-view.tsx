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
    name: z.string().min(1, { message: "Name is required"}),
    email: z.email(),
    password: z.string().min(1, { message: "Password is required"}),
    confirmPassword: z.string().min(1, { message: "Password is required"})
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

export const SignUpView = () => {

    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: ""
        }
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        authClient.signUp.email(
            {
                name: data.name,
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
        <div className="">
            {/* In the tutorial, the guy wraps <form> with <Form> from ShadCN and gives it {...form}.ow can i do without shadcn?*/}
                <form onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex flex-col max-w-sm space-y-2">
                        <Input placeholder="Username" name="name" id="name" />
                        <Input placeholder="Email" name="email" id="email" />
                        <Input placeholder="Password" name="password" id="password" />
                        <Input placeholder="Confirm Password" name="confirmPassword" id="confirmPassword" />
                        <Button>Submit</Button>
                    </div>
                </form>
                <Link href="/sign-in" className="text-custom-yellow-200">Sign In</Link>
        </div>

    )
}