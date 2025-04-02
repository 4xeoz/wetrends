import { PrismaClient } from "@prisma/client";


/**
 * A global variable for the Prisma client instance.
 * 
 * This is used to ensure that there is a single instance of the Prisma client
 * throughout the application. It casts the global object to an unknown type
 * and then to an object with a `prisma` property of type `PrismaClient`.
 * 
 * @type {PrismaClient} The Prisma client instance.
 */
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
