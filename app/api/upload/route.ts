import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import { put } from '@vercel/blob';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const session = await getServerSession(authOptions as any) as any;
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const formData = await request.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            );
        }

        // Validate file type
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { error: "Invalid file type. Only JPEG, PNG, and WebP images are allowed." },
                { status: 400 }
            );
        }

        // Validate file size (max 5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (file.size > maxSize) {
            return NextResponse.json(
                { error: "File too large. Maximum size is 5MB." },
                { status: 400 }
            );
        }

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const fileExtension = file.name.split('.').pop();
        const fileName = `${timestamp}-${randomString}.${fileExtension}`;

        // Check if we're in production (Vercel) or development
        const isProduction = process.env.NODE_ENV === 'production' && process.env.VERCEL === '1';

        if (isProduction) {
            // Use Vercel Blob in production
            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                return NextResponse.json(
                    { error: "Upload service not configured" },
                    { status: 503 }
                );
            }

            const blobFileName = `unpacked/${fileName}`;
            const blob = await put(blobFileName, file, {
                access: 'public',
            });

            return NextResponse.json({ imageUrl: blob.url });
        } else {
            // Use local storage in development
            const uploadsDir = join(process.cwd(), 'public', 'uploads');

            // Ensure uploads directory exists
            try {
                await mkdir(uploadsDir, { recursive: true });
            } catch (error) {
                console.error("Error creating uploads directory:", error);
            }

            const filePath = join(uploadsDir, fileName);
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);

            await writeFile(filePath, buffer);

            // Return the local URL
            const imageUrl = `/uploads/${fileName}`;
            return NextResponse.json({ imageUrl });
        }
    } catch (error) {
        console.error("Error uploading file:", error);
        return NextResponse.json(
            { error: "Failed to upload file" },
            { status: 500 }
        );
    }
} 