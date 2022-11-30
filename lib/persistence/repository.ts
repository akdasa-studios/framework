import { AnyIdentity, Aggregate } from '@lib/domain/models'
import { Query } from '@lib/persistence'


/**
 * Interface for a repository.
 */
export interface IRepository<
  TEntity extends Aggregate<AnyIdentity>
> {
  /**
   * Save entity.
   * @param entity Entity to save.
   */
  save(entity: TEntity): void

  /**
   * Get entity by identity.
   * @param id Identity of the entity to load.
   * @throws Error if entity does not exist.
   */
  get(id: TEntity['id']): TEntity

  /**
   * Check if entity exists.
   * @param id Identity of the entity to check.
   */
  exists(id: TEntity['id']): boolean

  /**
   * Find entities by query.
   * @param query Query to find entities by.
   */
  find(query: Query<TEntity>): readonly TEntity[]

  /**
   * Delete entity by identity.
   * @param id Identity of the entity to remove.
   * @throws Error if entity does not exist.
   */
  delete(id: TEntity['id']): void
}
