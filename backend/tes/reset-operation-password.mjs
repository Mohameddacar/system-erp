import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const plainPassword = "Operation@123";
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const user = await prisma.user.upsert({
    where: { username: "operation" },
    update: { password: hashedPassword, role: "OPERATION" },
    create: { username: "operation", password: hashedPassword, role: "OPERATION" },
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
