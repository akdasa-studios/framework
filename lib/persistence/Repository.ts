import { Aggregate, type AnyIdentity } from '../domain/models'
import { type Query } from '../persistence'

export interface ResultSetSlice {
  start: number
  count: number
}

/**
 * Result set.
 */
export class ResultSet<TEntity extends Aggregate<AnyIdentity>> {
  /**
   * Initialize result set.
   * @param entities Entities.
   * @param bookmark Bookmark.
   */
  constructor(
    public readonly entities: readonly TEntity[],
    public readonly slice: ResultSetSlice,
  ) { }
}

/**
 * Query options.
 */
export interface QueryOptions {
  /**
   * Maximum number of entities to return.
   */
  limit?: number

  /**
   * Number of entities to skip.
   */
  skip?: number

  /**
   * Bookmark to start the query from.
   */
  bookmark?: string
}

/**
 * Interface for a repository.
 */
export interface Repository<
  TAggregate extends Aggregate<AnyIdentity>
> {
  /**
   * Get all entities.
   * @returns All entities.
   */
  all(
    options?: QueryOptions,
  ): Promise<ResultSet<TAggregate>>

  /**
   * Save entity.
   * @param entity Entity to save.
   */
  save(entity: TAggregate): Promise<void>

  /**
   * Get entity by identity.
   * @param id Identity of the entity to load.
   */
  get(id: TAggregate['id']): Promise<TAggregate>

  /**
   * Check if entity exists.
   * @param id Identity of the entity to check.
   */
  exists(id: TAggregate['id']): Promise<boolean>

  /**
   * Find entities by query.
   * @param query Query to find entities by.
   * @param options Query options.
   */
  find(
    query: Query<TAggregate>,
    options?: QueryOptions,
  ): Promise<ResultSet<TAggregate>>

  /**
   * Delete entity by identity.
   * @param id Identity of the entity to remove.
   */
  delete(id: TAggregate['id']): Promise<void>
}
