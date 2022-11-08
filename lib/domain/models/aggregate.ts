import { Identity } from './identity'

/**
 * Aggregate is a cluster of domain objects that can be treated as a single unit.
 */
export abstract class Aggregate<
  TIdentity extends Identity<unknown, unknown>
> {
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
  equals(other: Aggregate<TIdentity>): boolean {
    return this._identity.equals(other.id)
  }
}
