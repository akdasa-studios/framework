import { Result } from '@lib/core'
import { Processor, Command } from '@lib/commands'

class CalculatorContext {
  constructor(public value: number) { }
}

class DivCommand implements Command<CalculatorContext, Result<number, string>> {
  private _prevValue = 0
  constructor(public readonly divisor: number) { }

  execute(context: CalculatorContext): Result<number, string> {
    if (this.divisor === 0) { return Result.fail('Cannot divide by zero.') }
    this._prevValue = context.value
    context.value = context.value / this.divisor
    return Result.ok(context.value)
  }
  revert(context: CalculatorContext): Result<number, string> {
    context.value = this._prevValue
    return Result.ok(context.value)
  }
}

describe('Processor', () => {
  let context: CalculatorContext
  let processor: Processor<CalculatorContext>

  beforeEach(() => {
    context = new CalculatorContext(100)
    processor = new Processor(context)
  })

  /* -------------------------------------------------------------------------- */
  /*                                   execute                                  */
  /* -------------------------------------------------------------------------- */

  describe('.execute()', () => {
    const command = new DivCommand(2)

    it('executes the command', () => {
      processor.execute(command)
      expect(context.value).toBe(50) // 100 / 2
    })

    it('returns result of execution', () => {
      const result = processor.execute(command)
      expect(result.isCommandExecuted).toBeTruthy()
      expect(result.isCommandSucceeded).toBeTruthy()
      expect(result.value).toBe(50) // 100 / 2
    })

    it('returns failure if command failed', () => {
      const result = processor.execute(new DivCommand(0))
      expect(result.isCommandExecuted).toBeTruthy()
      expect(result.isCommandSucceeded).toBeFalsy()
      expect(result.value).toBe('Cannot divide by zero.')
    })

    it('returns failure if command is already executed', () => {
      processor.execute(command)
      expect(processor.execute(command).isCommandExecuted).toBeFalsy()
      expect(processor.execute(command).processorResult.value).toEqual('Command is already executed.')
      expect(processor.execute(command).value).toBeUndefined()
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                  revert                                    */
  /* -------------------------------------------------------------------------- */

  describe('.revert()', () => {
    const command = new DivCommand(2)

    beforeEach(() => { processor.execute(command) })

    it('undoes the last executed command', () => {
      processor.revert()
      expect(context.value).toBe(100) // 50 -> 100
    })

    it('returns success if command is reverted', () => {
      const result = processor.revert()
      expect(result.isCommandExecuted).toBeTruthy()
    })

    it('returns failure if no command to revert', () => {
      processor.revert()
      const result = processor.revert()
      expect(result.isCommandExecuted).toBeFalsy()
      expect(result.processorResult.value).toEqual('No command to revert.')
    })
  })
})