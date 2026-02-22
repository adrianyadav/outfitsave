"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { sortItemsByCategory } from "@/lib/constants";
import { useSession } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import EditOutfitModal from "@/components/ui/edit-outfit-modal";

interface OutfitItem {
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
    imageUrl?: string;
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
    user?: {
        name: string;
    };
    items: OutfitItem[];
}

export default function OutfitPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id } = use(params);
    const { data: session } = useSession();
    const [outfit, setOutfit] = useState<Outfit | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSharing, setIsSharing] = useState(false);
    const [isOwned, setIsOwned] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        async function fetchOutfit() {
            try {
                const res = await fetch(`/api/outfits/${id}`);
                if (!res.ok) {
                    throw new Error("Failed to fetch outfit");
                }
                const data = await res.json();
                setOutfit(data);

                // Check if user owns this outfit
                const sessionRes = await fetch('/api/auth/session');
                if (sessionRes.ok) {
                    const session = await sessionRes.json();
                    setIsOwned(session.user?.id === data.userId);
                }
            } catch (error) {
                console.error("Error fetching outfit:", error);
                router.push("/outfits");
            } finally {
                setIsLoading(false);
            }
        }

        fetchOutfit();
    }, [id, router]);

    const handleSaveOutfit = async () => {
        if (isSaving || !outfit) return;

        setIsSaving(true);
        try {
            const response = await fetch(`/api/outfits/${outfit.id}/save`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                toast({
                    title: "Success",
                    description: "Outfit saved successfully!",
                });
                router.push("/my-outfits");
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to save outfit",
                });
            }
        } catch (err) {
            console.error("Error saving outfit:", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save outfit. Please try again later.",
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleOutfitUpdated = (updatedOutfit: Outfit) => {
        setOutfit(updatedOutfit);
    };

    const handleShare = async () => {
        if (isSharing || !outfit) return;

        setIsSharing(true);
        try {
            const response = await fetch(`/api/outfits/${outfit.id}/share`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.ok) {
                const { shareUrl } = await response.json();

                // Copy to clipboard
                await navigator.clipboard.writeText(shareUrl);

                toast({
                    title: "Share link copied!",
                    description: "The share link has been copied to your clipboard.",
                });
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to generate share link",
                });
            }
        } catch (err) {
            console.error("Error sharing outfit:", err);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to generate share link. Please try again later.",
            });
        } finally {
            setIsSharing(false);
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[var(--color-dark-grey)] flex items-center justify-center">
                <div data-testid="loading-spinner" className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!outfit) {
        return (
            <div className="min-h-screen bg-[var(--color-dark-grey)] flex items-center justify-center">
                <p className="text-[var(--color-white-06)] font-[var(--font-f-lausanne-400)]">Outfit not found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[var(--color-dark-grey)] text-white pt-32 pb-24 font-[var(--font-f-lausanne-400)]">
            <div className="max-w-[2000px] mx-auto px-6 md:px-12 max-w-6xl">
                {/* Header with actions */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                        <Link href="/my-outfits" className="flex items-center gap-2 text-sm text-[var(--color-white-06)] hover:text-white transition-colors uppercase tracking-widest">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Outfits
                        </Link>

                        {/* Action buttons */}
                        <div className="flex items-center gap-4">
                            {isOwned ? (
                                <>
                                    <EditOutfitModal
                                        outfit={outfit}
                                        onOutfitUpdated={handleOutfitUpdated}
                                    />
                                    {!outfit.isPrivate ? (
                                        <button
                                            onClick={handleShare}
                                            disabled={isSharing}
                                            className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                                            data-testid="share-outfit-button"
                                        >
                                            {isSharing ? "Sharing..." : "Share"}
                                        </button>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    {!outfit.isPrivate ? (
                                        <button
                                            onClick={handleShare}
                                            disabled={isSharing}
                                            className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                                            data-testid="share-outfit-button"
                                        >
                                            {isSharing ? "Sharing..." : "Share"}
                                        </button>
                                    ) : null}
                                    {!outfit.isPrivate && session ? (
                                        <button
                                            onClick={handleSaveOutfit}
                                            disabled={isSaving}
                                            className="px-6 py-2 bg-white text-black font-medium hover:bg-[var(--color-white-08)] transition-colors disabled:opacity-50"
                                            data-testid="save-to-my-outfits-button"
                                        >
                                            {isSaving ? "Saving..." : "Save to My Outfits"}
                                        </button>
                                    ) : null}
                                </>
                            )}
                        </div>
                    </div>

                    <h1 className="text-[clamp(3rem,5vw,7rem)] leading-[0.9] font-[var(--font-f-lausanne-300)] tracking-[-0.04em] mb-6">{outfit.name}</h1>
                    <div className="flex items-center gap-4 text-[10px] uppercase tracking-widest text-[var(--color-white-06)]">
                        {outfit.user?.name && (
                            <span>
                                By {outfit.user.name}
                            </span>
                        )}
                        {outfit.user?.name && <span className="w-1 h-1 bg-white/20 rounded-full" />}
                        <span>
                            {formatDate(outfit.createdAt)}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
                    {/* Outfit Image */}
                    {outfit.imageUrl ? (
                        <div className="lg:col-span-5">
                            <div className="relative rounded-none overflow-hidden aspect-[4/5] bg-white/5">
                                <Image
                                    src={outfit.imageUrl}
                                    alt={outfit.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 50vw"
                                    priority={true}
                                    quality={100}
                                    placeholder="blur"
                                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
                                />
                            </div>
                        </div>
                    ) : null}

                    {/* Outfit Details */}
                    <div className="lg:col-span-7 flex flex-col pt-8 lg:pt-0">
                        {outfit.description ? (
                            <div className="mb-12">
                                <h2 className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)] mb-6">Description</h2>
                                <p className="text-[clamp(1.2rem,1.5vw,2rem)] leading-relaxed text-white/90 font-light" data-testid="outfit-description">{outfit.description}</p>
                            </div>
                        ) : null}

                        {outfit.tags && outfit.tags.length > 0 ? (
                            <div className="mb-16">
                                <h2 className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)] mb-6">Tags</h2>
                                <div className="flex flex-wrap gap-2">
                                    {outfit.tags.map((tag, index) => (
                                        <span key={index} className="px-4 py-2 border border-white/20 text-xs tracking-wider uppercase text-white hover:bg-white hover:text-black transition-colors cursor-default" data-testid={`outfit-tag-${index}`}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null}

                        {outfit.items && outfit.items.length > 0 ? (
                            <div>
                                <h2 className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)] mb-8 pb-4 border-b border-white/10 flex justify-between">
                                    <span>Pieces</span>
                                    <span>{outfit.items.length}</span>
                                </h2>
                                <div className="space-y-12">
                                    {sortItemsByCategory(outfit.items).map((item, index) => {
                                        return (
                                            <div key={item.id} className="group" data-testid={`outfit-item-${item.id}`}>
                                                <div className="flex items-start justify-between mb-4">
                                                    <div>
                                                        <span className="text-[10px] uppercase tracking-widest text-white/40 mb-1 block" data-testid={`outfit-item-category-${item.id}`}>
                                                            {item.category.toLowerCase().replace('_', ' ')}
                                                        </span>
                                                        <h3 className="text-2xl font-[var(--font-f-lausanne-300)] text-white" data-testid={`outfit-item-name-${item.id}`}>
                                                            {item.name}
                                                        </h3>
                                                    </div>
                                                    <span className="text-[10px] uppercase tracking-widest text-white/20">
                                                        0{index + 1}
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                                    {item.imageUrl && (
                                                        <div className="md:col-span-4">
                                                            <div className="aspect-[4/5] w-full bg-white/5 relative overflow-hidden group-hover:border-white/20 border border-transparent transition-colors">
                                                                <Image
                                                                    src={item.imageUrl}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover"
                                                                    sizes="(max-width: 768px) 100vw, 30vw"
                                                                />
                                                            </div>
                                                        </div>
                                                    )}
                                                    
                                                    <div className={`${item.imageUrl ? 'md:col-span-8' : 'md:col-span-12'} flex flex-col justify-start pt-2`}>
                                                        {item.description && (
                                                            <p className="text-sm text-[var(--color-white-06)] mb-6 leading-relaxed" data-testid={`outfit-item-description-${item.id}`}>
                                                                {item.description}
                                                            </p>
                                                        )}
                                                        {item.purchaseUrl && (
                                                            <a
                                                                href={item.purchaseUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-[10px] uppercase tracking-widest text-white hover:text-[var(--color-white-06)] transition-colors inline-block mt-auto border-b border-white hover:border-[var(--color-white-06)] pb-1 w-fit"
                                                            >
                                                                View Item
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </div>
    );
} 