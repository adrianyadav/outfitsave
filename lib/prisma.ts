import { PrismaClient } from '@prisma/client'

// Removed withAccelerate() to support direct connection to Neon.
// If you use Prisma Accelerate in the future, you can import and add it back:
// import { withAccelerate } from '@prisma/extension-accelerate'
// const prisma = new PrismaClient().$extends(withAccelerate())

const prisma = new PrismaClient()

const globalForPrisma = global as unknown as { prisma: typeof prisma }

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma