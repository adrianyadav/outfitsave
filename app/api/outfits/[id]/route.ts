import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import prisma from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    try {
        const outfit = await prisma.outfit.findUnique({
            where: {
                id: parseInt(id),
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                items: true,
            },
        });

        if (!outfit) {
            return NextResponse.json(
                { error: "Outfit not found" },
                { status: 404 }
            );
        }

        // Include userId in the response for ownership checking
        const outfitWithUserId = {
            ...outfit,
            userId: outfit.userId
        };

        return NextResponse.json(outfitWithUserId);
    } catch (error) {
        console.error("Error fetching outfit:", error);
        return NextResponse.json(
            { error: "Failed to fetch outfit" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as any;

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const outfitId = parseInt(id);

        if (isNaN(outfitId)) {
            return NextResponse.json({ error: "Invalid outfit ID" }, { status: 400 });
        }

        // Check if the outfit exists and belongs to the current user
        const outfit = await prisma.outfit.findFirst({
            where: {
                id: outfitId,
                userId: session.user.id
            }
        });

        if (!outfit) {
            return NextResponse.json({ error: "Outfit not found or access denied" }, { status: 404 });
        }

        // Delete the outfit and all related data
        await prisma.outfit.delete({
            where: {
                id: outfitId
            }
        });

        return NextResponse.json({ message: "Outfit deleted successfully" });
    } catch (error) {
        console.error("Error deleting outfit:", error);
        return NextResponse.json({ error: "Failed to delete outfit" }, { status: 500 });
    }
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as any;

        if (!session?.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;
        const outfitId = parseInt(id);

        if (isNaN(outfitId)) {
            return NextResponse.json({ error: "Invalid outfit ID" }, { status: 400 });
        }

        // Check if the outfit exists and belongs to the current user
        const existingOutfit = await prisma.outfit.findFirst({
            where: {
                id: outfitId,
                userId: session.user.id
            },
            include: {
                items: true
            }
        });

        if (!existingOutfit) {
            return NextResponse.json({ error: "Outfit not found or access denied" }, { status: 404 });
        }

        const body = await request.json();
        const { name, description, imageUrl, tags, isPrivate, items } = body;

        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        // Delete existing items
        await prisma.outfitItem.deleteMany({
            where: {
                outfitId: outfitId
            }
        });

        // Clean up incoming items to prevent ID insertion conflicts with auto-increment
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const itemsToCreate = (items || []).map((item: any) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, outfitId, createdAt, updatedAt, ...rest } = item;
            return rest;
        });

        // Update the outfit
        const updatedOutfit = await prisma.outfit.update({
            where: {
                id: outfitId
            },
            data: {
                name,
                description,
                imageUrl,
                tags: tags || [],
                isPrivate: isPrivate || false,
                items: {
                    create: itemsToCreate
                }
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
                items: true,
            },
        });

        return NextResponse.json(updatedOutfit);
    } catch (error) {
        console.error("Error updating outfit:", error);
        return NextResponse.json({ error: "Failed to update outfit" }, { status: 500 });
    }
}
