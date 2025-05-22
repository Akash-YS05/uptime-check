import { prismaClient } from "../src";


async function seed() {
  const user = await prismaClient.user.create({
    data: {
        id: "10",
      email: "user@example.com",
    },
  });

  const validator = await prismaClient.validator.create({
    data: {
      publickKey: "pubkey123",
      location: "New York",
      ip: "192.168.0.1",
    },
  });

  const website = await prismaClient.websites.create({
    data: {
      url: "https://example.com",
      userId: user.id,
      disabled: false,
    },
  });

  await prismaClient.websiteTick.create({
    data: {
      websiteId: website.id,
      validatorId: validator.id,
      status: "Good",
      latency: 123.45,
    },
  });

  console.log("Seed successful");
}

seed()
  .catch((e) => {
    console.error("Error:", e);
    process.exit(1);
  })
  .finally(() => prismaClient.$disconnect());
