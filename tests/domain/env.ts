import { Aggregate, Identity } from '@lib/domain/models'


export class FakeEntityId
  extends Identity<string, 'FakeEntity'> {
}

export class FakeEntity
  extends Aggregate<FakeEntityId>
{
  constructor(
    id: FakeEntityId,
    public firstName: string='John',
    public lastName: string='Doe',
    public age: number=33,
  ) { super(id) }
}
