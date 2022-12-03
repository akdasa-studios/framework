import { Identity } from '@lib/domain/models'


describe('Identity', () => {

  /* -------------------------------------------------------------------------- */
  /*                                 constructor                                */
  /* -------------------------------------------------------------------------- */

  describe('constructor', () => {
    it('uses passed id', () => {
      const identity = new Identity<string, 'string'>('123')
      expect(identity.value).toBe('123')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   equals                                   */
  /* -------------------------------------------------------------------------- */

  describe('.equals()', () => {
    it('returns true when the id is equal to the other id', () => {
      const id1 = new Identity<string, 'string'>('123')
      const id2 = new Identity<string, 'string'>('123')
      expect(id1.equals(id2)).toBeTruthy()
    })

    it('returns false when the id is not equal to the other id', () => {
      const id1 = new Identity<string, 'string'>('123')
      const id2 = new Identity<string, 'string'>('456')
      expect(id1.equals(id2)).toBeFalsy()
    })
  })
})
