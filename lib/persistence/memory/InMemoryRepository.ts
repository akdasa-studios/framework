import { Aggregate, type AnyIdentity } from '@akd-studios/framework/domain/models'
import { type Query, type QueryOptions, type Repository, ResultSet } from '@akd-studios/framework/persistence'
import { InMemoryQueryProcessor } from './InMemoryQueryProcessor'


export class InMemoryRepository<
  TAggregate extends Aggregate<AnyIdentity>
> implements Repository<TAggregate> {
  protected entities = new Map<TAggregate['id'], TAggregate>()
  protected processor = new InMemoryQueryProcessor<TAggregate>()

  async all(
    options?: QueryOptions,
  ): Promise<ResultSet<TAggregate>> {
    let result = Array.from(this.entities.values())

    result = this.slice(result, options?.skip, options?.limit)

    return new ResultSet(
      result,
      { start: options?.skip || 0, count: result.length }
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
    options?: QueryOptions,
  ): Promise<ResultSet<TAggregate>> {
    const startIndex = options?.skip || 0
    let result = this.processor
      .execute(query, Array.from(this.entities.values()))

    result = this.slice(result, options?.skip, options?.limit)

    return new ResultSet<TAggregate>(
      result, { start: startIndex, count: result.length }
    )
  }

  async delete(id: TAggregate['id']): Promise<void> {
    const isExists = await this.exists(id)
    if (!isExists) { throw new Error(`Entity '${id.value}' not found`) }
    this.entities.delete(id.value)
  }

  private slice(
    list: readonly TAggregate[],
    skip: number | undefined,
    limit: number | undefined
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return list.slice(skip, (skip + limit) || limit)
  }
}
