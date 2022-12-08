import { Expression, LogicalOperators, QueryBuilder } from '@lib/persistence'
import { InMemoryQueryProcessor } from '@lib/persistence/memory/InMemoryQueryProcessor'
import { address, Address, clientName, Order, OrderId, price } from '../../domain/env'


describe('InMemoryQueryProcessor', () => {
  const q = new QueryBuilder<Order>()
  const sut = new InMemoryQueryProcessor<Order>()

  const order1 = new Order(
    new OrderId('123'), 'John',
    new Address('2nd Avenue', 'New York', 'Zip'),
    100
  )
  const order2 = new Order(
    new OrderId('1234'), 'Alex',
    new Address('Liberation Bulevard', 'Belgrade', 'Zip'),
    200
  )
  const entities = [order1, order2]

  it('returns entities if found', () => {
    const result = sut.execute(clientName('John'), entities)
    expect(result).toEqual([order1])
  })

  it('returns empty array if nothing found', () => {
    const result = sut.execute(clientName('not-found'), entities)
    expect(result).toEqual([])
  })

  it('raises exception if wrong logical operator passed', () => {
    const query = new Expression<Order>(
      'wrong' as LogicalOperators, clientName('John')
    )
    expect(() => sut.execute(query, entities)).toThrowError('Invalid operator \'wrong\'')
  })

  /* ---------------------------- Value Comparison ---------------------------- */

  describe('value comparison', () => {
    it('should return object if values are equal', () => {
      const result = sut.execute(address('2nd Avenue', 'New York', 'Zip'), entities)
      expect(result).toEqual([order1])
    })

    it('should not return object if values are not equal', () => {
      const result = sut.execute(address('2nd Avenue', 'London', 'Zip'), entities)
      expect(result).toEqual([])
    })

    it('should not return object if values are of different types', () => {
      const query = q.eq('deliveryAddress', '2nd Avenue')
      const result = sut.execute(query, entities)
      expect(result).toEqual([])
    })
  })

  /* ------------------------------ Complex Query ----------------------------- */

  it('not', () => {
    const result = sut.execute(q.not(clientName('John')), entities)
    expect(result).toEqual([order2])
  })

  it('or', () => {
    const result = sut.execute(q.or(
      clientName('John'),
      clientName('Alex'),
    ), entities)
    expect(result).toEqual([order1, order2])
  })

  it('and', () => {
    const result = sut.execute(q.and(
      clientName('John'), price(100)
    ), entities)
    expect(result).toEqual([order1])
  })

  it('and (no matches)', () => {
    const result = sut.execute(q.and(
      clientName('John'), price(500),
    ), entities)
    expect(result).toEqual([])
  })

  it('gte', () => {
    const query = q.gte('price', 200)
    const result = sut.execute(query, entities)
    expect(result).toEqual([order2])
  })

  it('lte', () => {
    const query = q.lte('price', 100)
    const result = sut.execute(query, entities)
    expect(result).toEqual([order1])
  })

  it('gt', () => {
    const query = q.gt('price', 100)
    const result = sut.execute(query, entities)
    expect(result).toEqual([order2])
  })

  it('lt', () => {
    const query = q.lt('price', 200)
    const result = sut.execute(query, entities)
    expect(result).toEqual([order1])
  })
})
