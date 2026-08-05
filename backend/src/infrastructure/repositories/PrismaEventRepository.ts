import { prisma } from '@infrastructure/prisma/client';
import {
  EventRepository,
  EventFilters,
  CreateEventInput,
  UpdateEventInput,
} from '@domain/repositories/TransportEventRepositories';
import { EventItem } from '@domain/entities/TransportEvent';

export class PrismaEventRepository implements EventRepository {
  findMany(filters: EventFilters): Promise<EventItem[]> {
    const where = filters.upcomingOnly ? { endDate: { gte: new Date() } } : {};
    return prisma.event.findMany({ where, orderBy: { startDate: 'asc' } });
  }

  findById(id: number): Promise<EventItem | null> {
    return prisma.event.findUnique({ where: { id } });
  }

  create(input: CreateEventInput): Promise<EventItem> {
    return prisma.event.create({ data: input });
  }

  update(id: number, input: UpdateEventInput): Promise<EventItem> {
    return prisma.event.update({ where: { id }, data: input });
  }

  async delete(id: number): Promise<void> {
    await prisma.event.delete({ where: { id } });
  }
}
