import { Aggregate, AnyIdentity } from '@lib/domain/models'
import { Query } from '../Query'
import { Repository } from '../Repository'
import { InMemoryQueryProcessor } from './InMemoryQueryProcessor'


export class InMemoryRepository<
  TEntity extends Aggregate<AnyIdentity>
> implements Repository<TEntity> {
  protected entities = new Map<TEntity['id'], TEntity>()
  protected processor = new InMemoryQueryProcessor<TEntity>()

  public save(entity: TEntity): void {
    const copy = Object.create(entity)
    Object.assign(copy, entity)
    this.entities.set(entity.id.value, copy)
  }

  public get(id: TEntity['id']): TEntity {
    const value = this.entities.get(id.value)
    if (!value) { throw new Error(`Entity '${id.value}' not found`) }
    return value
  }

  public exists(id: TEntity['id']): boolean {
    return this.entities.has(id.value)
  }

  public find(query: Query<TEntity>): readonly TEntity[] {
    const entities = Array.from(this.entities.values())
    return this.processor.execute(query, entities)
  }

  public delete(id: TEntity['id']): void {
    if (!this.exists(id)) {
      throw new Error(`Entity '${id.value}' not found`)
    }
    this.entities.delete(id.value)
  }
}



