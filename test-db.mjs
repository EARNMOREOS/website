import pkg from '@prisma/client';
const { PrismaClient } = pkg;

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    console.log('✅ Successfully connected to the database!');
    console.log(`Current user count: ${userCount}`);
  } catch (error) {
    console.error('❌ Failed to connect to the database:');
    console.error(error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
