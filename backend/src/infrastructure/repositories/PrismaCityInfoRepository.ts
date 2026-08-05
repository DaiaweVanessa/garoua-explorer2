import { prisma } from '@infrastructure/prisma/client';
import { CityInfoRepository, UpsertCityInfoInput } from '@domain/repositories/GarouaContentRepositories';
import { CityInfo } from '@domain/entities/GarouaContent';

const SINGLETON_ID = 1;

export class PrismaCityInfoRepository implements CityInfoRepository {
  get(): Promise<CityInfo | null> {
    return prisma.cityInfo.findUnique({ where: { id: SINGLETON_ID } });
  }

  upsert(input: UpsertCityInfoInput): Promise<CityInfo> {
    return prisma.cityInfo.upsert({
      where: { id: SINGLETON_ID },
      update: input,
      create: { id: SINGLETON_ID, ...input },
    });
  }
}
