import { Category } from '@domain/entities/Category';

export interface CreateCategoryInput {
  name: string;
  slug: string;
  icon?: string | null;
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  icon?: string | null;
}

export interface CategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: number): Promise<Category | null>;
  findBySlug(slug: string): Promise<Category | null>;
  create(input: CreateCategoryInput): Promise<Category>;
  update(id: number, input: UpdateCategoryInput): Promise<Category>;
  delete(id: number): Promise<void>;
}
