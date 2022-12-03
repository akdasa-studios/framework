import { Identity } from './Identity'
import { Equalable, Identifiable } from './Interfaces'


/**
 * Base class for all entities.
 */
export abstract class Entity<
  TIdentity extends Identity<unknown, unknown>
> implements
  Identifiable<TIdentity>,
  Equalable<Entity<TIdentity>>
{
  private _identity: TIdentity

  /**
   * Initializes the new instance of the Entity class
   * @param identity Identity of the Entity
   */
  constructor(identity: TIdentity) {
    this._identity = identity
  }

  /**
   * Gets the value of the Identity
   */
  get id(): TIdentity {
    return this._identity
  }

  /**
   * Compares the Entity to another Entity
   * @param other Entity to compare to
   * @returns True if the Entity is equal to the other Entity
   */
  equals(other: Entity<TIdentity>): boolean {
    return this._identity.equals(other.id)
  }
}
