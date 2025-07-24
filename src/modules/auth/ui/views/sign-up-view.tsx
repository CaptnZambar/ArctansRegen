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

const formSchema = z
    .object({
        name: z.string().min(1, { message: "Name is required" }),
        email: z.email({ message: "Invalid email address" }),
        password: z.string().min(1, { message: "Password is required" }),
        confirmPassword: z.string().min(1, { message: "Confirm your password" }),
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
            confirmPassword: "",
        },
    });

    const {
        handleSubmit,
        register,
        formState: { errors, isSubmitting },
    } = form;

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
                    router.push("/sign-in");
                },
                onError: ({ error }) => {
                    setError(error.message);
                },
            }
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-full max-w-md text-center">
                <h1 className="text-5xl font-bold mb-3">Sign Up</h1>
                <p className="text-gray-400 mb-3">Reserved for members</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col space-y-4 mb-3">
                        <Input
                            id="name"
                            placeholder="Username"
                            {...register("name")}
                            error={errors.name?.message}
                        />
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
                            placeholder="**********"
                            {...register("password")}
                            error={errors.password?.message}
                        />
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="**********"
                            {...register("confirmPassword")}
                            error={errors.confirmPassword?.message}
                        />

                        {error && (
                            <p className="text-center text-sm text-red-500">{error}</p>
                        )}

                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </div>
                </form>

                <div>
                    <p className="mb-3">
                        Already have an account? <Link href="/sign-in" className="text-custom-yellow-200">Sign In</Link>
                    </p>
                    <p className="text-custom-yellow-200">
                        <Link href="/">Home</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
