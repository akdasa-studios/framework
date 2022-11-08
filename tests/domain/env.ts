import { Aggregate, Entity, Identity } from '@lib/domain/models'


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

export class Order
  extends Aggregate<OrderId>
{
  constructor(
    id: OrderId,
    public firstName: string='John',
    public lastName: string='Doe',
    public age: number=33,
  ) { super(id) }
}
