import { Entity, AnyIdentity } from '@lib/domain/models'


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
enum LogicalOperators {
  And = 'and',
  Or = 'or',
  Not = 'not',
}

/**
 * Binding between Entity field and database column.
 */
export type Binding<TEntity extends Entity<AnyIdentity>> =
  keyof TEntity | ((x: TEntity) => void)

/**
 * A predicate is a comparison between a field and a value.
 */
export class Predicate<TEntity extends Entity<AnyIdentity>> {
  constructor(
    public readonly field: Binding<TEntity>,
    public readonly operator: Operators,
    public readonly value: unknown,
  ) { }
}

/**
 *
 */
export class Expression<TEntity extends Entity<AnyIdentity>> {
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

export type Query<TEntity extends Entity<AnyIdentity>> = Predicate<TEntity> | Expression<TEntity>


export class QueryBuilder<TEntity extends Entity<AnyIdentity>> {
  /* -------------------------------------------------------------------------- */
  /*                            Comparison Operators                            */
  /* -------------------------------------------------------------------------- */

  eq(field: keyof TEntity, value: unknown): Query<TEntity> {
    return new Predicate<TEntity>(field, Operators.Equal, value)
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