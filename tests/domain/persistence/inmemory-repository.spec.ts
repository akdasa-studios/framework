import { InMemoryRepository } from '@lib/domain/persistence'
import { QueryBuilder } from '@lib/domain/persistence/query'
import { FakeEntity, FakeEntityId } from '../env'


class FakeInMemoryRepository
  extends InMemoryRepository<FakeEntity>
{ }

describe('InMemoryRepository', () => {
  let id: FakeEntityId
  let entity: FakeEntity
  let repository: FakeInMemoryRepository
  const q = new QueryBuilder<FakeEntity>()

  beforeEach(() => {
    id = new FakeEntityId('123')
    entity = new FakeEntity(id)
    repository = new FakeInMemoryRepository()
    repository.save(entity)
  })

  /* -------------------------------------------------------------------------- */
  /*                                    save                                    */
  /* -------------------------------------------------------------------------- */

  describe('.save', () => {
    it('saves entity', () => {
      expect(() => repository.exists(id)).toBeTruthy()
    })

    it('do not update entity until it saved', () => {
      entity.firstName = 'George'
      expect(repository.get(id).firstName).toEqual('John')
    })

    it('updates entity if it saved', () => {
      entity.firstName = 'George'
      repository.save(entity)
      expect(repository.get(id).firstName).toEqual('George')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    get                                     */
  /* -------------------------------------------------------------------------- */

  describe('.get', () => {
    it('returns entity', () => {
      const result = repository.get(id)
      expect(result.equals(entity)).toBeTruthy()
    })

    it('throws error if entity does not exist', () => {
      const idNotFound = new FakeEntityId('notFound')
      expect(() => repository.get(idNotFound)).toThrowError()
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   exists                                   */
  /* -------------------------------------------------------------------------- */

  describe('.exists', () => {
    it('returns true if entity exists', () => {
      expect(repository.exists(id)).toBeTruthy()
    })

    it('returns false if entity does not exist', () => {
      const idNotFound = new FakeEntityId('notFound')
      expect(repository.exists(idNotFound)).toBeFalsy()
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   delete                                   */
  /* -------------------------------------------------------------------------- */

  describe('.delete', () => {
    it('deletes entity', () => {
      repository.delete(id)
      expect(repository.exists(id)).toBeFalsy()
    })

    it('throws error if entity does not exist', () => {
      const idNotFound = new FakeEntityId('notFound')
      expect(() => repository.delete(idNotFound)).toThrowError()
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    find                                    */
  /* -------------------------------------------------------------------------- */

  describe('.find', () => {
    it('returns entities if found', () => {
      const query = q.eq('firstName', 'John')
      const result = repository.find(query)
      expect(result).toEqual([entity])
    })

    it('returns empty array if nothing found', () => {
      const query = q.eq('firstName', 'not-found')
      const result = repository.find(query)
      expect(result).toEqual([])
    })
  })
})
