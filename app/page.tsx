export const dynamic = "force-dynamic"; // This disables SSG and ISR

import Link from "next/link";
import OutfitCard from "@/components/ui/outfit-card";
import prisma from "@/lib/prisma";

// Define the outfit type
interface Outfit {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  tags: string[];
  isPrivate: boolean;
  shareSlug?: string;
  createdAt: string;
  items: Array<{
    id: number;
    name: string;
    category: string;
    description?: string;
    purchaseUrl?: string;
  }>;
}

export default async function Home() {

  // Fetch some public outfits to showcase on the homepage
  let showcaseOutfits: Outfit[] = [];
  try {
    const outfits = await prisma.outfit.findMany({
      where: {
        isPrivate: false,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 6,
    });

    showcaseOutfits = outfits.map(outfit => ({
      id: outfit.id,
      name: outfit.name,
      description: outfit.description || undefined,
      imageUrl: outfit.imageUrl || undefined,
      tags: outfit.tags,
      isPrivate: outfit.isPrivate,
      shareSlug: outfit.shareSlug || undefined,
      createdAt: outfit.createdAt.toISOString(),
      items: outfit.items.map(item => ({
        id: item.id,
        name: item.name,
        category: item.category,
        description: item.description || undefined,
        purchaseUrl: item.purchaseUrl || undefined,
      })),
    }));
  } catch (error) {
    console.error('Error fetching showcase outfits:', error);
  }

  return (
    <div className="min-h-screen bg-[var(--color-off-white)] selection:bg-black/10">
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] flex flex-col justify-end overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="w-full h-full bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-out hover:scale-105"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2940&auto=format&fit=crop')"
            }}
          ></div>
          <div className="absolute inset-0 bg-black/50"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-dark-grey)]/80 via-transparent to-transparent"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 w-full px-6 md:px-12 pb-12 md:pb-16 max-w-[2000px] mx-auto text-[var(--color-white)] flex flex-col justify-end h-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end w-full">
            {/* Left side text and title */}
            <div className="col-span-1 lg:col-span-9 flex flex-col w-full">
              <p className="text-[clamp(1.2rem,2vw,2.5rem)] leading-[1.3] font-['var(--font-f-lausanne-400)'] font-light max-w-2xl lg:max-w-4xl mb-12 lg:mb-32 tracking-wide text-[var(--color-white-08)] drop-shadow-sm">
                A digital wardrobe for fashion enthusiasts
                <br className="hidden md:block"/> to carefully curate and organize their
                <br className="hidden md:block"/> favorite outfits for every occasion.
              </p>
            </div>

            {/* Right side 'Scroll to explore' */}
            <div className="col-span-1 lg:col-span-3 flex lg:justify-end items-end lg:pb-8">
              <span className="font-['var(--font-f-lausanne-400)'] text-[var(--font-s-p)] tracking-wide text-[var(--color-white-06)] hover:text-white transition-colors cursor-pointer">
                Scroll to explore
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Showcase Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-[2000px] mx-auto px-6 md:px-12 relative">
          {/* Asymmetric Header */}
          <div className="mb-20">
            <h2 className="text-[clamp(3rem,8vw,10rem)] leading-[0.9] font-['var(--font-f-lausanne-300)'] tracking-[-0.04em] text-[var(--color-story)] -ml-[0.05em]">
              {showcaseOutfits.length > 0 ? 'Featured' : 'See What\'s'}
              <span className="block italic text-[var(--color-dark-grey-06)]">
                {showcaseOutfits.length > 0 ? 'Outfits' : 'Possible'}
              </span>
            </h2>
            <p className="text-[clamp(1.2rem,1.5vw,2rem)] mt-8 font-['var(--font-f-lausanne-400)'] text-[var(--color-dark-grey-06)] max-w-2xl">
              {showcaseOutfits.length > 0
                ? 'Real outfits from our community'
                : 'Examples of how you can organize your outfits'
              }
            </p>
          </div>

          {/* Masonry-style Grid */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {showcaseOutfits.length > 0 ? (
              showcaseOutfits.map((outfit: Outfit, index: number) => (
                <div key={outfit.id} className={`break-inside-avoid ${index % 2 === 0 ? 'lg:mt-0' : 'lg:mt-16'}`}>
                  <OutfitCard
                    outfit={{
                      ...outfit,
                      isPrivate: false,
                      items: outfit.items || []
                    }}
                    showActions={false}
                  />
                </div>
              ))
            ) : (
              // Fallback sample outfits with staggered positioning
              <>
                <div className="break-inside-avoid">
                  <OutfitCard
                    outfit={{
                      id: 1,
                      name: "Summer Casual",
                      description: "Perfect for warm days. Light cotton dress with sandals and a wide-brim hat",
                      imageUrl: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop",
                      tags: ["casual", "summer", "dress"],
                      isPrivate: false,
                      shareSlug: undefined,
                      createdAt: new Date().toISOString(),
                      items: []
                    }}
                    showActions={false}
                  />
                </div>
                <div className="break-inside-avoid lg:mt-16">
                  <OutfitCard
                    outfit={{
                      id: 2,
                      name: "Business Professional",
                      description: "Classic business attire for important meetings and presentations",
                      imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=400&fit=crop",
                      tags: ["formal", "business", "professional"],
                      isPrivate: false,
                      shareSlug: undefined,
                      createdAt: new Date().toISOString(),
                      items: []
                    }}
                    showActions={false}
                  />
                </div>
                <div className="break-inside-avoid lg:mt-32">
                  <OutfitCard
                    outfit={{
                      id: 3,
                      name: "Weekend Brunch",
                      description: "Comfortable and stylish outfit perfect for weekend brunches",
                      imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=400&fit=crop",
                      tags: ["casual", "weekend", "brunch"],
                      isPrivate: false,
                      shareSlug: undefined,
                      createdAt: new Date().toISOString(),
                      items: []
                    }}
                    showActions={false}
                  />
                </div>
              </>
            )}
          </div>

          <div className="text-center mt-32">
            <Link href="/register" className="inline-flex items-center gap-4 text-[clamp(1.2rem,1.5vw,2rem)] font-['var(--font-f-lausanne-400)'] text-[var(--color-story)] hover:text-black hover:tracking-wide transition-all duration-500 group border-b border-[var(--color-dark-grey-02)] pb-2">
              Start saving your own outfits
              <span className="group-hover:translate-x-4 transition-transform duration-500">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
