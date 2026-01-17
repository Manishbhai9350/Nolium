import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from '@prisma/adapter-neon'

const globalPrismaClient = global as unknown as {
    prisma: PrismaClient,
    neon: PrismaNeon
}

const adapter = globalPrismaClient.neon || new PrismaNeon({ connectionString: process.env.DATABASE_URL })

const prisma = globalPrismaClient.prisma || new PrismaClient({
    adapter
})

if(process.env.NODE_ENV !== 'production') {
    globalPrismaClient.prisma = prisma;
    globalPrismaClient.neon = adapter
}

export default prisma