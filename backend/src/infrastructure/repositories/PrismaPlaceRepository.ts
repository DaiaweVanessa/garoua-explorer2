import { Prisma } from '@prisma/client';
import { prisma } from '@infrastructure/prisma/client';
import {
  CreatePlaceInput,
  PaginatedResult,
  PlaceFilters,
  PlaceRepository,
  UpdatePlaceInput,
} from '@domain/repositories/PlaceRepository';
import { PlaceWithRelations } from '@domain/entities/Place';

const placeInclude = {
  category: { select: { id: true, name: true, slug: true, icon: true } },
  photos: { orderBy: { position: 'asc' as const } },
};

export class PrismaPlaceRepository implements PlaceRepository {
  async findMany(filters: PlaceFilters): Promise<PaginatedResult<PlaceWithRelations>> {
    const { categorySlug, search, lat, lng, radiusKm, page, limit } = filters;
    const skip = (page - 1) * limit;

    // Recherche géolocalisée : nécessite du SQL brut pour calculer la distance (Haversine)
    if (lat !== undefined && lng !== undefined) {
      const radius = radiusKm ?? 50;

      const conditions: Prisma.Sql[] = [];
      if (categorySlug) conditions.push(Prisma.sql`c.slug = ${categorySlug}`);
      if (search) conditions.push(Prisma.sql`(p.name LIKE ${'%' + search + '%'} OR p.description LIKE ${'%' + search + '%'})`);
      const whereSql = conditions.length ? Prisma.sql`WHERE ${Prisma.join(conditions, ' AND ')}` : Prisma.empty;

      const distanceExpr = Prisma.sql`
        6371 * acos(
          cos(radians(${lat})) * cos(radians(p.latitude)) *
          cos(radians(p.longitude) - radians(${lng})) +
          sin(radians(${lat})) * sin(radians(p.latitude))
        )
      `;

      const rows = await prisma.$queryRaw<Array<{ id: number; distance_km: number }>>`
        SELECT t.id, t.distance_km FROM (
          SELECT p.id, ${distanceExpr} AS distance_km
          FROM places p
          JOIN categories c ON c.id = p.category_id
          ${whereSql}
        ) t
        WHERE t.distance_km <= ${radius}
        ORDER BY t.distance_km ASC
        LIMIT ${limit} OFFSET ${skip}
      `;

      const countRows = await prisma.$queryRaw<Array<{ total: bigint }>>`
        SELECT COUNT(*) AS total FROM (
          SELECT p.id, ${distanceExpr} AS distance_km
          FROM places p
          JOIN categories c ON c.id = p.category_id
          ${whereSql}
        ) t
        WHERE t.distance_km <= ${radius}
      `;

      const distanceById = new Map(rows.map((r) => [r.id, r.distance_km]));
      const ids = rows.map((r) => r.id);

      const places = ids.length
        ? await prisma.place.findMany({ where: { id: { in: ids } }, include: placeInclude })
        : [];

      // Repositionne les résultats dans l'ordre de distance (findMany ne le garantit pas)
      const items = ids
        .map((id) => places.find((p) => p.id === id))
        .filter((p): p is NonNullable<typeof p> => Boolean(p))
        .map((p) => ({ ...toEntity(p), distanceKm: Math.round(distanceById.get(p.id)! * 10) / 10 }));

      return { items, total: Number(countRows[0]?.total ?? 0), page, limit };
    }

    // Recherche classique (sans géolocalisation)
    const where: Prisma.PlaceWhereInput = {};
    if (categorySlug) where.category = { slug: categorySlug };
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [places, total] = await Promise.all([
      prisma.place.findMany({
        where,
        include: placeInclude,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.place.count({ where }),
    ]);

    return { items: places.map(toEntity), total, page, limit };
  }

  async findById(id: number): Promise<PlaceWithRelations | null> {
    const place = await prisma.place.findUnique({ where: { id }, include: placeInclude });
    return place ? toEntity(place) : null;
  }

  async create(input: CreatePlaceInput): Promise<PlaceWithRelations> {
    const place = await prisma.place.create({
      data: {
        name: input.name,
        description: input.description ?? null,
        categoryId: input.categoryId,
        latitude: input.latitude,
        longitude: input.longitude,
        address: input.address ?? null,
        phone: input.phone ?? null,
        openingHours: input.openingHours ?? null,
        createdById: input.createdById,
      },
      include: placeInclude,
    });
    return toEntity(place);
  }

  async update(id: number, input: UpdatePlaceInput): Promise<PlaceWithRelations> {
    const place = await prisma.place.update({
      where: { id },
      data: input,
      include: placeInclude,
    });
    return toEntity(place);
  }

  async delete(id: number): Promise<void> {
    await prisma.place.delete({ where: { id } });
  }

  async addPhoto(placeId: number, url: string, position: number): Promise<void> {
    await prisma.placePhoto.create({ data: { placeId, url, position } });
  }

  async deletePhoto(photoId: number): Promise<void> {
    await prisma.placePhoto.delete({ where: { id: photoId } });
  }
}

// Convertit les Decimal Prisma (latitude/longitude) en number pour la couche Domain
function toEntity(place: any): PlaceWithRelations {
  return {
    ...place,
    latitude: Number(place.latitude),
    longitude: Number(place.longitude),
  };
}
