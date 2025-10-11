import { Prisma, type PrismaClient } from "#db"

export type PrismaTSClient = Prisma.TransactionClient

export function $serializable<T>(
  prisma: PrismaClient,
  callback: (tx: PrismaTSClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(callback, {
    isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
  })
}

export function $repeatable<T>(
  prisma: PrismaClient,
  callback: (tx: PrismaTSClient) => Promise<T>,
): Promise<T> {
  return prisma.$transaction(callback, {
    isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead,
  })
}
