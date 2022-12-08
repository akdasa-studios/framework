import { InMemoryRepository } from '@lib/persistence'
import { Expression, LogicalOperators, QueryBuilder } from '@lib/persistence'
import { address, Address, clientName, Order, OrderId, price } from '../domain/env'


describe('InMemoryRepository', () => {
  let order1: Order
  let order2: Order
  let repository: InMemoryRepository<Order>
  const q = new QueryBuilder<Order>()

  beforeEach(() => {
    order1 = new Order(
      new OrderId('123'), 'John',
      new Address('2nd Avenue', 'New York', 'Zip'),
      100
    )
    order2 = new Order(
      new OrderId('1234'), 'Alex',
      new Address('Liberation Bulevard', 'Belgrade', 'Zip'),
      200
    )
    repository = new InMemoryRepository<Order>()
    repository.save(order1)
    repository.save(order2)
  })

  /* -------------------------------------------------------------------------- */
  /*                                    save                                    */
  /* -------------------------------------------------------------------------- */

  describe('.save', () => {
    it('saves entity', () => {
      expect(() => repository.exists(order1.id)).toBeTruthy()
    })

    it('do not update entity until it saved', () => {
      order1.clientName = 'George'
      expect(repository.get(order1.id).clientName).toEqual('John')
    })

    it('updates entity if it saved', () => {
      order1.clientName = 'George'
      repository.save(order1)
      expect(repository.get(order1.id).clientName).toEqual('George')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    get                                     */
  /* -------------------------------------------------------------------------- */

  describe('.get', () => {
    it('returns entity', () => {
      const result = repository.get(order1.id)
      expect(result.equals(order1)).toBeTruthy()
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
      expect(repository.exists(order1.id)).toBeTruthy()
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
      repository.delete(order1.id)
      expect(repository.exists(order1.id)).toBeFalsy()
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
      const result = repository.find(clientName('John'))
      expect(result).toEqual([order1])
    })

    it('returns empty array if nothing found', () => {
      const result = repository.find(clientName('not-found'))
      expect(result).toEqual([])
    })

    it('raises exception if wrong logical operator passed', () => {
      const query = new Expression<Order>(
        'wrong' as LogicalOperators, clientName('John')
      )
      expect(() => repository.find(query)).toThrowError('Invalid operator \'wrong\'')
    })

    /* ---------------------------- Value Comparison ---------------------------- */

    describe('value comparison', () => {
      it('should return object if values are equal', () => {
        const result = repository.find(address('2nd Avenue', 'New York', 'Zip'))
        expect(result).toEqual([order1])
      })

      it('should not return object if values are not equal', () => {
        const result = repository.find(address('2nd Avenue', 'London', 'Zip'))
        expect(result).toEqual([])
      })

      it('should not return object if values are of different types', () => {
        const query = q.eq('deliveryAddress', 'somethingStange')
        const result = repository.find(query)
        expect(result).toEqual([])
      })
    })

    /* ------------------------------ Complex Query ----------------------------- */

    describe('complex query', () => {
      it('not', () => {
        const result = repository.find(q.not(clientName('John')))
        expect(result).toEqual([order2])
      })

      it('or', () => {
        const result = repository.find(q.or(
          clientName('John'),
          clientName('Alex'),
        ))
        expect(result).toEqual([order1, order2])
      })

      it('and', () => {
        const query = q.and(
          clientName('John'),
          q.eq('price', 100),
        )
        const result = repository.find(query)
        expect(result).toEqual([order1])
      })

      it('and 2', () => {
        const result = repository.find(q.and(
          clientName('John'),
          price(500),
        ))
        expect(result).toEqual([])
      })

      it('gte', () => {
        const query = q.gte('price', 200)
        const result = repository.find(query)
        expect(result).toEqual([order2])
      })

      it('lte', () => {
        const query = q.lte('price', 100)
        const result = repository.find(query)
        expect(result).toEqual([order1])
      })

      it('gt', () => {
        const query = q.gt('price', 100)
        const result = repository.find(query)
        expect(result).toEqual([order2])
      })

      it('lt', () => {
        const query = q.lt('price', 200)
        const result = repository.find(query)
        expect(result).toEqual([order1])
      })
    })
  })
})
