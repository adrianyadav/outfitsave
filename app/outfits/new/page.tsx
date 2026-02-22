"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import ImageUpload from "@/components/ui/image-upload";
import { Plus, Shirt, PersonStanding } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { InputField, TextareaField } from "@/components/ui/form-fields";
import { OutfitItemCard } from "@/components/ui/outfit-item-card";
import { useOutfitItems } from "@/hooks/use-outfit-items";
import { sortItemsByCategory } from "@/lib/constants";

interface PreviousItem {
    name: string;
    category: string;
    description: string;
    purchaseUrl: string;
    usageCount: number;
}

export default function NewOutfitPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        imageUrl: "",
        tags: "",
        isPrivate: true,
    });
    const [previousItems, setPreviousItems] = useState<PreviousItem[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [isLoadingPreviousItems, setIsLoadingPreviousItems] = useState(false);
    const { toast } = useToast();

    // Use the custom hook for item management
    const { items, addItem, removeItem, updateItem, addItemFromPrevious } = useOutfitItems();

    // Fetch previous items on component mount
    useEffect(() => {
        fetchPreviousItems();
    }, []);

    const fetchPreviousItems = async () => {
        setIsLoadingPreviousItems(true);
        try {
            const response = await fetch("/api/my-items");
            if (response.ok) {
                const data = await response.json();
                setPreviousItems(data);
            } else {
                console.error("Failed to fetch previous items");
            }
        } catch (error) {
            console.error("Error fetching previous items:", error);
        } finally {
            setIsLoadingPreviousItems(false);
        }
    };

    const handleAddItemFromPrevious = (previousItem: PreviousItem) => {
        addItemFromPrevious(previousItem);
        setShowQuickAdd(false);
        toast({
            title: "Item added",
            description: `${previousItem.name} has been added to your outfit.`,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validate required fields
        if (!formData.name.trim()) {
            toast({
                title: "Missing outfit name",
                description: "Please enter an outfit name.",
            });
            return;
        }

        if (!formData.imageUrl?.trim()) {
            toast({
                title: "Missing image",
                description: "Please upload an image or provide an image URL. Images are required to help visualize your outfit.",
            });
            return;
        }

        setIsLoading(true);

        try {
            const tags = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
            const validItems = items.filter(item => item.name && item.category);

            const response = await fetch("/api/outfits", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    ...formData,
                    tags,
                    items: validItems,
                }),
            });

            if (response.ok) {
                router.push("/my-outfits");
            } else {
                const errorData = await response.json();
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: errorData.error || "Failed to create outfit. Please try again.",
                });
            }
        } catch (error) {
            console.error("Error creating outfit:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create outfit. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData({
            ...formData,
            isPrivate: checked,
        });
    };

    return (
        <div className="min-h-screen bg-[var(--color-dark-grey)] text-white pt-32 pb-24 font-['var(--font-f-lausanne-400)']">
            <div className="max-w-[2000px] mx-auto px-6 md:px-12 max-w-4xl lg:max-w-5xl">
                {/* Header Section */}
                <div className="mb-16">
                    <h1 className="text-[clamp(3rem,6vw,8rem)] leading-[0.85] font-['var(--font-f-lausanne-300)'] tracking-[-0.04em] whitespace-nowrap -ml-[0.05em] mb-4">
                        Save Outfit
                    </h1>
                    <p className="text-[clamp(1rem,1.2vw,1.5rem)] text-[var(--color-white-06)]">
                        Create and organize your perfect outfit with all the details that matter
                    </p>
                </div>

                <div className="border-t border-white/10 pt-12">
                    <form onSubmit={handleSubmit} className="space-y-16">
                            {/* Basic Outfit Information */}
                            <div className="space-y-10">
                                <div className="flex items-center gap-4 border-b border-white/10 pb-4">
                                    <PersonStanding className="w-5 h-5 text-white/50" />
                                    <h3 className="text-xl font-['var(--font-f-lausanne-300)'] uppercase tracking-widest text-white/50">Basic Information</h3>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputField
                                        label="Outfit Name"
                                        required
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter outfit name"
                                        testId="outfit-name-input"
                                    />

                                    <InputField
                                        label="Tags (comma-separated)"
                                        id="tags"
                                        name="tags"
                                        value={formData.tags}
                                        onChange={handleChange}
                                        placeholder="casual, summer, formal"
                                        testId="outfit-tags-input"
                                    />
                                </div>

                                <TextareaField
                                    label="Description"
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Describe your outfit, when you'd wear it, or any special details..."
                                    testId="outfit-description-textarea"
                                />

                                <div className="space-y-4">
                                    <label className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">Outfit Image *</label>
                                    <div className="border border-dashed border-white/20 p-8 bg-white/5 relative overflow-hidden group hover:border-white/40 transition-colors">
                                        <ImageUpload
                                            onImageUpload={(imageUrl) => {
                                                setFormData({
                                                    ...formData,
                                                    imageUrl,
                                                });
                                            }}
                                            currentImageUrl={formData.imageUrl}
                                        />
                                    </div>
                                    <p className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)] pt-2">
                                        An image is required to visualize your outfit
                                    </p>
                                </div>

                                <div className="flex items-center space-x-4 p-6 border border-white/10 bg-white/5 mt-8">
                                    <Checkbox
                                        id="isPrivate"
                                        checked={formData.isPrivate}
                                        onCheckedChange={handleCheckboxChange}
                                        data-testid="outfit-private-checkbox"
                                    />
                                    <div>
                                        <label htmlFor="isPrivate" className="font-['var(--font-f-lausanne-400)'] cursor-pointer">Make this outfit private</label>
                                        <p className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)] mt-1">
                                            Private outfits are only visible to you
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Outfit Items */}
                            <div className="space-y-10">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-4">
                                        <Shirt className="w-5 h-5 text-white/50" />
                                        <h3 className="text-xl font-['var(--font-f-lausanne-300)'] uppercase tracking-widest text-white/50">Outfit Items</h3>
                                    </div>
                                    <div className="flex gap-4">
                                        {previousItems.length > 0 && (
                                            <button
                                                type="button"
                                                onClick={() => setShowQuickAdd(!showQuickAdd)}
                                                className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-colors"
                                                data-testid="quick-add-button"
                                                disabled={isLoadingPreviousItems}
                                            >
                                                {isLoadingPreviousItems ? "Loading..." : "Quick Add"}
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                                            data-testid="add-item-button"
                                        >
                                            <Plus className="h-4 w-4" />
                                            Add Item
                                        </button>
                                    </div>
                                </div>

                                {/* Quick Add Dropdown */}
                                {showQuickAdd && previousItems.length > 0 && (
                                    <div className="p-6 border border-white/10 bg-white/5" data-testid="quick-add-dropdown">
                                        <p className="mb-4 text-sm text-[var(--color-white-06)]">
                                            Click on an item to add it to your outfit:
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {previousItems.map((item, index) => (
                                                <button
                                                    key={index}
                                                    type="button"
                                                    onClick={() => handleAddItemFromPrevious(item)}
                                                    className="justify-start text-left p-4 border border-white/10 hover:border-white/40 hover:bg-white/5 transition-colors"
                                                    data-testid={`quick-add-item-${index}`}
                                                >
                                                    <div className="flex flex-col items-start gap-1">
                                                        <span className="font-medium text-white">{item.name}</span>
                                                        <span className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)]">
                                                            {item.category}
                                                        </span>
                                                        <span className="text-[10px] text-white/40 pt-2 border-t border-white/10 w-full mt-1">
                                                            Used {item.usageCount} time{item.usageCount !== 1 ? 's' : ''}
                                                        </span>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {items.length === 0 && (
                                    <div className="text-center py-16 border border-dashed border-white/20">
                                        <p className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)]">
                                            No items added. Include individual pieces for tracking.
                                        </p>
                                    </div>
                                )}

                                {sortItemsByCategory(items).map((item, index) => (
                                    <OutfitItemCard
                                        key={index}
                                        item={item}
                                        index={index}
                                        onUpdate={updateItem}
                                        onRemove={removeItem}
                                        testIdPrefix="item"
                                    />
                                ))}
                            </div>

                            <div className="flex justify-between items-center pt-12 border-t border-white/10 mt-16">
                                <button
                                    type="button"
                                    onClick={() => router.back()}
                                    className="px-8 py-4 border border-white/20 text-white hover:bg-white/10 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="px-8 py-4 bg-white text-black font-medium hover:bg-[var(--color-white-08)] transition-colors disabled:opacity-50"
                                    data-testid="save-outfit-button"
                                >
                                    {isLoading ? (
                                        "Saving..."
                                    ) : (
                                        "Save Outfit"
                                    )}
                                </button>
                            </div>
                        </form>
                </div>
            </div>
        </div>
    );
}