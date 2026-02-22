"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import OutfitCard from "@/components/ui/outfit-card";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";

interface OutfitItem {
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
}

interface Outfit {
    id: number;
    name: string;
    description?: string;
    imageUrl?: string;
    tags: string[];
    isPrivate: boolean;
    shareSlug?: string;
    createdAt: string;
    items: OutfitItem[];
}

// Disable static generation
export const dynamic = "force-dynamic";

function MyOutfitsList() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const { data: session } = useSession();
    const { toast } = useToast();

    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [sharingOutfit, setSharingOutfit] = useState<number | null>(null);
    const [deletingOutfit, setDeletingOutfit] = useState<number | null>(null);

    useEffect(() => {
        async function fetchMyOutfits() {
            setIsLoading(true);
            try {
                const res = await fetch(`/api/my-outfits?page=${page}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch outfits");
                }
                const data = await res.json();
                setOutfits(data.outfits);
                setTotalPages(data.totalPages);
            } catch (error) {
                console.error("Error fetching outfits:", error);
            } finally {
                setIsLoading(false);
            }
        }

        fetchMyOutfits();
    }, [page]);

    const handleShare = async (outfitId: number) => {
        if (sharingOutfit === outfitId) return;

        setSharingOutfit(outfitId);
        try {
            const response = await fetch(`/api/outfits/${outfitId}/share`, {
                method: "POST",
            });

            if (response.ok) {
                const { shareUrl } = await response.json();
                await navigator.clipboard.writeText(shareUrl);
                toast({
                    title: "Success",
                    description: "Share link copied to clipboard!",
                });
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to generate share link",
                });
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to share outfit. Please try again later.",
            });
        } finally {
            setSharingOutfit(null);
        }
    };

    const handleDelete = async (outfitId: number) => {
        if (deletingOutfit === outfitId) return;

        setDeletingOutfit(outfitId);
        try {
            const response = await fetch(`/api/outfits/${outfitId}`, {
                method: "DELETE",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                // Remove the outfit from the local state
                setOutfits(prevOutfits => prevOutfits.filter(outfit => outfit.id !== outfitId));
                // Ensure we stay on the my-outfits page
                window.location.href = "/my-outfits";
                toast({
                    title: "Success",
                    description: "Outfit deleted successfully!",
                });
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to delete outfit",
                });
            }
        } catch {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to delete outfit. Please try again later.",
            });
        } finally {
            setDeletingOutfit(null);
        }
    };

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center min-h-[200px]">
                    <div data-testid="loading-spinner" className="w-10 h-10 border-4 border-royal border-t-transparent rounded-full animate-spin"></div>
                    <p className="ml-3 text-muted-foreground">Loading your outfits...</p>
                </div>
            ) : (
                <>
                    {outfits.length === 0 ? (
                        <div className="text-center space-y-8 py-32 border-t border-white/10 mt-12" data-testid="no-outfits-message">
                            <h3 className="text-[clamp(2rem,4vw,4rem)] leading-none font-['var(--font-f-lausanne-300)'] tracking-[-0.02em] text-white">No outfits yet</h3>
                            <p className="text-[clamp(1rem,1.5vw,1.5rem)] text-[var(--color-white-06)] font-['var(--font-f-lausanne-400)'] max-w-2xl mx-auto">
                                You haven&apos;t created any outfits yet. Start building your fashion collection!
                            </p>
                            <Link 
                                href="/outfits/new" 
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-full font-['var(--font-f-lausanne-400)'] hover:bg-[var(--color-white-08)] transition-colors hover:scale-[1.02] active:scale-[0.98]" 
                                data-testid="create-first-outfit-button"
                            >
                                Create Your First Outfit
                            </Link>
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8" data-testid="outfits-grid">
                            {outfits.map((outfit, index) => (
                                <div key={outfit.id} className={`break-inside-avoid ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-8'}`}>
                                    <OutfitCard
                                        outfit={outfit}
                                        showActions={true}
                                        onShare={handleShare}
                                        onDelete={handleDelete}
                                        sharingOutfit={sharingOutfit}
                                        deletingOutfit={deletingOutfit}
                                        currentUserId={session?.user?.id}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 ? (
                        <div className="flex justify-center items-center space-x-6 mt-20 pt-10 border-t border-white/10 font-['var(--font-f-lausanne-400)']">
                            {page > 1 && (
                                <Link 
                                    href={`/my-outfits?page=${page - 1}`} 
                                    className="px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all flex items-center gap-2"
                                >
                                    Previous
                                </Link>
                            )}
                            <div className="text-[var(--color-white-06)]">
                                Page <span className="text-white">{page}</span> of {totalPages}
                            </div>
                            {page < totalPages && (
                                <Link 
                                    href={`/my-outfits?page=${page + 1}`} 
                                    className="px-6 py-3 border border-white/20 rounded-full hover:bg-white hover:text-black transition-all flex items-center gap-2"
                                >
                                    Next
                                </Link>
                            )}
                        </div>
                    ) : null}
                </>
            )}
        </>
    );
}

export default function MyOutfitsPage() {
    return (
        <div className="min-h-screen bg-[var(--color-dark-grey)] text-white pt-32 pb-24">
            <div className="max-w-[2000px] mx-auto px-6 md:px-12">
                {/* Header Section */}
                <div className="mb-20">
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
                        <div className="flex-1">
                            <h1 className="text-[clamp(4rem,10vw,12rem)] leading-[0.85] font-['var(--font-f-lausanne-300)'] tracking-[-0.04em] whitespace-nowrap -ml-[0.05em] mb-8">
                                Outfits
                            </h1>
                            <p className="text-[clamp(1.2rem,2vw,2.5rem)] leading-[1.3] font-['var(--font-f-lausanne-400)'] font-light max-w-2xl lg:max-w-4xl text-[var(--color-white-06)]">
                                Manage and organize your personal collection.<br className="hidden md:block" /> Create, edit, and share your favorite styles.
                            </p>
                        </div>
                        <Link 
                            href="/outfits/new" 
                            className="mt-8 lg:mt-0 self-start lg:self-end flex items-center justify-center px-8 py-4 bg-white text-black rounded-full font-['var(--font-f-lausanne-400)'] hover:bg-[var(--color-white-08)] transition-colors hover:scale-[1.02] active:scale-[0.98]"
                            data-testid="create-new-outfit-button"
                        >
                            Create New Outfit
                        </Link>
                    </div>
                </div>

                <Suspense fallback={
                    <div className="flex items-center justify-center min-h-[200px]">
                        <div className="w-10 h-10 border-4 border-royal border-t-transparent rounded-full animate-spin"></div>
                        <p className="ml-3 text-muted-foreground">Loading your outfits...</p>
                    </div>
                }>
                    <MyOutfitsList />
                </Suspense>
            </div>
        </div>
    );
}