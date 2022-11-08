import { OrderLineId, OrderLine } from '../env'


describe('Entity', () => {

  /* -------------------------------------------------------------------------- */
  /*                                  identity                                  */
  /* -------------------------------------------------------------------------- */

  describe('.id', () => {
    it('returns the identity', () => {
      const entity = new OrderLine(new OrderLineId('123'))
      expect(entity.id.value).toBe('123')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                   equals                                   */
  /* -------------------------------------------------------------------------- */

  describe('.equals()', () => {
    it('returns true when the id is equal to the other id', () => {
      const entity1 = new OrderLine(new OrderLineId('123'))
      const entity2 = new OrderLine(new OrderLineId('123'))
      expect(entity1.equals(entity2)).toBeTruthy()
    })

    it('returns false when the id is not equal to the other id', () => {
      const entity1 = new OrderLine(new OrderLineId('123'))
      const entity2 = new OrderLine(new OrderLineId('456'))
      expect(entity1.equals(entity2)).toBeFalsy()
    })
  })
})
