import { Aggregate, AnyIdentity } from '@lib/domain/models'
import { Query } from '../Query'
import { Repository } from '../Repository'
import { InMemoryQueryProcessor } from './InMemoryQueryProcessor'


export class InMemoryRepository<
  TEntity extends Aggregate<AnyIdentity>
> implements Repository<TEntity> {
  protected entities = new Map<TEntity['id'], TEntity>()
  protected processor = new InMemoryQueryProcessor<TEntity>()

  async all(): Promise<readonly TEntity[]> {
    return Array.from(this.entities.values())
  }

  async save(entity: TEntity): Promise<void> {
    const copy = Object.create(entity)
    Object.assign(copy, entity)
    this.entities.set(entity.id.value, copy)
  }

  async get(id: TEntity['id']): Promise<TEntity> {
    const value = this.entities.get(id.value)
    if (!value) { throw new Error(`Entity '${id.value}' not found`) }
    return value
  }

  async exists(id: TEntity['id']): Promise<boolean> {
    return this.entities.has(id.value)
  }

  async find(query: Query<TEntity>): Promise<readonly TEntity[]> {
    const entities = Array.from(this.entities.values())
    return this.processor.execute(query, entities)
  }

  async delete(id: TEntity['id']): Promise<void> {
    const isExists = await this.exists(id)
    if (!isExists) { throw new Error(`Entity '${id.value}' not found`) }
    this.entities.delete(id.value)
  }
}
