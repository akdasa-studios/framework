import { Entity, Identity } from '@akd-studios/framework/domain'


/**
 * Aggregate is a cluster of domain objects that can be treated as a single unit.
 */
export abstract class Aggregate<
  TIdentity extends Identity<unknown, unknown>
> extends Entity<TIdentity> {
}
