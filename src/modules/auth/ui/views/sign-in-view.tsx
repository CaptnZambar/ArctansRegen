"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import Link from "next/link";
import Input from "@/components/Input";
import Button from "@/components/Button";

const formSchema = z.object({
    email: z.email({ message: "Invalid email address" }),
    password: z.string().min(1, { message: "Password is required" }),
});

export const SignInView = () => {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: { email: "", password: "" },
    });

    const onSubmit = (data: z.infer<typeof formSchema>) => {
        setError(null);
        setIsLoading(true);

        authClient.signIn.email(
            {
                email: data.email,
                password: data.password,
            },
            {
                onSuccess: () => {
                    router.push("/feed");
                    setIsLoading(false);
                },
                onError: ({ error }) => {
                    setError(error.message);
                    setIsLoading(false);
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md text-center">
                <h1 className="text-5xl font-bold mb-3">Sign In</h1>
                <p className="text-gray-400 mb-3">
                    Connect and share your knowledge with other members
                </p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-4 mb-3">
                        <Input
                            id="email"
                            type="email"
                            placeholder="Email"
                            {...register("email")}
                            error={errors.email?.message}
                        />
                        <Input
                            id="password"
                            type="password"
                            placeholder="Password"
                            {...register("password")}
                            error={errors.password?.message}
                        />

                        {error && (
                            <p className="text-center text-sm text-red-500">{error}</p>
                        )}

                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Loading…" : "Connect"}
                        </Button>
                    </div>
                </form>

                <div>
                    <p className="mb-3">
                        Don’t have an account?{" "}
                        <Link href="/sign-up" className="text-custom-yellow-200">
                            Sign Up
                        </Link>
                    </p>
                    <p className="text-custom-yellow-200">
                        <Link href="/">Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
