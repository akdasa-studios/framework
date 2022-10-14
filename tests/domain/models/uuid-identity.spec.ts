import { UuidIdentity } from '@lib/domain/models'

describe('UuidIdentity', () => {

  /* -------------------------------------------------------------------------- */
  /*                                 constructor                                */
  /* -------------------------------------------------------------------------- */

  describe('constructor', () => {
    it('uses passed id', () => {
      const identity = new UuidIdentity('e81c6c1b-d80e-43b4-838c-0451f9027fdc')
      expect(identity.value).toBe('e81c6c1b-d80e-43b4-838c-0451f9027fdc')
    })

    it('throws xception if incorrect uuid passed', () => {
      expect(() => new UuidIdentity('123')).toThrowError('123 is not valid UUID')
    })
  })
})
