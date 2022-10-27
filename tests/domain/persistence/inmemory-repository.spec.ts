import { InMemoryRepository } from '@lib/domain/persistence'
import { QueryBuilder } from '@lib/domain/persistence/query'
import { FakeEntity, FakeEntityId } from '../env'


class FakeInMemoryRepository
  extends InMemoryRepository<FakeEntity>
{ }

describe('InMemoryRepository', () => {
  let johnDoe: FakeEntity
  let alexSmith: FakeEntity
  let repository: FakeInMemoryRepository
  const q = new QueryBuilder<FakeEntity>()

  beforeEach(() => {
    johnDoe = new FakeEntity(new FakeEntityId('123'), 'John', 'Doe', 33)
    alexSmith = new FakeEntity(new FakeEntityId('1234'), 'Alex', 'Smith', 50)
    repository = new FakeInMemoryRepository()
    repository.save(johnDoe)
  })

  /* -------------------------------------------------------------------------- */
  /*                                    save                                    */
  /* -------------------------------------------------------------------------- */

  describe('.save', () => {
    it('saves entity', () => {
      expect(() => repository.exists(johnDoe.id)).toBeTruthy()
    })

    it('do not update entity until it saved', () => {
      johnDoe.firstName = 'George'
      expect(repository.get(johnDoe.id).firstName).toEqual('John')
    })

    it('updates entity if it saved', () => {
      johnDoe.firstName = 'George'
      repository.save(johnDoe)
      expect(repository.get(johnDoe.id).firstName).toEqual('George')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    get                                     */
  /* -------------------------------------------------------------------------- */

  describe('.get', () => {
    it('returns entity', () => {
      const result = repository.get(johnDoe.id)
      expect(result.equals(johnDoe)).toBeTruthy()
    })

    it('throws error if entity does not exist', () => {
      const idNotFound = new FakeEntityId('notFound')
      expect(() => repository.get(idNotFound)).toThrowError('Entity \'notFound\' not found')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   exists                                   */
  /* -------------------------------------------------------------------------- */

  describe('.exists', () => {
    it('returns true if entity exists', () => {
      expect(repository.exists(johnDoe.id)).toBeTruthy()
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
      repository.delete(johnDoe.id)
      expect(repository.exists(johnDoe.id)).toBeFalsy()
    })

    it('throws error if entity does not exist', () => {
      const idNotFound = new FakeEntityId('notFound')
      expect(() => repository.delete(idNotFound)).toThrowError('Entity \'notFound\' not found')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    find                                    */
  /* -------------------------------------------------------------------------- */

  describe('.find', () => {
    it('returns entities if found', () => {
      const query = q.eq('firstName', 'John')
      const result = repository.find(query)
      expect(result).toEqual([johnDoe])
    })

    it('returns empty array if nothing found', () => {
      const query = q.eq('firstName', 'not-found')
      const result = repository.find(query)
      expect(result).toEqual([])
    })
  })
})
