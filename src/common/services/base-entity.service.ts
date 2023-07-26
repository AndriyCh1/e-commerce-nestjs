import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';

export type EntityId = number | string;

@Injectable()
export abstract class BaseEntityService<T extends { id }> {
  protected constructor(
    private readonly repository: Repository<T>,
    private readonly entityName: string,
  ) {}

  async findById(id: EntityId): Promise<T> {
    const result = await this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });

    if (!result) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }

    return result;
  }

  async update(id: EntityId, entity: DeepPartial<T>): Promise<T> {
    await this.repository.update(id, entity);
    return await this.findById(id);
  }

  async delete(id: EntityId): Promise<void> {
    const result = await this.repository.delete(id);

    if (!result.affected) {
      throw new NotFoundException(`${this.entityName} with id ${id} not found`);
    }
  }
}
