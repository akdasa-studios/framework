import { Aggregate, AnyIdentity } from '@lib/domain/models'
import { Query } from '@lib/persistence'


/**
 * Interface for a repository.
 */
export interface Repository<
  TEntity extends Aggregate<AnyIdentity>
> {
  /**
   * Get all entities.
   * @returns All entities.
   */
  all(): Promise<readonly TEntity[]>

  /**
   * Save entity.
   * @param entity Entity to save.
   */
  save(entity: TEntity): Promise<void>

  /**
   * Get entity by identity.
   * @param id Identity of the entity to load.
   */
  get(id: TEntity['id']): Promise<TEntity>

  /**
   * Check if entity exists.
   * @param id Identity of the entity to check.
   */
  exists(id: TEntity['id']): Promise<boolean>

  /**
   * Find entities by query.
   * @param query Query to find entities by.
   */
  find(query: Query<TEntity>): Promise<readonly TEntity[]>

  /**
   * Delete entity by identity.
   * @param id Identity of the entity to remove.
   */
  delete(id: TEntity['id']): Promise<void>
}
