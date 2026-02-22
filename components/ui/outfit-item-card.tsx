import { X } from "lucide-react";
import { InputField, CategorySelectField, ItemNameField } from "./form-fields";
import { ITEM_CATEGORIES } from "@/lib/constants";
import { OutfitItem } from "@/hooks/use-outfit-items";
import ItemImageUpload from "./item-image-upload";

interface OutfitItemCardProps {
    item: OutfitItem;
    index: number;
    onUpdate: (index: number, field: keyof OutfitItem, value: string) => void;
    onRemove: (index: number) => void;
    testIdPrefix?: string;
}

export function OutfitItemCard({
    item,
    index,
    onUpdate,
    onRemove,
    testIdPrefix = "item"
}: OutfitItemCardProps) {
    return (
        <div className="p-8 border border-white/10 bg-white/5 relative group transition-colors hover:border-white/20">
            <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                <div className="flex items-center gap-4">
                    <span className="text-[10px] uppercase tracking-widest text-[var(--color-white-06)]">Item {index + 1}</span>
                    <h4 className="font-['var(--font-f-lausanne-300)'] text-xl text-white">
                        {item.category ?
                            `${ITEM_CATEGORIES.find(cat => cat.value === item.category)?.label || 'Clothing Item'}` :
                            'Clothing Item'
                        }
                    </h4>
                </div>
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-white/40 hover:text-red-400 transition-colors p-2"
                    data-testid={`${testIdPrefix}-remove-button-${index}`}
                >
                    <X className="h-5 w-5" />
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ItemNameField
                    category={item.category}
                    index={index}
                    value={item.name}
                    onChange={(e) => onUpdate(index, "name", e.target.value)}
                    testId={`${testIdPrefix}-name-input-${index}`}
                />

                <CategorySelectField
                    label="Category"
                    required
                    value={item.category}
                    onValueChange={(value) => onUpdate(index, "category", value)}
                    testId={`${testIdPrefix}-category-select-${index}`}
                />

                <InputField
                    label="Description"
                    id={`item-description-${index}`}
                    name={`item-description-${index}`}
                    value={item.description}
                    onChange={(e) => onUpdate(index, "description", e.target.value)}
                    placeholder="Optional details about this item"
                    testId={`${testIdPrefix}-description-input-${index}`}
                />

                <InputField
                    label="Purchase Link"
                    type="url"
                    id={`item-purchase-url-${index}`}
                    name={`item-purchase-url-${index}`}
                    value={item.purchaseUrl}
                    onChange={(e) => onUpdate(index, "purchaseUrl", e.target.value)}
                    placeholder="https://store.com/item"
                    testId={`${testIdPrefix}-purchase-url-input-${index}`}
                />
            </div>

            <div className="mt-8 pt-6 border-t border-white/10">
                <p className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)] mb-4">Item Image</p>
                <div className="border border-dashed border-white/20 p-6 bg-white/5 hover:border-white/40 transition-colors">
                    <ItemImageUpload
                        onImageUpload={(imageUrl) => onUpdate(index, "imageUrl", imageUrl)}
                        currentImageUrl={item.imageUrl}
                        itemName={item.name}
                    />
                </div>
            </div>
        </div>
    );
}
