import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ITEM_CATEGORIES, getItemPlaceholder } from "@/lib/constants";

interface FormFieldProps {
    label: string;
    required?: boolean;
    className?: string;
}

interface InputFieldProps extends FormFieldProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    type?: string;
    testId?: string;
}

interface TextareaFieldProps extends FormFieldProps {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    placeholder?: string;
    rows?: number;
    testId?: string;
}

interface SelectFieldProps extends FormFieldProps {
    value: string;
    onValueChange: (value: string) => void;
    placeholder?: string;
    testId?: string;
}

export function InputField({
    label,
    required = false,
    className = "",
    testId,
    ...props
}: InputFieldProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">
                {label} {required && "*"}
            </Label>
            <Input
                className="bg-transparent border-white/20 text-white placeholder:text-white/20 rounded-none focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white h-12"
                data-testid={testId}
                {...props}
            />
        </div>
    );
}

export function TextareaField({
    label,
    required = false,
    className = "",
    testId,
    ...props
}: TextareaFieldProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">
                {label} {required && "*"}
            </Label>
            <Textarea
                className="bg-transparent border-white/20 text-white placeholder:text-white/20 rounded-none focus-visible:ring-1 focus-visible:ring-white focus-visible:border-white min-h-[120px] resize-none"
                data-testid={testId}
                {...props}
            />
        </div>
    );
}

export function CategorySelectField({
    label,
    required = false,
    className = "",
    testId,
    ...props
}: SelectFieldProps) {
    return (
        <div className={`space-y-2 ${className}`}>
            <Label className="uppercase tracking-widest text-[10px] text-[var(--color-white-06)]">
                {label} {required && "*"}
            </Label>
            <Select {...props}>
                <SelectTrigger className="bg-transparent border-white/20 text-white rounded-none focus:ring-1 focus:ring-white h-12" data-testid={testId}>
                    <SelectValue placeholder={<span className="text-white/20">Select category</span>} />
                </SelectTrigger>
                <SelectContent className="bg-[#111] border border-white/10 text-white rounded-none">
                    {ITEM_CATEGORIES.map((category) => (
                        <SelectItem
                            key={category.value}
                            value={category.value}
                            data-testid={`${testId?.replace('-select-', '-option-')}-${category.value}`}
                            className="hover:bg-white/10 cursor-pointer rounded-none"
                        >
                            {category.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

export function ItemNameField({
    category,
    index,
    value,
    onChange,
    testId
}: {
    category: string;
    index: number;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    testId?: string;
}) {
    const categoryLabel = ITEM_CATEGORIES.find(cat => cat.value === category)?.label || 'Clothing Item';
    const placeholder = getItemPlaceholder(category);

    return (
        <InputField
            label={`${categoryLabel} Name`}
            required
            id={`item-name-${index}`}
            name={`item-name-${index}`}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            testId={testId}
        />
    );
}
