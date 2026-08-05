import { prisma } from '@infrastructure/prisma/client';
import {
  TransportRepository,
  CreateTransportInput,
  UpdateTransportInput,
} from '@domain/repositories/TransportEventRepositories';
import { TransportOption } from '@domain/entities/TransportEvent';

function toEntity(row: any): TransportOption {
  return { ...row, basePrice: Number(row.basePrice) };
}

export class PrismaTransportRepository implements TransportRepository {
  async findAll(): Promise<TransportOption[]> {
    const rows = await prisma.transportOption.findMany({ orderBy: { type: 'asc' } });
    return rows.map(toEntity);
  }

  async findById(id: number): Promise<TransportOption | null> {
    const row = await prisma.transportOption.findUnique({ where: { id } });
    return row ? toEntity(row) : null;
  }

  async create(input: CreateTransportInput): Promise<TransportOption> {
    const row = await prisma.transportOption.create({ data: input });
    return toEntity(row);
  }

  async update(id: number, input: UpdateTransportInput): Promise<TransportOption> {
    const row = await prisma.transportOption.update({ where: { id }, data: input });
    return toEntity(row);
  }

  async delete(id: number): Promise<void> {
    await prisma.transportOption.delete({ where: { id } });
  }
}
