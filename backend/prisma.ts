const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");

async function main() {
  ///seeding here
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.friendrequest.deleteMany();
  await prisma.password.deleteMany();
  await prisma.user.deleteMany();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

module.exports = prisma;
