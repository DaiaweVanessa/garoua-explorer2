import { prisma } from '@infrastructure/prisma/client';
import {
  ExcursionInfoRepository,
  UpsertExcursionInfoInput,
} from '@domain/repositories/GarouaContentRepositories';
import { ExcursionInfo } from '@domain/entities/GarouaContent';

function toEntity(row: any): ExcursionInfo {
  return {
    ...row,
    distanceKm: row.distanceKm !== null ? Number(row.distanceKm) : null,
  };
}

export class PrismaExcursionInfoRepository implements ExcursionInfoRepository {
  async findByPlaceId(placeId: number): Promise<ExcursionInfo | null> {
    const row = await prisma.excursionInfo.findUnique({ where: { placeId } });
    return row ? toEntity(row) : null;
  }

  async upsert(placeId: number, input: UpsertExcursionInfoInput): Promise<ExcursionInfo> {
    const row = await prisma.excursionInfo.upsert({
      where: { placeId },
      update: input,
      create: { placeId, ...input },
    });
    return toEntity(row);
  }
}
