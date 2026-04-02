import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_SEED_EMAIL ?? "admin@voltex.com";
  const password = process.env.ADMIN_SEED_PASSWORD ?? "admin_change_me_123!";
  const name = process.env.ADMIN_SEED_NAME ?? "Admin";

  const passwordHash = await bcrypt.hash(password, 12);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { passwordHash, name },
    create: {
      email,
      name,
      passwordHash,
      role: "ADMIN",
      isActive: true,
    },
  });

  console.log(`✅  Admin seeded: ${admin.email} (id: ${admin.id})`);
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
