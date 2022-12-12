import { InMemoryRepository } from '@lib/persistence'
import { Expression, LogicalOperators } from '@lib/persistence'
import { Address, clientName, Order, OrderId } from '../../domain/env'


describe('InMemoryRepository', () => {
  let order1: Order
  let order2: Order
  let repository: InMemoryRepository<Order>

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
      expect(repository.get(order1.id).value.clientName).toEqual('John')
    })

    it('updates entity if it saved', () => {
      order1.clientName = 'George'
      repository.save(order1)
      expect(repository.get(order1.id).value.clientName).toEqual('George')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                     all                                    */
  /* -------------------------------------------------------------------------- */

  describe('.all', () => {
    it('returns all entities', () => {
      const result = repository.all()
      expect(result).toEqual([order1, order2])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    get                                     */
  /* -------------------------------------------------------------------------- */

  describe('.get', () => {
    it('returns entity', () => {
      const result = repository.get(order1.id).value
      expect(result.equals(order1)).toBeTruthy()
    })

    it('returns error if entity does not exist', () => {
      const idNotFound = new OrderId('notFound')
      const result = repository.get(idNotFound)
      expect(result.isFailure).toBeTruthy()
      expect(result.error).toEqual('Entity \'notFound\' not found')
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

    it('returns error if entity does not exist', () => {
      const idNotFound = new OrderId('notFound')
      const result = repository.delete(idNotFound)
      expect(result.isFailure).toBeTruthy()
      expect(result.error).toEqual('Entity \'notFound\' not found')
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
  })
})
