import { InMemoryRepository } from '@lib/persistence'
import { Expression, LogicalOperators } from '@lib/persistence'
import { Address, clientName, expensiveThan, Order, OrderId } from '../../domain/env'


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
      expect(result.entities).toEqual([order1, order2])
    })

    it('skip', async () => {
      const result = await repository.all({ skip: 1})
      expect(result.entities).toEqual([order2])
    })

    it('limit', async () => {
      const result = await repository.all({ limit: 1})
      expect(result.entities).toEqual([order1])
    })

    it('skip and limit', async () => {
      const result = await repository.all({ skip: 1, limit: 1})
      expect(result.entities).toEqual([order2])
    })

    it('skip to much', async () => {
      const result = await repository.all({ skip: 2})
      expect(result.entities).toEqual([])
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
      expect(result.entities).toEqual([order1])
    })

    /**
     * Second page should return empty array because there is only one entity with
     * client name 'John' and we already fetched it in the "arrange" section.
     */
    it('skip', async () => {
      // arrange:
      const query = clientName('John')
      let result = await repository.find(query)

      // act:
      result = await repository.find(query, { skip: result.slice.count })

      // assert:
      expect(result.entities).toEqual([])
    })

    it('returns empty array if nothing found', async () => {
      const result = await repository.find(clientName('not-found'))
      expect(result.entities).toEqual([])
    })

    it('raises exception if wrong logical operator passed', async () => {
      const query = new Expression<Order>(
        'wrong' as LogicalOperators, clientName('John')
      )
      await expect(() => repository.find(query)).rejects.toThrowError('Invalid operator \'wrong\'')
    })
  })
})
