import { Aggregate, AnyIdentity } from '@lib/domain/models'


/**
 * Comparison operators. These are used to compare a field with a value.
 */
export enum Operators {
  Equal = 'eq',
  GreaterThan = 'gt',
  GreaterThanOrEqual = 'gte',
  LessThan = 'lt',
  LessThanOrEqual = 'lte',
  In = 'in',
}

/**
 * Logical operators. These are used to combine multiple predicates.
 */
export enum LogicalOperators {
  And = 'and',
  Or = 'or',
  Not = 'not',
}

/**
 * Binding between Entity field and database column.
 */
export type Binding<TEntity extends Aggregate<AnyIdentity>> =
  keyof TEntity // todo: | ((x: TEntity) => void)

/**
 * A predicate is a comparison between a field and a value.
 */
export class Predicate<TEntity extends Aggregate<AnyIdentity>> {
  constructor(
    public readonly field: Binding<TEntity>,
    public readonly operator: Operators,
    public readonly value: unknown,
  ) { }
}

/**
 *
 */
export class Expression<TEntity extends Aggregate<AnyIdentity>> {
  public operator: LogicalOperators
  public query: Query<TEntity>[]

  constructor(
    operator: LogicalOperators,
    ...query: Query<TEntity>[]
  ) {
    this.operator = operator
    this.query = query
  }
}

export type Query<TEntity extends Aggregate<AnyIdentity>> = Predicate<TEntity> | Expression<TEntity>


export class QueryBuilder<TEntity extends Aggregate<AnyIdentity>> {

  /* -------------------------------------------------------------------------- */
  /*                            Comparison Operators                            */
  /* -------------------------------------------------------------------------- */

  op(field: keyof TEntity, operator: Operators, value: unknown): Query<TEntity> {
    return new Predicate<TEntity>(field, operator, value)
  }

  eq(field: keyof TEntity, value: unknown): Query<TEntity> {
    return this.op(field, Operators.Equal, value)
  }

  gte(field: keyof TEntity, value: unknown): Query<TEntity> {
    return this.op(field, Operators.GreaterThanOrEqual, value)
  }

  gt(field: keyof TEntity, value: unknown): Query<TEntity> {
    return this.op(field, Operators.GreaterThan, value)
  }

  lte(field: keyof TEntity, value: unknown): Query<TEntity> {
    return this.op(field, Operators.LessThanOrEqual, value)
  }

  lt(field: keyof TEntity, value: unknown): Query<TEntity> {
    return this.op(field, Operators.LessThan, value)
  }

  /* -------------------------------------------------------------------------- */
  /*                              Logical Operators                             */
  /* -------------------------------------------------------------------------- */

  and(...query: Query<TEntity>[]): Query<TEntity> {
    return new Expression<TEntity>(LogicalOperators.And, ...query)
  }
  or(...query: Query<TEntity>[]): Query<TEntity> {
    return new Expression<TEntity>(LogicalOperators.Or, ...query)
  }
  not(...query: Query<TEntity>[]): Query<TEntity> {
    return new Expression<TEntity>(LogicalOperators.Not, ...query)
  }
}