<p align="center">
  <img src="https://raw.githubusercontent.com/akdasa-studios/framework/main/docs/logo.svg" height="96px"/>

  [![Tests](https://github.com/akdasa-studios/framework/actions/workflows/tests.yml/badge.svg)](https://github.com/akdasa-studios/framework/actions/workflows/tests.yml)
  [![codecov](https://codecov.io/gh/akdasa-studios/framework/branch/main/graph/badge.svg?token=OB1AZJDMY5)](https://codecov.io/gh/akdasa-studios/framework)
  [![Mutation testing badge](https://img.shields.io/endpoint?style=flat&url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fakdasa-studios%2Fframework%2Fmain)](https://dashboard.stryker-mutator.io/reports/github.com/akdasa-studios/framework/main)
</p>

_Framework_ is a simple library we use to build our application. It is based on _Domain Driven Development_ principles. The goals of that framework are to help with:
1. Create applications using domain-oriented principles.
2. Create testable and robust applications.
2. Work on every platform: mobile, desktop, and web.

# Documentation
[Read the docs](./docs/index.md). Documentation is still in progress, but you can already find some useful information. If you have any questions, feel free to ask them in issues. We will try to answer them as soon as possible.

# Show me the code!
```ts
import { UuidIdentity, Aggregate, Entity } from '@akdasa-studios/framework/domain/models'
import { QueryBuilder } from '@akdasa-studios/framework/domain/persistence'

// Identities
class OrderId extends UuidIdentity<'Order'> {}
class OrderLineId extends UuidIdentity<'OrderLine'> {}

// Entity
class OrderLine extends Entity<OrderLineId> {
  constructor(
    public readonly line: string,
    public readonly quantity: number,
    id?: OrderLineId
  ) {
    super(id || new UuidIdentity())
  }
}

// Aggregate
class Order extends Aggregate<OrderId> {
  constructor(
    public readonly lines: OrderLine[],
    public readonly price: Price,
    id?: OrderId
  ) {
    super(id || new UuidIdentity())
  }

  addLine(line: OrderLine) {
    this.lines.push(line)
  }
}

// Fetching data
const q = new QueryBuilder<Order>()

// Build queries using builder methods
const tastyDishes = q.or(
  q.eq('sku.itemName', 'Lassi'),
  q.eq('sku.itemName', 'Dosa'),
)

// Use parametric query
const moreExpensiveThan = (price: number) => q.gte('price', price)
const goldenOrders = moreExpensiveThan(1000)

// Execute query
clientRepository.find(q.and(goldenOrders, commonLastName))
```
