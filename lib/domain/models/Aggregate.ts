import { Entity } from './Entity'
import { Identity } from './Identity'


/**
 * Aggregate is a cluster of domain objects that can be treated as a single unit.
 */
export abstract class Aggregate<
  TIdentity extends Identity<unknown, unknown>
> extends Entity<TIdentity> {
}
