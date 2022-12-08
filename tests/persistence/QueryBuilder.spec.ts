import { Operators, QueryBuilder } from '@lib/persistence'
import { Order } from '../domain/env'


describe('QueryBuilder', () => {

  const q = new QueryBuilder<Order>()

  it('should create a query', () => {
    const query = q.eq('clientName', 'John')

    expect(query).toEqual({
      field: 'clientName',
      operator: Operators.Equal,
      value: 'John',
    })
  })

  it('should create a query with multiple predicates', () => {
    const query = q.and(
      q.eq('clientName', 'John'),
      q.eq('price', 100),
    )

    expect(query).toEqual({
      operator: 'and',
      query: [
        {
          field: 'clientName',
          operator: Operators.Equal,
          value: 'John',
        },
        {
          field: 'price',
          operator: Operators.Equal,
          value: 100,
        },
      ],
    })
  })

  it('should create a query with nested queries', () => {
    const query = q.and(
      q.eq('clientName', 'John'),
      q.or(
        q.eq('price', 30),
        q.eq('price', 40),
      ),
    )

    expect(query).toEqual({
      operator: 'and',
      query: [
        {
          field: 'clientName',
          operator: Operators.Equal,
          value: 'John',
        },
        {
          operator: 'or',
          query: [
            {
              field: 'price',
              operator: Operators.Equal,
              value: 30,
            },
            {
              field: 'price',
              operator: Operators.Equal,
              value: 40,
            },
          ]
        },
      ],
    })
  })
})
