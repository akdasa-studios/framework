# Identity
Each _Entity_ has its _Identity_. If the identities are equal, then the objects are equal.

```js
type ClientId = Identity<string, 'Customer'>

var client1Id = ClientId('1')
var client2Id = ClientId('2')

if (client1Id.equals(client2Id)) {
  // ...
}
```

We can also create several types of identifiers. This will help us avoid comparison/assignment of identifiers of different types.

```js
class ClientId extends Identity<string, 'Client'> {}
class OrderId extends Identity<string, 'Order'> {}

var client1Id = new ClientId('1')
var order1Id = new OrderId('1')

if (client1Id.equals(order1Id)) {
  // compilation error
}
```

# Entity
_Entity_ is a class that has an _Identity_.

```js
class ClientId extends Identity<string, 'Client'> {}

class Client extends Entity<ClientId> {
  constructor(id: ClientId) {
    super(id)
  }
}
```
