import { PrismaClient, ItemCategory } from '@prisma/client';

const prisma = new PrismaClient();

// Removed dynamic fetching. We will only use text for items.

const showcaseOutfits = [
    {
        name: "Noir Silhouette",
        description: "A masterclass in textural contrast. Combining structured Japanese wool with fluid silk layers.",
        imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1587&auto=format&fit=crop",
        tags: ["avant-garde", "monochrome", "structured"],
        isPrivate: false,
        itemsToFetch: [
            { name: "Structured Wool Overcoat", category: "UPPERWEAR", query: "black wool coat flat lay isolated" },
            { name: "Fluid Silk Button-Up", category: "UPPERWEAR", query: "black silk shirt flat lay" },
            { name: "Tapered Black Trousers", category: "LOWERWEAR", query: "black trousers flat lay isolated" }
        ]
    },
    {
        name: "Midnight Architecture",
        description: "Oversized proportions meet sharp tailoring. A statement coat anchored by heavy leather boots.",
        imageUrl: "https://images.unsplash.com/photo-1510520434124-5bc7e642b61d?q=80&w=1587&auto=format&fit=crop",
        tags: ["editorial", "outerwear", "winter"],
        isPrivate: false,
        itemsToFetch: [
            { name: "Oversized Tailored Coat", category: "UPPERWEAR", query: "oversized black coat isolated" },
            { name: "Heavy Combat Boots", category: "FOOTWEAR", query: "black leather combat boots isolated" },
            { name: "Selvedge Denim", category: "LOWERWEAR", query: "dark raw denim jeans flat lay" }
        ]
    },
    {
        name: "The Sharp Edit",
        description: "Smart casual done right. A refined neutral palette elevated by precise tailoring and considered layering.",
        imageUrl: "https://images.unsplash.com/photo-1613733539611-ca96d94b46ba?q=80&w=1587&auto=format&fit=crop",
        tags: ["smart-casual", "tailored", "neutral"],
        isPrivate: false,
        itemsToFetch: [
            { name: "Slim-Fit Chinos", category: "LOWERWEAR", query: "" },
            { name: "Knit Polo Shirt", category: "UPPERWEAR", query: "" },
            { name: "Suede Derby Shoes", category: "FOOTWEAR", query: "" }
        ]
    },
    {
        name: "Urban Ascetic",
        description: "Stripped back to the absolute essentials. Drapey linen over wide-leg trousers in pitch black.",
        imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1587&auto=format&fit=crop",
        tags: ["minimal", "linen", "summer-dark"],
        isPrivate: false,
        itemsToFetch: [
            { name: "Draped Linen Shirt", category: "UPPERWEAR", query: "black linen shirt flat lay" },
            { name: "Wide-Leg Trousers", category: "LOWERWEAR", query: "wide leg black pants isolated" },
            { name: "Minimalist Loafers", category: "FOOTWEAR", query: "black leather loafers isolated" }
        ]
    },
    {
        name: "The New Standard",
        description: "Reinventing the everyday uniform. Deconstructed blazer paired with relaxed denim and combat boots.",
        imageUrl: "https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?q=80&w=1587&auto=format&fit=crop",
        tags: ["uniform", "deconstructed", "daily"],
        isPrivate: false,
        itemsToFetch: [
            { name: "Deconstructed Wool Blazer", category: "UPPERWEAR", query: "black unstructured blazer isolated" },
            { name: "Relaxed Fit Denim", category: "LOWERWEAR", query: "blue relaxed jeans flat lay" },
            { name: "Chunky Chelsea Boots", category: "FOOTWEAR", query: "black chunky chelsea boots isolated" }
        ]
    }
];

async function main() {
    // Delete existing items and outfits
    await prisma.outfitItem.deleteMany();
    await prisma.outfit.deleteMany();
    console.log('Deleted existing outfits and items from database.\n');

    for (const outfit of showcaseOutfits) {
        process.stdout.write(`Creating outfit: ${outfit.name}... `);
        
        const createdOutfit = await prisma.outfit.create({
            data: {
                name: outfit.name,
                description: outfit.description,
                imageUrl: outfit.imageUrl,
                tags: outfit.tags,
                isPrivate: outfit.isPrivate,
            }
        });
        console.log('Done.');

        for (const item of outfit.itemsToFetch) {
            await prisma.outfitItem.create({
                data: {
                    name: item.name,
                    category: item.category as ItemCategory,
                    outfitId: createdOutfit.id
                }
            });
        }
    }

    console.log('\nSuccessfully seeded 5 outfits with highly-curated individual pieces into the database.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
