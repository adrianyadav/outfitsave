"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Share2, Shirt, Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/confirm-dialog";
import { AdminDeleteButton } from "@/components/ui/admin-delete-button";
import { useAdmin } from "@/hooks/use-admin";

interface OutfitItem {
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
    imageUrl?: string;
}

interface OutfitCardProps {
    outfit: {
        id: number;
        name: string;
        description?: string;
        imageUrl?: string;
        tags: string[];
        isPrivate: boolean;
        shareSlug?: string;
        createdAt: string;
        items: OutfitItem[];
        userId?: string; // Add this to track ownership
    };
    showActions?: boolean;
    onShare?: (outfitId: number) => void;
    onDelete?: (outfitId: number) => void;
    sharingOutfit?: number | null;
    deletingOutfit?: number | null;
    className?: string;
    currentUserId?: string; // Add this to check ownership
}

export default function OutfitCard({
    outfit,
    showActions = true,
    onShare,
    onDelete,
    sharingOutfit,
    deletingOutfit,
    className = "",
    currentUserId
}: OutfitCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const { isAdmin, loading: adminLoading } = useAdmin();

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setShowDeleteDialog(true);
    };

    const handleConfirmDelete = async () => {
        if (onDelete) {
            await onDelete(outfit.id);
            setShowDeleteDialog(false);
        }
    };

    const handleAdminDelete = () => {
        // Refresh the page or trigger a re-fetch of outfits
        window.location.reload();
    };

    // Check if current user owns this outfit
    const isOwner = currentUserId && outfit.userId && currentUserId === outfit.userId;

    return (
        <Link
            href={showDeleteDialog ? "#" : `/outfits/${outfit.id}`}
            className="block group"
            data-testid={`outfit-card-${outfit.id}`}
            data-outfit-name={outfit.name}
            onClick={(e) => {
                // Prevent navigation when any action button is clicked
                if (showDeleteDialog || e.target instanceof HTMLButtonElement || (e.target as HTMLElement).closest('button')) {
                    e.preventDefault();
                }
            }}
        >
            <div className={`overflow-hidden cursor-pointer ${className}`}>
                {/* Image Section */}
                <div className="aspect-[4/5] bg-[var(--color-dark-grey)] relative overflow-hidden">
                    {outfit.imageUrl ? (
                        <Image
                            src={outfit.imageUrl}
                            alt={outfit.name}
                            fill
                            className="object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            priority={false}
                            quality={85}
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxAAPwCdABmX/9k="
                        />
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full w-full text-white/40">
                            <Shirt className="w-12 h-12 stroke-[1]" />
                        </div>
                    )}

                    {/* Gradient Overlay for Actions on Hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Action Buttons overlaying the image */}
                    {showActions ? (
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            {/* Privacy Label */}
                            <div className="bg-black/80 backdrop-blur-md px-3 py-1.5 text-[10px] uppercase tracking-widest text-white/90">
                                {outfit.isPrivate ? 'Private' : 'Public'}
                            </div>

                            <div className="flex flex-col gap-2 pointer-events-auto">
                                {!outfit.isPrivate && onShare ? (
                                    <button
                                        data-testid={`share-button-${outfit.id}`}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            onShare(outfit.id);
                                        }}
                                        disabled={sharingOutfit === outfit.id}
                                        className="w-8 h-8 flex items-center justify-center bg-black/80 backdrop-blur-md text-white/90 hover:bg-white hover:text-black transition-colors rounded-none"
                                        title="Share"
                                    >
                                        <Share2 className="h-3 w-3" />
                                    </button>
                                ) : null}
                                {/* Regular delete button - only for owner */}
                                {onDelete && isOwner ? (
                                    <button
                                        data-testid={`delete-button-${outfit.id}`}
                                        onClick={handleDeleteClick}
                                        disabled={deletingOutfit === outfit.id}
                                        className="w-8 h-8 flex items-center justify-center bg-black/80 backdrop-blur-md text-white/90 hover:bg-red-600 transition-colors rounded-none"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-3 w-3" />
                                    </button>
                                ) : null}
                                {/* Admin Delete Button - Only show for public outfits when user is admin */}
                                {!outfit.isPrivate && isAdmin && !adminLoading ? (
                                    <AdminDeleteButton
                                        outfitId={outfit.id}
                                        outfitName={outfit.name}
                                        onDelete={handleAdminDelete}
                                    />
                                ) : null}
                            </div>
                        </div>
                    ) : null}
                </div>

                {/* Content Section - Minimal text below image */}
                <div className="py-5 flex flex-col items-start font-['var(--font-f-lausanne-400)']">
                    <h3 className="text-[clamp(1.5rem,2vw,2rem)] leading-none font-['var(--font-f-lausanne-300)'] tracking-[-0.02em] overflow-hidden text-ellipsis whitespace-nowrap w-full">
                        {outfit.name}
                    </h3>
                    
                    <div className="flex items-center gap-3 mt-3 text-sm  uppercase tracking-wide">
                        <span>{outfit.items.length} piece{outfit.items.length !== 1 ? 's' : ''}</span>
                        {outfit.tags && outfit.tags.length > 0 ? (
                            <>
                                <span className="w-1 h-1 bg-white/30 rounded-full" />
                                <span className="truncate max-w-[200px]">{outfit.tags.join(', ')}</span>
                            </>
                        ) : null}
                    </div>

                </div>
            </div>

            <ConfirmDialog
                title="Delete Outfit"
                message={`Are you sure you want to delete "${outfit.name}"? This action cannot be undone.`}
                confirmText="Delete Outfit"
                onConfirm={handleConfirmDelete}
                isOpen={showDeleteDialog}
                onClose={() => setShowDeleteDialog(false)}
                isLoading={deletingOutfit === outfit.id}
            />
        </Link>
    );
} 