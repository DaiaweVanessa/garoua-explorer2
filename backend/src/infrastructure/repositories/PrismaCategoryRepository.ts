import { prisma } from '@infrastructure/prisma/client';
import {
  CategoryRepository,
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@domain/repositories/CategoryRepository';
import { Category } from '@domain/entities/Category';

export class PrismaCategoryRepository implements CategoryRepository {
  findAll(): Promise<Category[]> {
    return prisma.category.findMany({ orderBy: { name: 'asc' } });
  }

  findById(id: number): Promise<Category | null> {
    return prisma.category.findUnique({ where: { id } });
  }

  findBySlug(slug: string): Promise<Category | null> {
    return prisma.category.findUnique({ where: { slug } });
  }

  create(input: CreateCategoryInput): Promise<Category> {
    return prisma.category.create({ data: input });
  }

  update(id: number, input: UpdateCategoryInput): Promise<Category> {
    return prisma.category.update({ where: { id }, data: input });
  }

  async delete(id: number): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}
