import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plainPassword = "Admin@123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { username: "admin" },
    update: { password: hashedPassword, role: "ADMIN" },
    create: { username: "admin", password: hashedPassword, role: "ADMIN" },
  });

  console.log(
    JSON.stringify({
      ok: true,
      username: user.username,
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
