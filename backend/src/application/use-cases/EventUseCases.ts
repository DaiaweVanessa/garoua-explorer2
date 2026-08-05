import { EventRepository } from '@domain/repositories/TransportEventRepositories';
import { AppError } from '@presentation/middlewares/errorHandler';

export class ListEventsUseCase {
  constructor(private readonly eventRepository: EventRepository) {}
  execute(upcomingOnly: boolean) {
    return this.eventRepository.findMany({ upcomingOnly });
  }
}

export class GetEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: number) {
    const event = await this.eventRepository.findById(id);
    if (!event) {
      throw new AppError(404, 'EVENT_NOT_FOUND', 'Événement introuvable');
    }
    return event;
  }
}

export class CreateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  execute(input: Parameters<EventRepository['create']>[0]) {
    if (input.endDate < input.startDate) {
      throw new AppError(400, 'INVALID_DATES', 'La date de fin doit être après la date de début');
    }
    return this.eventRepository.create(input);
  }
}

export class UpdateEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: number, input: Parameters<EventRepository['update']>[1]) {
    const existing = await this.eventRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'EVENT_NOT_FOUND', 'Événement introuvable');
    }
    const start = input.startDate ?? existing.startDate;
    const end = input.endDate ?? existing.endDate;
    if (end < start) {
      throw new AppError(400, 'INVALID_DATES', 'La date de fin doit être après la date de début');
    }
    return this.eventRepository.update(id, input);
  }
}

export class DeleteEventUseCase {
  constructor(private readonly eventRepository: EventRepository) {}

  async execute(id: number) {
    const existing = await this.eventRepository.findById(id);
    if (!existing) {
      throw new AppError(404, 'EVENT_NOT_FOUND', 'Événement introuvable');
    }
    await this.eventRepository.delete(id);
  }
}
