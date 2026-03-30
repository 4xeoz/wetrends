#!/usr/bin/env tsx
import bcrypt from "bcryptjs";
import { prisma } from "../prisma/prisma";

const EMAIL = "iyad@wetrends.co.uk";
const PASSWORD = "admin123";
const NAME = "Iyad Cherifi";

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
    console.log(`Password: ${PASSWORD}`);
    console.log(`Name: ${NAME}`);
  } catch (error) {
    console.error("Error creating admin user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
