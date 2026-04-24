import bcrypt from "bcryptjs";
import { ExperienceLevel, PrismaClient, UserStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const demoPassword = process.env.DEMO_USER_PASSWORD;

  if (!demoPassword) {
    console.log("Skipping demo user seed: DEMO_USER_PASSWORD is not set.");
    return;
  }

  const passwordHash = await bcrypt.hash(demoPassword, 10);

  await prisma.user.upsert({
    where: { email: "demo@goldenpeakacademy.com" },
    update: {
      firstName: "Demo",
      lastName: "Trader",
      username: "demotrader",
      passwordHash,
      status: UserStatus.APPROVED,
      experienceLevel: ExperienceLevel.INTERMEDIATE
    },
    create: {
      email: "demo@goldenpeakacademy.com",
      firstName: "Demo",
      lastName: "Trader",
      username: "demotrader",
      passwordHash,
      status: UserStatus.APPROVED,
      experienceLevel: ExperienceLevel.INTERMEDIATE
    }
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
