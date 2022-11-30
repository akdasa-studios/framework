import { InMemoryRepository } from '@lib/persistence'
import { Expression, LogicalOperators, QueryBuilder } from '@lib/persistence/query'
import { Order, OrderId } from '../env'


class FakeInMemoryRepository
  extends InMemoryRepository<Order>
{ }

describe('InMemoryRepository', () => {
  let johnDoe: Order
  let alexSmith: Order
  let repository: FakeInMemoryRepository
  const q = new QueryBuilder<Order>()

  beforeEach(() => {
    johnDoe = new Order(new OrderId('123'), 'John', 'Doe', 33)
    alexSmith = new Order(new OrderId('1234'), 'Alex', 'Smith', 50)
    repository = new FakeInMemoryRepository()
    repository.save(johnDoe)
    repository.save(alexSmith)
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
      const idNotFound = new OrderId('notFound')
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
      const idNotFound = new OrderId('notFound')
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
      const idNotFound = new OrderId('notFound')
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

    it('raises exception if wrong logical operator passed', () => {
      const query = new Expression<Order>(
        'wrong' as LogicalOperators, q.eq('firstName', 'John')
      )
      expect(() => repository.find(query)).toThrowError('Invalid operator \'wrong\'')
    })

    describe('complex query', () => {
      it('not', () => {
        const query = q.not(
          q.eq('firstName', 'John'),
        )
        const result = repository.find(query)
        expect(result).toEqual([alexSmith])
      })

      it('or', () => {
        const query = q.or(
          q.eq('firstName', 'John'),
          q.eq('firstName', 'Alex'),
        )
        const result = repository.find(query)
        expect(result).toEqual([johnDoe, alexSmith])
      })

      it('and', () => {
        const query = q.and(
          q.eq('firstName', 'John'),
          q.eq('age', 33),
        )
        const result = repository.find(query)
        expect(result).toEqual([johnDoe])
      })

      it('and 2', () => {
        const query = q.and(
          q.eq('firstName', 'John'),
          q.eq('age', 55),
        )
        const result = repository.find(query)
        expect(result).toEqual([])
      })

      it('gte', () => {
        const query = q.gte('age', 50)
        const result = repository.find(query)
        expect(result).toEqual([alexSmith])
      })

      it('lte', () => {
        const query = q.lte('age', 33)
        const result = repository.find(query)
        expect(result).toEqual([johnDoe])
      })

      it('gt', () => {
        const query = q.gt('age', 33)
        const result = repository.find(query)
        expect(result).toEqual([alexSmith])
      })

      it('lt', () => {
        const query = q.lt('age', 50)
        const result = repository.find(query)
        expect(result).toEqual([johnDoe])
      })
    })
  })
})
