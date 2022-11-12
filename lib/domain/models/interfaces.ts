import { Identity } from './identity'


/**
 * IIdentifiable is an interface for all objects that have an identity.
 */
export interface IIdentifiable<
  TIdentity extends Identity<unknown, unknown>
> {
  get id(): TIdentity
}

/**
 * IEqualable is an interface for all objects that can be compared for equality.
 */
export interface IEqualable<T> {
  equals(other: T): boolean
}
