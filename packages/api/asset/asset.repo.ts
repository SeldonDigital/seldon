import type { PrismaTSClient } from "../db.js"

export async function getAssetById(prisma: PrismaTSClient, assetId: string) {
  return prisma.asset.findUnique({
    where: { id: assetId },
  })
}

export async function createAsset(
  prisma: PrismaTSClient,
  assetId: string,
  projectId: string,
  contentType: string,
) {
  const newAsset = await prisma.asset.create({
    data: {
      id: assetId,
      projectId,
      type: contentType,
    },
  })

  return newAsset
}

export async function createAssets(
  prisma: PrismaTSClient,
  assets: Array<{ id: string; projectId: string; type: string }>,
): Promise<void> {
  await prisma.asset.createMany({
    data: assets,
    skipDuplicates: true,
  })
}

export async function deleteProjectAssets(
  prisma: PrismaTSClient,
  projectId: string,
): Promise<void> {
  await prisma.asset.deleteMany({
    where: {
      projectId,
    },
  })
}
