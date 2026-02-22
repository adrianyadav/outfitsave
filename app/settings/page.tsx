"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function SettingsPage() {
    const { data: session, status } = useSession();
    const { toast } = useToast();
    const [hasPassword, setHasPassword] = useState<boolean | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    useEffect(() => {
        if (session?.user?.email) {
            checkPasswordStatus();
        }
    }, [session]);

    const checkPasswordStatus = async () => {
        try {
            const response = await fetch("/api/auth/check-password", {
                method: "GET",
            });

            if (response.ok) {
                const data = await response.json();
                setHasPassword(data.hasPassword);
            }
        } catch (error) {
            console.error("Error checking password status:", error);
        }
    };

    const handleSetPassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match",
                variant: "destructive",
            });
            return;
        }

        if (password.length < 6) {
            toast({
                title: "Error",
                description: "Password must be at least 6 characters long",
                variant: "destructive",
            });
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch("/api/auth/set-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ password }),
            });

            const data = await response.json();

            if (response.ok) {
                toast({
                    title: "Success",
                    description: data.message,
                });
                setPassword("");
                setConfirmPassword("");
                setHasPassword(true);
            } else {
                toast({
                    title: "Error",
                    description: data.error,
                    variant: "destructive",
                });
            }
        } catch {
            toast({
                title: "Error",
                description: "Failed to set password",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Loading...</div>
            </div>
        );
    }

    if (status === "unauthenticated") {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div>Please sign in to access settings.</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-dark-grey)] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 font-['var(--font-f-lausanne-400)']">
            <div className="max-w-2xl mx-auto">
                {/* Header Section */}
                <div className="mb-16">
                    <h1 className="text-[clamp(3rem,6vw,8rem)] leading-[0.85] font-['var(--font-f-lausanne-300)'] tracking-[-0.04em] whitespace-nowrap -ml-[0.05em] mb-4">
                        Settings
                    </h1>
                    <p className="text-[clamp(1rem,1.2vw,1.5rem)] text-[var(--color-white-06)]">
                        Manage your account preferences and security.
                    </p>
                </div>

                <div className="space-y-10 border-t border-white/10 pt-12">
                    <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">Email</Label>
                        <p className="text-xl tracking-wide">{session?.user?.email}</p>
                    </div>

                    <div className="space-y-2">
                        <Label className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">Name</Label>
                        <p className="text-xl tracking-wide">{session?.user?.name}</p>
                    </div>

                    {hasPassword !== null ? (
                        <div className="space-y-2">
                            <Label className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">Password Status</Label>
                            <div className="flex items-center gap-2">
                                {hasPassword ? (
                                    <>
                                        <CheckCircle className="h-4 w-4 text-green-400" />
                                        <span className="text-sm text-green-400/90">Password is set</span>
                                    </>
                                ) : (
                                    <>
                                        <AlertCircle className="h-4 w-4 text-yellow-400" />
                                        <span className="text-sm text-yellow-400/90">No password set (Google account only)</span>
                                    </>
                                )}
                            </div>
                        </div>
                    ) : null}

                    {hasPassword === false ? (
                        <div className="mt-16 p-8 border border-white/10 bg-white/5 relative overflow-hidden group">
                            <h2 className="text-2xl font-['var(--font-f-lausanne-300)'] mb-2">Set a Password</h2>
                            <p className="text-sm text-[var(--color-white-06)] mb-8 max-w-sm">
                                Add a password to your account so you can sign in with email and password in addition to Google.
                            </p>
                            <form onSubmit={handleSetPassword} className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">New Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter your new password"
                                        required
                                        minLength={6}
                                        className="bg-transparent border-white/20 text-white placeholder:text-white/20 rounded-none focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white h-12"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Confirm your new password"
                                        required
                                        className="bg-transparent border-white/20 text-white placeholder:text-white/20 rounded-none focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white h-12"
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full h-12 bg-white text-black font-medium hover:bg-[var(--color-white-08)] transition-colors disabled:opacity-50 mt-4"
                                >
                                    {isLoading ? "Setting password..." : "Set Password"}
                                </button>
                            </form>
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
} 