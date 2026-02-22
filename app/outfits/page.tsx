"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense, useCallback } from "react";
import Link from "next/link";
import OutfitCard from "@/components/ui/outfit-card";
import { useAdmin } from "@/hooks/use-admin";
import { useSession } from "next-auth/react";

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
    createdAt: string;
    user?: {
        name: string;
    };
    items?: OutfitItem[];
}

// Disable static generation
export const dynamic = "force-dynamic";

function OutfitsList() {
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");
    const { isAdmin, loading: adminLoading } = useAdmin();
    const { data: session } = useSession();

    const [outfits, setOutfits] = useState<Outfit[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    const fetchOutfits = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/outfits?page=${page}`);
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
    }, [page]);

    useEffect(() => {
        fetchOutfits();
    }, [fetchOutfits]);

    const handleAdminDelete = () => {
        // Re-fetch the outfits list after admin delete
        fetchOutfits();
    };

    return (
        <>
            {isLoading ? (
                <div className="flex items-center justify-center space-x-2 min-h-[200px]">
                    <div data-testid="loading-spinner" className="w-6 h-6 border-4 border-royal border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-muted-foreground">Loading...</p>
                </div>
            ) : (
                <>
                    {outfits.length === 0 ? (
                        <div className="text-center space-y-8 py-32 border-t border-white/10 mt-12">
                            <h3 className="text-[clamp(2rem,4vw,4rem)] leading-none font-['var(--font-f-lausanne-300)'] tracking-[-0.02em] text-white">No outfits available</h3>
                            <p className="text-[clamp(1rem,1.5vw,1.5rem)] text-[var(--color-white-06)] font-['var(--font-f-lausanne-400)'] max-w-2xl mx-auto">
                                Be the first to share your style! Create and share your outfits with the community.
                            </p>
                            <Link 
                                href="/outfits/new" 
                                className="inline-flex items-center justify-center px-8 py-4 bg-white text-black rounded-full font-['var(--font-f-lausanne-400)'] hover:bg-[var(--color-white-08)] transition-colors hover:scale-[1.02] active:scale-[0.98]"
                            >
                                Create Your First Outfit
                            </Link>
                        </div>
                    ) : (
                        <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                            {outfits.map((outfit, index) => (
                                <div key={outfit.id} className={`break-inside-avoid ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-8'}`}>
                                    <OutfitCard
                                        outfit={{
                                            ...outfit,
                                            isPrivate: false,
                                            items: outfit.items || []
                                        }}
                                        showActions={isAdmin && !adminLoading}
                                        onDelete={handleAdminDelete}
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
                                    href={`/outfits?page=${page - 1}`} 
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
                                    href={`/outfits?page=${page + 1}`} 
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

export default function OutfitsPage() {
    return (
        <div className="min-h-screen bg-[var(--color-dark-grey)] text-white pt-32 pb-24">
            <div className="max-w-[2000px] mx-auto px-6 md:px-12">
                {/* Header Section */}
                <div className="mb-20">
                    <h1 className="text-[clamp(4rem,10vw,12rem)] leading-[0.85] font-['var(--font-f-lausanne-300)'] tracking-[-0.04em] whitespace-nowrap -ml-[0.05em] mb-8">
                        Browse
                    </h1>
                    <p className="text-[clamp(1.2rem,2vw,2.5rem)] leading-[1.3] font-['var(--font-f-lausanne-400)'] font-light max-w-2xl lg:max-w-4xl text-[var(--color-white-06)]">
                        Discover curated styles from our community.<br className="hidden md:block"/> Get inspired and find your next favorite look.
                    </p>
                </div>

                <Suspense
                    fallback={
                        <div className="flex items-center justify-center min-h-[200px]">
                            <div className="w-10 h-10 border-4 border-royal border-t-transparent rounded-full animate-spin"></div>
                            <p className="ml-3 text-muted-foreground">Loading outfits...</p>
                        </div>
                    }
                >
                    <OutfitsList />
                </Suspense>
            </div>
        </div>
    );
}