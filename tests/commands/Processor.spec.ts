import { Result, AnyResult } from '@lib/core'
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
      expect(result.value).toBe(50) // 100 / 2
    })

    it('returns failure if command failed', async () => {
      const result = await processor.execute(new DivCommand(0))
      expect(result.value).toBe('Cannot divide by zero.')
    })

    it('throws an error if command is already executed', async () => {
      await processor.execute(command)
      await expect(async () => await processor.execute(command)).rejects.toThrowError('Command is already executed')
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

    it('returns success if command is reverted', async () => {
      const result = await processor.revert()
      expect(result).not.toHaveLength(0)
    })

    it('returns an empty array if no command to revert', async () => {
      await processor.revert()
      const result = await processor.revert()
      expect(result).toHaveLength(0)
      expect(result).toBeDefined()
      expect(result).toStrictEqual([])
    })
  })

  /* -------------------------------------------------------------------------- */
  /*                                Transactions                                */
  /* -------------------------------------------------------------------------- */

  describe('transactions', () => {
    it('should revert one and last commands in transaction', async () => {
      const command1 = new DivCommand(2)
      const transaction = new Transaction()
      await processor.execute(command1, transaction)
      await processor.revert()
      expect(context.value).toBe(100)
    })

    it('should revert all commands of transaction', async () => {
      const command1 = new DivCommand(2)
      const command2 = new DivCommand(2)
      const transaction = new Transaction()
      await processor.execute(command1, transaction)
      await processor.execute(command2, transaction)
      await processor.revert()
      expect(context.value).toBe(100)
    })

    it('should not revert commands out of transaction', async () => {
      const command1 = new DivCommand(2)
      const command2 = new DivCommand(2)
      const command3 = new DivCommand(2)
      const transaction = new Transaction()
      await processor.execute(command1)
      await processor.execute(command2, transaction)
      await processor.execute(command3, transaction)
      await processor.revert()
      expect(context.value).toBe(50)
    })

    it('should not revert commands from other transaction', async () => {
      const command1 = new DivCommand(2)
      const command2 = new DivCommand(2)
      const transaction1 = new Transaction()
      const transaction2 = new Transaction()
      await processor.execute(command1, transaction1)
      await processor.execute(command2, transaction2)

      await processor.revert()
      expect(context.value).toBe(50)
    })
  })

  describe('.commandExecuted', () => {
    const command = new DivCommand(2)
    let lastCommand: Command<CalculatorContext, AnyResult>|undefined = undefined
    function commandHandler(command) {
      lastCommand = command
    }

    beforeEach(() => {
      lastCommand = undefined
      processor.commandExecuted.subscribe(commandHandler)
    })

    it('notifies subscribers', async () => {
      await processor.execute(command)
      expect(lastCommand).not.toBeUndefined()
    })

    it('notifies subscribers', async () => {
      processor.commandExecuted.unsubscribe(commandHandler)
      await processor.execute(command)
      expect(lastCommand).toBeUndefined()
    })
  })

  describe('.commandReverted', () => {
    const command = new DivCommand(2)
    let lastCommand: Command<CalculatorContext, AnyResult>|undefined = undefined
    function commandHandler(command) {
      lastCommand = command
    }

    beforeEach(async () => {
      lastCommand = undefined
      processor.commandReverted.subscribe(commandHandler)
      await processor.execute(command)
    })

    it('notifies subscribers', async () => {
      await processor.revert()
      expect(lastCommand).not.toBeUndefined()
    })

    it('notifies subscribers', async () => {
      processor.commandReverted.unsubscribe(commandHandler)
      await processor.revert()
      expect(lastCommand).toBeUndefined()
    })
  })
})