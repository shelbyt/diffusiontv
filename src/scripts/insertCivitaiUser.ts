//@ts-nocheck
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'data/10-25/username-list');
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  const lines = fileContent.split('\n');
  const users = lines.map((line) => {
    const [username, imageUrl] = line.split(',').map(s => s.trim());
    return {
      username: username || null,
      imageUrl: imageUrl === "" ? " https://avatars.githubusercontent.com/u/117393426?s=128&v=4" : imageUrl, // Set to null if empty string
      fromCiv: true,
    };
  });

  try {
    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true, // Skips records with duplicate constraints
    });
    console.log(`Created ${createdUsers.count} users.`);
  } catch (e) {
    console.error('Error inserting data:', e);
  }
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
