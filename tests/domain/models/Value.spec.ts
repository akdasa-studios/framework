import { Value } from '@akd-studios/framework/domain/models'


class Name extends Value<'Name'> {
  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
  ) { super() }
}

describe('Value', () => {

  /* -------------------------------------------------------------------------- */
  /*                                   equals                                   */
  /* -------------------------------------------------------------------------- */

  describe('.equals()', () => {
    it('returns true when objects are equal', () => {
      const entity1 = new Name('Advaita Krishna', 'Dasa')
      const entity2 = new Name('Advaita Krishna', 'Dasa')
      expect(entity1.equals(entity2)).toBeTruthy()
    })

    it('returns false when objects are not equal', () => {
      const entity1 = new Name('Tulasi', 'Dasa')
      const entity2 = new Name('Krishna', 'das')
      expect(entity1.equals(entity2)).toBeFalsy()
    })

    it('returns false when objects are not equal partially', () => {
      const entity1 = new Name('Tulasi', 'Dasa')
      const entity2 = new Name('Tulasi', 'dasa')
      expect(entity1.equals(entity2)).toBeFalsy()
    })
  })
})
