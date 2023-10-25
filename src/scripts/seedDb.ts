//@ts-nocheck
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

async function main() {
  const filePath = path.join(__dirname, 'merged-videos-10-24.json');  // Replace with your actual JSON file path
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const jsonDataArray = JSON.parse(fileContent);

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

  const newImages = await prisma.image.createMany({
    data: dataForBulkInsert,
    skipDuplicates: true,
  });

  console.log(`${newImages.count} new images inserted.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
