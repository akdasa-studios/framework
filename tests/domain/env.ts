import { Aggregate, Entity, Identity, Value } from '@akd-studios/framework/domain/models'
import { QueryBuilder } from '@akd-studios/framework/persistence'


export class OrderId extends Identity<string, 'Order'> {}
export class OrderLineId extends Identity<string, 'OrderLine'> {}

export class OrderLine
  extends Entity<OrderLineId>
{
  constructor(
    id: OrderLineId,
    public product: string='John',
  ) { super(id) }
}

export class Address
  extends Value<'Address'> {
  constructor(
    public street: string,
    public city: string,
    public zip: string,
  ) { super() }
}

export class Order
  extends Aggregate<OrderId>
{
  constructor(
    id: OrderId,
    public clientName: string,
    public deliveryAddress: Address,
    public price: number,
    public tags: string[] = [],
  ) { super(id) }
}

const qb = new QueryBuilder<Order>()
export const clientName = (name: string) => qb.eq('clientName', name)
export const address = (street: string, city: string, zip: string,) => qb.eq('deliveryAddress', new Address(street, city, zip))
export const price = (price: number) => qb.eq('price', price)
export const expensiveThan = (price: number) => qb.gt('price', price)