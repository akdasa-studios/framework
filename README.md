<p align="center">
  <img src="https://raw.githubusercontent.com/akdasa-studios/framework/main/docs/logo.svg" height="128px"/>

<p align="center">
  <a href="https://github.com/akdasa-studios/framework/actions/workflows/tests.yml"><img src="https://github.com/akdasa-studios/framework/actions/workflows/tests.yml/badge.svg" alt="Tests"></a>
  <a href="https://codecov.io/gh/akdasa-studios/framework"><img src="https://codecov.io/gh/akdasa-studios/framework/branch/main/graph/badge.svg?token=OB1AZJDMY5" alt="codecov"></a>
  <a href="https://dashboard.stryker-mutator.io/reports/github.com/akdasa-studios/framework/main"><img src="https://img.shields.io/endpoint?style=flat&amp;url=https%3A%2F%2Fbadge-api.stryker-mutator.io%2Fgithub.com%2Fakdasa-studios%2Fframework%2Fmain" alt="Mutation testing badge"></a>
  <a href="https://www.codacy.com/gh/akdasa-studios/framework/dashboard?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=akdasa-studios/framework&amp;utm_campaign=Badge_Grade"><img src="https://app.codacy.com/project/badge/Grade/a2f433a5afe841ca8bda8e6025ee4929" alt="Codacy Badge"></a>
</p>

_Framework_ is a simple library we use to build our application. It is based on _Domain Driven Development_ principles. The goals of that framework are to help with:

  1. Create applications using domain-oriented principles.
  2. Create testable and robust applications.
  3. Work on every platform: mobile, desktop, and web.

# Documentation
[Read the docs](./docs/index.md). Documentation is still in progress, but you can already find some useful information. If you have any questions, feel free to ask them in issues. We will try to answer them as soon as possible.

## Development
  1. `npm run test` - Run all tests
  2. `npm run test:unit` - Run unit tests
  3. `npm run test:mutational` - Run mutational tests

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
