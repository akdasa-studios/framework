import { Aggregate, AnyIdentity, Value } from '@lib/domain/models'
import { Repository } from './Repository'
import { Predicate, Query, Expression, Binding, Operators, LogicalOperators } from './Query'


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


class InMemoryQueryProcessor<
  TEntity extends Aggregate<AnyIdentity>
> {
  public execute(query: Query<TEntity>, entities: TEntity[]): readonly TEntity[] {
    return query instanceof Predicate
      ? this.processPrdicate(query, entities)
      : this.processExpression(query, entities)
  }

  private processPrdicate(predicate: Predicate<TEntity>, entities: TEntity[]) : readonly TEntity[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type a = {[ky: string]: (a: any, b: any) => boolean}
    const ops: a = {
      [Operators.Equal]: (a, b) => {
        // if (a instanceof Date && b instanceof Date) {
        //   return a.getTime() === b.getTime()
        // }
        // if (a instanceof Array && b instanceof Array) {
        //   return a.every((x, i) => x === b[i])
        // }
        // if (a instanceof Object && b instanceof Object) {
        //   return Object.keys(a).every(k => a[k] === b[k])
        // }
        // if (a instanceof Map && b instanceof Map) {
        //   return Array.from(a.keys()).every(k => a.get(k) === b.get(k))
        // }
        // if (a instanceof Set && b instanceof Set) {
        //   return Array.from(a).every(x => b.has(x))
        // }
        // if (a instanceof String && b instanceof String) {
        //   return a.valueOf() === b.valueOf()
        // }
        // if (a instanceof Number && b instanceof Number) {
        //   return a.valueOf() === b.valueOf()
        // }
        // Stryker disable next-line all
        if (a instanceof Value && b instanceof Value) {
          return a.equals(b)
        }

        return a === b
      },
      [Operators.GreaterThan]: (a, b) => a > b,
      [Operators.GreaterThanOrEqual]: (a, b) => a >= b,
      [Operators.LessThan]: (a, b) => a < b,
      [Operators.LessThanOrEqual]: (a, b) => a <= b,
      // [Operators.In]: (a, b) => b.includes(a),
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
