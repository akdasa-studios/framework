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

  public all(): readonly TEntity[] {
    return Array.from(this.entities.values())
  }

  public save(entity: TEntity): Result<void, string> {
    const copy = Object.create(entity)
    Object.assign(copy, entity)
    this.entities.set(entity.id.value, copy)
    return Result.ok()
  }

  public get(id: TEntity['id']): Result<TEntity, string> {
    const value = this.entities.get(id.value)
    if (!value) { return Result.fail(`Entity '${id.value}' not found`) }
    return Result.ok(value)
  }

  public exists(id: TEntity['id']): boolean {
    return this.entities.has(id.value)
  }

  public find(query: Query<TEntity>): readonly TEntity[] {
    const entities = Array.from(this.entities.values())
    return this.processor.execute(query, entities)
  }

  public delete(id: TEntity['id']): Result<void, string> {
    if (!this.exists(id)) {
      return Result.fail(`Entity '${id.value}' not found`)
    }
    this.entities.delete(id.value)
    return Result.ok()
  }
}
