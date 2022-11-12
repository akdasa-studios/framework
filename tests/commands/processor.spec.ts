import { Processor, ICommand } from '@lib/commands'


class CalculatorContext {
  public value = 0
}

class AddCommand implements ICommand<CalculatorContext, number> {
  execute(context: CalculatorContext): number { return ++context.value }
  revert(context: CalculatorContext): number { return context.value-- }
}


describe('Processor', () => {
  let context: CalculatorContext
  let processor: Processor

  beforeEach(() => {
    context = new CalculatorContext()
    processor = new Processor(context)
  })

  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute()', () => {
    it('executes the command', () => {
      processor.execute(new AddCommand())
      expect(context.value).toBe(1)
    })

    it('returns value of execution', () => {
      const result = processor.execute(new AddCommand())
      expect(result).toBe(1)
    })

    it('throws error if command is already executed', () => {
      const command = new AddCommand()
      processor.execute(command)
      expect(() => processor.execute(command)).toThrowError('Command is already executed.')
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                  revert                                    */
  /* -------------------------------------------------------------------------- */

  describe('.revert()', () => {
    it('undoes the last executed command', () => {
      processor.execute(new AddCommand())
      processor.revert()
      expect(context.value).toBe(0)
    })

    it('throws error if no command is executed', () => {
      expect(() => processor.revert()).toThrowError('No command to revert.')
    })
  })

})