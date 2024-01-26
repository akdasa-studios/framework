import { UuidIdentity } from '@akd-studios/framework/domain/models'

describe('UuidIdentity', () => {

  /* -------------------------------------------------------------------------- */
  /*                                 constructor                                */
  /* -------------------------------------------------------------------------- */

  describe('constructor', () => {
    it('uses passed id', () => {
      const identity = new UuidIdentity('e81c6c1b-d80e-43b4-838c-0451f9027fdc')
      expect(identity.value).toBe('e81c6c1b-d80e-43b4-838c-0451f9027fdc')
    })

    it('generates new uuid if no value passes', () => {
      const identity = new UuidIdentity()
      expect(identity.value).not.toBeUndefined()
      expect(identity.value).not.toEqual('00000000-0000-0000-0000-000000000000')

    })

    it('throws exception if incorrect uuid passed', () => {
      expect(() => new UuidIdentity('123')).toThrowError('123 is not valid UUID')
    })
  })
})
