const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const bcrypt = require("bcryptjs");

async function main() {
  ///seeding here
  await prisma.friendListEntry.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.friendRequest.deleteMany();
  await prisma.password.deleteMany();
  await prisma.user.deleteMany();

  const hashedPassword = await bcrypt.hash("test", 10);

  const user = await prisma.user.create({
    data: {
      username: "jake",
      email: "jtux123@gmail.com",
      firstname: "jake",
      lastname: "tucker",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      username: "john",
      email: "john@gmail.com",
      firstname: "john",
      lastname: "john",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const user3 = await prisma.user.create({
    data: {
      username: "doris",
      email: "doris@gmail.com",
      firstname: "doris",
      lastname: "doris",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const user4 = await prisma.user.create({
    data: {
      username: "barry",
      email: "barry@gmail.com",
      firstname: "barry",
      lastname: "barry",
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  //jake friends with john
  const friendListEntry = await prisma.friendListEntry.create({
    data: {
      userId: user.id,
      friendId: user2.id,
    },
  });

  //jake friend request to barry
  const newFriendRequest = await prisma.friendRequest.create({
    data: {
      senderId: user.id,
      receiverId: user4.id,
    },
  });

  //john friend request to doris
  const newFriendRequest2 = await prisma.friendRequest.create({
    data: {
      senderId: user2.id,
      receiverId: user3.id,
    },
  });

  //chat between jake and john
  const newChat = await prisma.chat.create({
    data: {
      users: {
        connect: [{ id: user.id }, { id: user2.id }],
      },
    },
  });

  console.log("Seeding script done.");
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
