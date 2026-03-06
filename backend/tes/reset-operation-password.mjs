import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plainPassword = "Operation@123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { email: "operation@brightmts.local" },
    update: {
      username: "operation",
      passwordHash: hashedPassword,
      role: "OPERATION",
      status: "ACTIVE",
      emailVerified: true,
      locked: false,
    },
    create: {
      email: "operation@brightmts.local",
      username: "operation",
      passwordHash: hashedPassword,
      role: "OPERATION",
      status: "ACTIVE",
      emailVerified: true,
      locked: false,
    },
  });

  console.log(
    JSON.stringify({
      ok: true,
      email: user.email,
      username: user.username ?? "",
      role: user.role,
      passwordForLogin: plainPassword,
    })
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
