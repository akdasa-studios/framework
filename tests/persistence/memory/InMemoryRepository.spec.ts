import { InMemoryRepository } from '@lib/persistence'
import { Expression, LogicalOperators } from '@lib/persistence'
import { Address, clientName, Order, OrderId } from '../../domain/env'


describe('InMemoryRepository', () => {
  let order1: Order
  let order2: Order
  let repository: InMemoryRepository<Order>

  beforeEach(async () => {
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
    await repository.save(order1)
    await repository.save(order2)
  })

  /* -------------------------------------------------------------------------- */
  /*                                    save                                    */
  /* -------------------------------------------------------------------------- */

  describe('.save', () => {
    it('saves entity', async () => {
      expect(await repository.exists(order1.id)).toBeTruthy()
    })

    it('do not update entity until it saved', async () => {
      order1.clientName = 'George'
      const getResult = await repository.get(order1.id)
      expect(getResult.clientName).toEqual('John')
    })

    it('updates entity if it saved', async () => {
      order1.clientName = 'George'
      await repository.save(order1)
      const getResult = await repository.get(order1.id)
      expect(getResult.clientName).toEqual('George')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                     all                                    */
  /* -------------------------------------------------------------------------- */

  describe('.all', () => {
    it('returns all entities', async () => {
      const result = await repository.all()
      expect(result).toEqual([order1, order2])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    get                                     */
  /* -------------------------------------------------------------------------- */

  describe('.get', () => {
    it('returns entity', async () => {
      const result = await repository.get(order1.id)
      expect(result.equals(order1)).toBeTruthy()
    })

    it('returns error if entity does not exist', async () => {
      const idNotFound = new OrderId('notFound')
      const result = () => repository.get(idNotFound)
      await expect(result).rejects.toThrowError('Entity \'notFound\' not found')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   exists                                   */
  /* -------------------------------------------------------------------------- */

  describe('.exists', () => {
    it('returns true if entity exists', async () => {
      expect(await repository.exists(order1.id)).toBeTruthy()
    })

    it('returns false if entity does not exist', async () => {
      const idNotFound = new OrderId('notFound')
      expect(await repository.exists(idNotFound)).toBeFalsy()
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   delete                                   */
  /* -------------------------------------------------------------------------- */

  describe('.delete', () => {
    it('deletes entity', async () => {
      await repository.delete(order1.id)
      expect(await repository.exists(order1.id)).toBeFalsy()
    })

    it('returns error if entity does not exist', async () => {
      const idNotFound = new OrderId('notFound')
      const result = () => repository.delete(idNotFound)
      await expect(result).rejects.toThrowError('Entity \'notFound\' not found')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                    find                                    */
  /* -------------------------------------------------------------------------- */

  describe('.find', () => {
    it('returns entities if found', async () => {
      const result = await repository.find(clientName('John'))
      expect(result).toEqual([order1])
    })

    it('returns empty array if nothing found', async () => {
      const result = await repository.find(clientName('not-found'))
      expect(result).toEqual([])
    })

    it('raises exception if wrong logical operator passed', async () => {
      const query = new Expression<Order>(
        'wrong' as LogicalOperators, clientName('John')
      )
      await expect(() => repository.find(query)).rejects.toThrowError('Invalid operator \'wrong\'')
    })
  })
})
