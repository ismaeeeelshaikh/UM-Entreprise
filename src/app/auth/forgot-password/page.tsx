"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    otp: z.string().optional(),
    password: z
        .string()
        .min(6, "Password must be at least 6 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^a-zA-Z0-9]/, "Password must contain at least one special character")
        .optional(),
});

export default function ForgotPasswordPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [step, setStep] = useState<"EMAIL" | "OTP" | "PASSWORD">("EMAIL");
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            otp: "",
            password: "",
        },
    });

    async function onSendOtp() {
        setIsLoading(true);
        const email = form.getValues("email");
        try {
            const response = await fetch("/api/auth/otp/send", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, type: "RESET" }),
            });

            if (!response.ok) throw new Error("Failed to send code");

            toast({ title: "Code Sent", description: "Check your email for the verification code." });
            setStep("OTP");
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    async function onVerifyOtp() {
        setIsLoading(true);
        const { email, otp } = form.getValues();
        try {
            const response = await fetch("/api/auth/otp/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, code: otp, type: "RESET" }),
            });

            if (!response.ok) throw new Error("Invalid code");

            toast({ title: "Verified", description: "Please enter your new password." });
            setStep("PASSWORD");
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    async function onResetPassword(values: z.infer<typeof formSchema>) {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: values.email,
                    otp: values.otp, // Security: Send OTP again to verify on server side before reset
                    password: values.password,
                }),
            });

            if (!response.ok) throw new Error("Failed to reset password");

            toast({ title: "Success", description: "Password reset successfully. You can now login." });
            router.push("/auth/signin");
        } catch (error: any) {
            toast({ variant: "destructive", title: "Error", description: error.message });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="container flex h-screen items-center justify-center">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Reset Password</CardTitle>
                    <CardDescription>
                        {step === "EMAIL" && "Enter your email to receive a code"}
                        {step === "OTP" && "Enter the verification code"}
                        {step === "PASSWORD" && "Enter your new password"}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (step === "EMAIL") onSendOtp();
                            else if (step === "OTP") onVerifyOtp();
                            else form.handleSubmit(onResetPassword)();
                        }} className="space-y-4">

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input disabled={step !== "EMAIL" || isLoading} {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {step !== "EMAIL" && (
                                <FormField
                                    control={form.control}
                                    name="otp"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Verification Code</FormLabel>
                                            <FormControl>
                                                <Input disabled={step !== "OTP" || isLoading} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            {step === "PASSWORD" && (
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" disabled={isLoading} {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? "Processing..." : step === "EMAIL" ? "Send Code" : step === "OTP" ? "Verify Code" : "Reset Password"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
