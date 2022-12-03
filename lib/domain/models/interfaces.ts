import { Identity } from './identity'


/**
 * Identifiable is an interface for all objects that have an identity.
 */
export interface Identifiable<
  TIdentity extends Identity<unknown, unknown>
> {
  get id(): TIdentity
}

/**
 * Equalable is an interface for all objects that can be compared for equality.
 */
export interface Equalable<T> {
  equals(other: T): boolean
}
