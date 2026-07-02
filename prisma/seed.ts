import { prisma } from "../src/lib/prisma";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("Starting DB seeding...");

  const dataPath = path.join(process.cwd(), "prisma", "seed-data.json");
  
  if (!fs.existsSync(dataPath)) {
    console.error(`Seed data not found at ${dataPath}. Please dump the DB first.`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(dataPath, "utf-8");
  const data = JSON.parse(rawData);

  console.log("Seeding AdmissionYears...");
  for (const item of data.admissionYears || []) {
    await prisma.admissionYear.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log("Seeding Mentors...");
  for (const item of data.mentors || []) {
    await prisma.mentor.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log("Seeding Mentees...");
  for (const item of data.mentees || []) {
    await prisma.mentee.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log("Seeding Hints...");
  for (const item of data.hints || []) {
    await prisma.hint.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log("Seeding ShopItems...");
  for (const item of data.shopItems || []) {
    await prisma.shopItem.upsert({
      where: { id: item.id },
      update: item,
      create: item,
    });
  }

  console.log("Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
