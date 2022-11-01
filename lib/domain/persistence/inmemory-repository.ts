import { Entity, AnyIdentity } from '@lib/domain/models'
import { IRepository, Predicate, Query, Expression, Binding } from '@lib/domain/persistence'
import { Operators, LogicalOperators } from '@lib/domain/persistence'


export abstract class InMemoryRepository<
  TEntity extends Entity<AnyIdentity>
> implements IRepository<TEntity> {
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


class InMemoryQueryProcessor<
  TEntity extends Entity<AnyIdentity>
> {
  public execute(query: Query<TEntity>, entities: TEntity[]): readonly TEntity[] {
    return query instanceof Predicate
      ? this.processPrdicate(query, entities)
      : this.processExpression(query, entities)
  }

  private processPrdicate(predicate: Predicate<TEntity>, entities: TEntity[]) : readonly TEntity[] {
    type a = {[ky: string]: (a: any, b: any) => boolean}
    const ops: a = {
      [Operators.Equal]: (a, b) => a === b,
      [Operators.GreaterThan]: (a, b) => a > b,
      [Operators.GreaterThanOrEqual]: (a, b) => a >= b,
      [Operators.LessThan]: (a, b) => a < b,
      [Operators.LessThanOrEqual]: (a, b) => a <= b,
      [Operators.In]: (a, b) => b.includes(a),
    }
    const op = ops[predicate.operator]
    return entities.filter(x => op(this.getFieldValue(predicate.field, x), predicate.value))
  }

  private processExpression(expression: Expression<TEntity>, entities: TEntity[]) : readonly TEntity[] {
    if (expression.operator === LogicalOperators.And) {
      const arrays = expression.query.map(e => this.execute(e, entities))
      return arrays.reduce((a, b) => a.filter(ele => b.includes(ele)))
    } else if (expression.operator === LogicalOperators.Or) {
      return [...new Set(expression.query.flatMap(e => this.execute(e, entities)))]
    } else if (expression.operator === LogicalOperators.Not) {
      const excluded = expression.query.flatMap(e => this.execute(e, entities))
      return entities.filter(x => !excluded.includes(x))
    }
    throw new Error(`Invalid operator '${expression.operator}'`)
  }

  private getFieldValue(f: Binding<TEntity>, o: TEntity) {
    return o[f as string]
  }
}
