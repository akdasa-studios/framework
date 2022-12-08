import { Aggregate, AnyIdentity, Value } from '@lib/domain/models'
import { Binding, Expression, LogicalOperators, Operators, Predicate, Query } from '../Query'

export class InMemoryQueryProcessor<
  TEntity extends Aggregate<AnyIdentity>
> {
  /**
   * Executes query against entities
   * @param query Query to execute
   * @param entities Entities to execute query against
   * @returns Entities that match query
   */
  public execute(
    query: Query<TEntity>,
    entities: TEntity[]
  ): readonly TEntity[] {
    return query instanceof Predicate
      ? this.processPrdicate(query, entities)
      : this.processExpression(query, entities)
  }

  /**
   * Processes predicate against entities
   * @param predicate Predicate to process
   * @param entities Entities to process predicate against
   * @returns Entities that match predicate
   */
  private processPrdicate(
    predicate: Predicate<TEntity>,
    entities: TEntity[]
  ): readonly TEntity[] {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    type a = { [ky: string]: (a: any, b: any) => boolean; };
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
    return entities.filter(x => op(
      this.getFieldValue(predicate.field, x), predicate.value
    ))
  }

  /**
   * Processes expression against entities
   * @param expression Expression to process
   * @param entities Entities to process expression against
   * @returns Entities that match expression
   */
  private processExpression(
    expression: Expression<TEntity>,
    entities: TEntity[]
  ): readonly TEntity[] {
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
