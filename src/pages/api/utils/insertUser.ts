//@ts-nocheck
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createUser() {
    const newUser = await prisma.user.create({
        data: {
            // replace with your actual data
            email: 'john.doe@example.com',
            username: 'johndoe',
            sl_id: 'unique_sl_id',
            provider: 'provider_name',
            imageUrl: 'http://example.com/image.jpg',
        },
    });

    console.log(`Created new user: ${newUser.email}`);
}

createUser()
    .catch(e => {
        console.error(e);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });