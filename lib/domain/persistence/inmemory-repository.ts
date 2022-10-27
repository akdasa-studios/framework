import { Entity, AnyIdentity } from '@lib/domain/models'
import { IRepository, Predicate, Query, Expression, Binding } from '@lib/domain/persistence'
import { Operators } from './query'


export abstract class InMemoryRepository<
  TEntity extends Entity<AnyIdentity>
> implements IRepository<TEntity> {
  protected entities: Map<TEntity['id'], TEntity> = new Map()

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
    const o = Array.from(this.entities.values())

    if (query instanceof Predicate) {
      if (query.operator === Operators.Equal) {
        return o.filter(x => this.getFieldValue(query.field, x) === query.value)
      }

    } else if (query instanceof Expression) {
      if (query.operator === 'and') {
        const arrays = query.query.map(e => this.find(e as Predicate<TEntity>))
        return arrays.reduce((a, b) => a.filter(ele => b.includes(ele)))
      } else if (query.operator === 'or') {
        return [...new Set(query.query.flatMap(e => this.find(e as Predicate<TEntity>)))]
      }
      // if (q.operator === 'or') { return q.expressions.reduce((a, b) => a.concat(fetch(b, a)), o) }
      // if (q.operator === 'not') { return o.filter(x => !fetch(q.expressions[0], [x]).length) }
    }
    return []
  }

  public delete(id: TEntity['id']): void {
    this.entities.delete(id.value)
  }

  protected getFieldValue(f: Binding<TEntity>, o: TEntity) {
    if (typeof f === 'string') {
      // console.log(f, o[f])
      return o[f as string]
    }
  }
}