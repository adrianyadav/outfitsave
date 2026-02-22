import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const bob = await prisma.user.upsert({
    where: { email: 'bob@example.com' },
    update: {},
    create: {
      email: 'bob@example.com',
      name: 'Bob Smith',
      password: hashedPassword,
    },
  });

  await prisma.outfit.create({
    data: {
      name: 'Bob Public Test Outfit',
      description: 'A test public outfit owned by Bob',
      imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=400&fit=crop',
      tags: ['test', 'casual'],
      isPrivate: false,
      userId: bob.id,
    },
  });
  console.log('✅ Bob public outfit created successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Failed to create bob outfit:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
