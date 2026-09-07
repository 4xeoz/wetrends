#!/usr/bin/env tsx
import { loadEnvConfig } from "@next/env";
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/prisma";

loadEnvConfig(process.cwd());

function requireAdminSetting(name: 'ADMIN_EMAIL' | 'ADMIN_PASSWORD') {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Set ${name} before running this script.`);
  return value;
}

const EMAIL = requireAdminSetting('ADMIN_EMAIL').toLowerCase();
const PASSWORD = requireAdminSetting('ADMIN_PASSWORD');
const NAME = process.env.ADMIN_NAME?.trim() || "WeTrends Admin";

if (!EMAIL.includes("@")) {
  throw new Error("Set ADMIN_EMAIL to a valid email address before running this script.");
}

if (PASSWORD.length < 12) {
  throw new Error("Set ADMIN_PASSWORD to at least 12 characters before running this script.");
}

async function createAdmin() {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: EMAIL },
    });

    if (existingUser) {
      console.log(`User ${EMAIL} already exists!`);
      
      // Update password
      const hashedPassword = await bcrypt.hash(PASSWORD, 12);
      await prisma.user.update({
        where: { email: EMAIL },
        data: { password: hashedPassword },
      });
      console.log(`Password updated for ${EMAIL}`);
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(PASSWORD, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: EMAIL,
        name: NAME,
        password: hashedPassword,
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log(`Email: ${EMAIL}`);
    console.log(`Name: ${NAME}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
