import { Result } from '@akd-studios/framework/core'

describe('Result', () => {

  /* -------------------------------------------------------------------------- */
  /*                                     ok                                     */
  /* -------------------------------------------------------------------------- */

  describe('.ok()', () => {
    it('should create a new result indicating a success with the specified payload', () => {
      const result = Result.ok('success')
      expect(result.isSuccess).toBe(true)
      expect(result.isFailure).toBe(false)
      expect(result.value).toBe('success')
    })

    it('should create a new result indicating a success with no payload', () => {
      const result = Result.ok()
      expect(result.isSuccess).toBe(true)
      expect(result.isFailure).toBe(false)
      expect(result.value).toBeUndefined()
    })
  })


  /* -------------------------------------------------------------------------- */
  /*                                    fail                                    */
  /* -------------------------------------------------------------------------- */

  describe('.fail()', () => {
    it('should create a new result indicating a failure with the specified payload', () => {
      const result = Result.fail('failure')
      expect(result.isSuccess).toBe(false)
      expect(result.isFailure).toBe(true)
      expect(result.error).toBe('failure')
    })

    it('should create a new result indicating a failure with no payload', () => {
      const result = Result.fail()
      expect(result.isSuccess).toBe(false)
      expect(result.isFailure).toBe(true)
      expect(result.error).toBeUndefined()
    })
  })
})