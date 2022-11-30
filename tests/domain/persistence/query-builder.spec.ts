import { Operators, QueryBuilder } from '@lib/persistence/query'
import { Order } from '../env'


describe('QueryBuilder', () => {

  const q = new QueryBuilder<Order>()

  it('should create a query', () => {
    const query = q.eq('firstName', 'John')

    expect(query).toEqual({
      field: 'firstName',
      operator: Operators.Equal,
      value: 'John',
    })
  })

  it('should create a query with multiple predicates', () => {
    const query = q.and(
      q.eq('firstName', 'John'),
      q.eq('lastName', 'Doe'),
    )

    expect(query).toEqual({
      operator: 'and',
      query: [
        {
          field: 'firstName',
          operator: Operators.Equal,
          value: 'John',
        },
        {
          field: 'lastName',
          operator: Operators.Equal,
          value: 'Doe',
        },
      ],
    })
  })

  it('should create a query with nested queries', () => {
    const query = q.and(
      q.eq('firstName', 'John'),
      q.or(
        q.eq('age', 30),
        q.eq('age', 40),
      ),
    )

    expect(query).toEqual({
      operator: 'and',
      query: [
        {
          field: 'firstName',
          operator: Operators.Equal,
          value: 'John',
        },
        {
          operator: 'or',
          query: [
            {
              field: 'age',
              operator: Operators.Equal,
              value: 30,
            },
            {
              field: 'age',
              operator: Operators.Equal,
              value: 40,
            },
          ]
        },
      ],
    })
  })
})
