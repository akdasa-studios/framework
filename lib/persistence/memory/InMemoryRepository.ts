import { Result } from '@lib/core'
import { Aggregate, AnyIdentity } from '@lib/domain/models'
import { Query } from '../Query'
import { Repository } from '../Repository'
import { InMemoryQueryProcessor } from './InMemoryQueryProcessor'


export class InMemoryRepository<
  TEntity extends Aggregate<AnyIdentity>
> implements Repository<TEntity> {
  protected entities = new Map<TEntity['id'], TEntity>()
  protected processor = new InMemoryQueryProcessor<TEntity>()

  async all(): Promise<Result<readonly TEntity[]>> {
    return Result.ok(Array.from(this.entities.values()))
  }

  async save(entity: TEntity): Promise<Result<void, string>> {
    const copy = Object.create(entity)
    Object.assign(copy, entity)
    this.entities.set(entity.id.value, copy)
    return Result.ok()
  }

  async get(id: TEntity['id']): Promise<Result<TEntity, string>> {
    const value = this.entities.get(id.value)
    if (!value) { return Result.fail(`Entity '${id.value}' not found`) }
    return Result.ok(value)
  }

  async exists(id: TEntity['id']): Promise<boolean> {
    return this.entities.has(id.value)
  }

  async find(query: Query<TEntity>): Promise<Result<readonly TEntity[]>> {
    const entities = Array.from(this.entities.values())
    return Result.ok(this.processor.execute(query, entities))
  }

  async delete(id: TEntity['id']): Promise<Result<void, string>> {
    const isExists = await this.exists(id)
    if (!isExists) {
      return Result.fail(`Entity '${id.value}' not found`)
    }
    this.entities.delete(id.value)
    return Result.ok()
  }
}
