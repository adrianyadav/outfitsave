"use client";

import { useState, useEffect } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import ImageUpload from "@/components/ui/image-upload";
import { Plus, PersonStanding } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { InputField, TextareaField } from "@/components/ui/form-fields";
import { OutfitItemCard } from "@/components/ui/outfit-item-card";
import { useOutfitItems } from "@/hooks/use-outfit-items";
import { sortItemsByCategory } from "@/lib/constants";

interface OutfitItem {
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
    imageUrl?: string;
}

interface PreviousItem {
    name: string;
    category: string;
    description: string;
    purchaseUrl: string;
    usageCount: number;
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

interface EditOutfitFormProps {
    outfit: Outfit;
    onSave: (updatedOutfit: Outfit) => void;
    onCancel: () => void;
    isLoading?: boolean;
}

export default function EditOutfitForm({ outfit, onSave, onCancel, isLoading = false }: EditOutfitFormProps) {
    const [formData, setFormData] = useState({
        name: outfit.name,
        description: outfit.description || "",
        imageUrl: outfit.imageUrl || "",
        tags: outfit.tags.join(", "),
        isPrivate: outfit.isPrivate,
    });
    const [previousItems, setPreviousItems] = useState<PreviousItem[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [isLoadingPreviousItems, setIsLoadingPreviousItems] = useState(false);
    const { toast } = useToast();

    // Use the custom hook for item management with initial items
    const initialItems = outfit.items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description || "",
        purchaseUrl: item.purchaseUrl || "",
        imageUrl: item.imageUrl,
    }));
    const { items, addItem, removeItem, updateItem, addItemFromPrevious } = useOutfitItems(initialItems);

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
                description: "Please upload an image or provide an image URL.",
            });
            return;
        }

        try {
            const tags = formData.tags.split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);
            const validItems = items
                .filter(item => item.name && item.category)
                .map(item => ({
                    ...item,
                    id: item.id || 0, // Ensure id is always a number
                }));

            const updatedOutfit = {
                ...outfit,
                name: formData.name,
                description: formData.description,
                imageUrl: formData.imageUrl,
                tags,
                isPrivate: formData.isPrivate,
                items: validItems,
            };

            onSave(updatedOutfit);
        } catch (error) {
            console.error("Error updating outfit:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update outfit. Please try again.",
            });
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleCheckboxChange = (checked: boolean) => {
        setFormData(prev => ({ ...prev, isPrivate: checked }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-12 font-['var(--font-f-lausanne-400)']" data-testid="edit-outfit-form">
            <div className="space-y-8">
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
                        testId="edit-outfit-name-input"
                    />

                    <InputField
                        label="Tags (comma-separated)"
                        id="tags"
                        name="tags"
                        value={formData.tags}
                        onChange={handleChange}
                        placeholder="casual, summer, formal"
                        testId="edit-outfit-tags-input"
                    />
                </div>

                <TextareaField
                    label="Description"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your outfit..."
                    testId="edit-outfit-description-textarea"
                />

                <div className="space-y-4">
                    <label className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">Outfit Image *</label>
                    <div className="border border-dashed border-white/20 p-8 bg-white/5 hover:border-white/40 transition-colors">
                        <ImageUpload
                            currentImageUrl={formData.imageUrl}
                            onImageUpload={(url: string) => setFormData(prev => ({ ...prev, imageUrl: url }))}
                            data-testid="edit-outfit-image-upload"
                        />
                    </div>
                </div>

                <div className="flex items-center space-x-4 p-6 border border-white/10 bg-white/5">
                    <Checkbox
                        id="isPrivate"
                        checked={formData.isPrivate}
                        onCheckedChange={handleCheckboxChange}
                        data-testid="edit-outfit-private-checkbox"
                    />
                    <div>
                        <label htmlFor="isPrivate" className="font-['var(--font-f-lausanne-400)'] text-white cursor-pointer">
                            Make this outfit private
                        </label>
                        <p className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)] mt-1">
                            Private outfits are only visible to you
                        </p>
                    </div>
                </div>
            </div>

            {/* Outfit Items */}
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-4">
                        <Plus className="w-5 h-5 text-white/50" />
                        <h3 className="text-xl font-['var(--font-f-lausanne-300)'] uppercase tracking-widest text-white/50">Outfit Items</h3>
                    </div>
                    <div className="flex gap-4">
                        {previousItems.length > 0 ? (
                            <button
                                type="button"
                                onClick={() => setShowQuickAdd(!showQuickAdd)}
                                className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-colors text-sm flex items-center"
                                data-testid="edit-quick-add-button"
                                disabled={isLoadingPreviousItems}
                            >
                                {isLoadingPreviousItems ? "Loading..." : "Quick Add"}
                            </button>
                        ) : null}
                        <button
                            type="button"
                            onClick={addItem}
                            className="px-6 py-2 border border-white/20 text-white hover:bg-white hover:text-black transition-colors text-sm flex items-center gap-2"
                            data-testid="edit-add-item-button"
                        >
                            <Plus className="h-4 w-4" />
                            Add Item
                        </button>
                    </div>
                </div>

                {/* Quick Add Dropdown */}
                {showQuickAdd && previousItems.length > 0 ? (
                    <div className="p-6 border border-white/10 bg-white/5" data-testid="edit-quick-add-dropdown">
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
                                    data-testid={`edit-quick-add-item-${index}`}
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
                ) : null}

            {/* Accordion for Items */}
                {items.length > 0 ? (
                    <Accordion type="multiple" className="space-y-4">
                        {sortItemsByCategory(items).map((item, index) => (
                            <AccordionItem
                                key={item.id || index}
                                value={`item-${item.id || index}`}
                                className="border border-white/10 bg-white/5 rounded-none p-2 hover:border-white/20 transition-colors"
                            >
                                <AccordionTrigger
                                    className="px-4 py-2 hover:no-underline text-white"
                                    data-testid={`edit-item-accordion-trigger-${index}`}
                                >
                                    <div className="flex items-center gap-4 w-full pr-4 text-white">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)] flex-shrink-0">
                                                <span>Item {index + 1}</span>
                                            </div>
                                            <div className="text-left min-w-0 flex-1 flex flex-col items-start">
                                                <h4 className="font-['var(--font-f-lausanne-300)'] text-lg text-white truncate">
                                                    {item.name || "Untitled Item"}
                                                </h4>
                                                <p className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)] truncate">
                                                    {item.category || "No category"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-4 border-t border-white/10 mt-2">
                                    <OutfitItemCard
                                        item={item}
                                        index={index}
                                        onUpdate={updateItem}
                                        onRemove={removeItem}
                                        testIdPrefix="edit-item"
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                ) : (
                    <div className="text-center py-16 border border-dashed border-white/20">
                        <p className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)]">
                            No items added. Include individual pieces for tracking.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex justify-between items-center pt-12 border-t border-white/10 mt-16">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-8 py-4 border border-white/20 text-white hover:bg-white/10 transition-colors"
                    data-testid="edit-outfit-cancel-button"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="px-8 py-4 bg-white text-black font-medium hover:bg-[var(--color-white-08)] transition-colors disabled:opacity-50"
                    data-testid="save-edit-button"
                >
                    {isLoading ? "Saving..." : "Save Changes"}
                </button>
            </div>
        </form>
    );
} 