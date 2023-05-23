import { Aggregate, AnyIdentity } from '@lib/domain/models'
import { Query } from '../Query'
import { QueryOptions, Repository, ResultSet } from '../Repository'
import { InMemoryQueryProcessor } from './InMemoryQueryProcessor'


export class InMemoryRepository<
  TAggregate extends Aggregate<AnyIdentity>
> implements Repository<TAggregate> {
  protected entities = new Map<TAggregate['id'], TAggregate>()
  protected processor = new InMemoryQueryProcessor<TAggregate>()

  async all(
  // options?: QueryOptions,
  ): Promise<ResultSet<TAggregate>> {
    return new ResultSet(
      Array.from(this.entities.values())
    )
  }

  async save(entity: TAggregate): Promise<void> {
    const copy = Object.create(entity)
    Object.assign(copy, entity)
    this.entities.set(entity.id.value, copy)
  }

  async get(id: TAggregate['id']): Promise<TAggregate> {
    const value = this.entities.get(id.value)
    if (!value) { throw new Error(`Entity '${id.value}' not found`) }
    return value
  }

  async exists(id: TAggregate['id']): Promise<boolean> {
    return this.entities.has(id.value)
  }

  async find(
    query: Query<TAggregate>,
    // options?: QueryOptions,
  ): Promise<ResultSet<TAggregate>> {
    const entities = Array.from(this.entities.values())
    const result = this.processor.execute(query, entities)
    return new ResultSet<TAggregate>(result) // no bookmark needed, we have all entities in memory
  }

  async delete(id: TAggregate['id']): Promise<void> {
    const isExists = await this.exists(id)
    if (!isExists) { throw new Error(`Entity '${id.value}' not found`) }
    this.entities.delete(id.value)
  }
}
