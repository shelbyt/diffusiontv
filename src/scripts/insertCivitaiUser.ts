//@ts-nocheck
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, './data/11-8-4/matched-objects-vidid.json');  // Replace with your actual JSON file path
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const jsonDataArray = JSON.parse(fileContent);

  const userSet = new Set();  // To store unique usernames

  const dataForBulkInsert = jsonDataArray.map((jsonData) => {
    const {
      id: remoteId,
      url,
      hash,
      videoId,
      width,
      height,
      nsfwLevel,
      nsfw,
      createdAt,
      postId,
      username,
      stats,
      meta,
    } = jsonData;

    // Initialize to default values
    let laughCount = null;
    let likeCount = null;
    let heartCount = null;
    let commentCount = null;

    // Destructure if stats exists
    if (stats) {
      ({ laughCount, likeCount, heartCount, commentCount } = stats);
    }

    // Initialize to default value
    let model = null;

    // Destructure if meta exists
    if (meta && meta.Model) {
      model = meta.Model;
    }

    userSet.add(username); // Add username to the set

    return {
      remoteId,
      url,
      hash,
      width,
      videoId,
      height,
      nsfwLevel,
      nsfw,
      createdAt,
      postId,
      username,
      laughCount,
      likeCount,
      heartCount,
      commentCount,
      stats: stats ? JSON.stringify(stats) : null,
      model,
      meta: meta ? JSON.stringify(meta) : null,
    };
  });

  // Create user data array
  const users = Array.from(userSet).map(username => ({
    username,
    imageUrl: "https://avatars.githubusercontent.com/u/117393426?s=128&v=4", // Your fixed image URL
  }));

  try {
    // Insert users
    const createdUsers = await prisma.user.createMany({
      data: users,
      skipDuplicates: true,
    });
    console.log(`Created ${createdUsers.count} users.`);

    // Insert images
    const newImages = await prisma.image.createMany({
      data: dataForBulkInsert,
      skipDuplicates: true,
    });
    console.log(`${newImages.count} new images inserted.`);
  } catch (e) {
    console.error('Error during operation:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
