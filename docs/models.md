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

We can also create several types of identifiers. This will help us avoid comparison/assignment of identifiers of different types. For example, we can create a _ClientId_ and _OrderId_:

```js
class ClientId extends Identity<string, 'Client'> {}
class OrderId extends Identity<string, 'Order'> {}

var client1Id = new ClientId('1')
var order1Id = new OrderId('1')

if (client1Id.equals(order1Id)) {
  // compilation error
}
```


# Value Object
Value Object is an object that contains some data and does not have an identity. It is used to describe some value, for example, the price of the product. The value object is immutable. It means that the value object cannot be changed after creation. If you need to change the value, you need to create a new value object.

```js
class Name extends Value<'Name'> {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
  ) { super() }

  isNamesake(other: Name) : boolean {
    return this.firstName === other.firstName
  }
}

const name1 = new Name('Tulasi', 'Dasa')
const name2 = new Name('Krishna', 'Dasa')
name1.equals(name2)  // false
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
