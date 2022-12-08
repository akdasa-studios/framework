import { Aggregate, Entity, Identity, Value } from '@lib/domain/models'


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
    public firstName: string,
    public lastName: string,
    public deliveryAddress: Address,
    public price: number,
  ) { super(id) }
}
