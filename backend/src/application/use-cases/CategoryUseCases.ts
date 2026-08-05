import { CategoryRepository } from '@domain/repositories/CategoryRepository';
import { AppError } from '@presentation/middlewares/errorHandler';

export class ListCategoriesUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}
  execute() {
    return this.categoryRepository.findAll();
  }
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  icon?: string | null;
}

export class CreateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(input: CreateCategoryInput) {
    const existing = await this.categoryRepository.findBySlug(input.slug);
    if (existing) {
      throw new AppError(409, 'CATEGORY_SLUG_EXISTS', 'Ce slug de catégorie existe déjà');
    }
    return this.categoryRepository.create(input);
  }
}

export interface UpdateCategoryInput {
  name?: string;
  slug?: string;
  icon?: string | null;
}

export class UpdateCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number, input: UpdateCategoryInput) {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Catégorie introuvable');
    }
    if (input.slug && input.slug !== existing.slug) {
      const slugTaken = await this.categoryRepository.findBySlug(input.slug);
      if (slugTaken) {
        throw new AppError(409, 'CATEGORY_SLUG_EXISTS', 'Ce slug de catégorie existe déjà');
      }
    }
    return this.categoryRepository.update(id, input);
  }
}

export class DeleteCategoryUseCase {
  constructor(private readonly categoryRepository: CategoryRepository) {}

  async execute(id: number) {
    const existing = await this.categoryRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'CATEGORY_NOT_FOUND', 'Catégorie introuvable');
    }
    await this.categoryRepository.delete(id);
  }
}
