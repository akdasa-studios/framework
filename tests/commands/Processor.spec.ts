import { Result } from '@lib/core'
import { Processor, Command, Transaction } from '@lib/commands'

class CalculatorContext {
  constructor(public value: number) { }
}

class DivCommand implements Command<CalculatorContext, Result<number, string>> {
  private _prevValue = 0
  constructor(public readonly divisor: number) { }

  async execute(context: CalculatorContext): Promise<Result<number, string>> {
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

    it('returns result of execution', async () => {
      const result = await processor.execute(command)
      expect(result.isCommandExecuted).toBeTruthy()
      expect(result.isCommandSucceeded).toBeTruthy()
      expect(result.value).toBe(50) // 100 / 2
    })

    it('returns failure if command failed', async () => {
      const result = await processor.execute(new DivCommand(0))
      expect(result.isCommandExecuted).toBeTruthy()
      expect(result.isCommandSucceeded).toBeFalsy()
      expect(result.value).toBe('Cannot divide by zero.')
    })

    it('returns failure if command is already executed', async () => {
      await processor.execute(command)
      expect((await processor.execute(command)).isCommandExecuted).toBeFalsy()
      expect((await processor.execute(command)).processorResult.value).toEqual('Command is already executed.')
      expect((await processor.execute(command)).value).toBeUndefined()
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

  /* -------------------------------------------------------------------------- */
  /*                                Transactions                                */
  /* -------------------------------------------------------------------------- */

  describe('transactions', () => {
    it('should revert one and last commands in transaction', () => {
      const command1 = new DivCommand(2)
      const transaction = new Transaction()
      processor.execute(command1, transaction)
      processor.revert()
      expect(context.value).toBe(100)
    })

    it('should revert all commands of transaction', () => {
      const command1 = new DivCommand(2)
      const command2 = new DivCommand(2)
      const transaction = new Transaction()
      processor.execute(command1, transaction)
      processor.execute(command2, transaction)
      processor.revert()
      expect(context.value).toBe(100)
    })

    it('should not revert commands out of transaction', () => {
      const command1 = new DivCommand(2)
      const command2 = new DivCommand(2)
      const command3 = new DivCommand(2)
      const transaction = new Transaction()
      processor.execute(command1)
      processor.execute(command2, transaction)
      processor.execute(command3, transaction)
      processor.revert()
      expect(context.value).toBe(50)
    })

    it('should not revert commands from other transaction', async () => {
      const command1 = new DivCommand(2)
      const command2 = new DivCommand(2)
      const transaction1 = new Transaction()
      const transaction2 = new Transaction()
      await processor.execute(command1, transaction1)
      await processor.execute(command2, transaction2)

      processor.revert()
      expect(context.value).toBe(50)
    })
  })
})