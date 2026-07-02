import { prisma } from "../src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Dumping database...");

  const admissionYears = await prisma.admissionYear.findMany();
  const mentors = await prisma.mentor.findMany();
  const mentees = await prisma.mentee.findMany();
  const hints = await prisma.hint.findMany();
  const shopItems = await prisma.shopItem.findMany();

  const data = {
    admissionYears,
    mentors,
    mentees,
    hints,
    shopItems,
  };

  const outputPath = path.join(process.cwd(), "prisma", "seed-data.json");
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));

  console.log(`Database dumped to ${outputPath}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
