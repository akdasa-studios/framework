import { Event } from '@akd-studios/framework/core'

describe('Event', () => {

  describe('.subscribe()', () => {
    it('raises an error if the handler already added', () => {
      const event = new Event<string>()
      const handler = jest.fn()
      event.subscribe(handler)
      expect(() => event.subscribe(handler)).toThrowError('Handler already added')
    })

    it('should add a handler to the list of handlers', () => {
      const event = new Event<string>()
      const handler = jest.fn()
      event.subscribe(handler)
      event.notify('string')
      expect(handler).toHaveBeenCalledWith('string')
    })
  })

  describe('.unsubscribe()', () => {
    it('raises an error if the handler is not added', () => {
      const event = new Event<string>()
      const handler = jest.fn()
      expect(() => event.unsubscribe(handler)).toThrowError('Handler not found')
    })

    it('removes a handler from the list of handlers', () => {
      const event = new Event<string>()
      const handler = jest.fn()
      event.subscribe(handler)
      event.unsubscribe(handler)
      event.notify('string')
      expect(handler).not.toHaveBeenCalled()
    })
  })

  describe('.notify()', () => {
    it('calls all handlers', () => {
      const event = new Event<string>()
      const handler1 = jest.fn()
      const handler2 = jest.fn()
      event.subscribe(handler1)
      event.subscribe(handler2)
      event.notify('string')
      expect(handler1).toHaveBeenCalledWith('string')
      expect(handler2).toHaveBeenCalledWith('string')
    })
  })

})