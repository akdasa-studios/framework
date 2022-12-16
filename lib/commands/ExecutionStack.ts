import { AnyCommand } from './Command'
import { Transaction } from './Transaction'


/**
 * ExecutionStack is a stack of executed commands.
 */
export interface ExecutionHistoryLine {
  command: AnyCommand,
  transactionId: Transaction | undefined
}

/**
 * ExecutionStack is a stack of executed commands.
 */
export class ExecutionStack {
  private lines: ExecutionHistoryLine[] = []

  public push(command: AnyCommand, transactionId?: Transaction) {
    this.lines.push({ command, transactionId })
  }

  public includes(command: AnyCommand) {
    return this.lines.map(r => r.command).includes(command)
  }

  public pop(): readonly AnyCommand[] {
    const lastRow = this.lines.pop()
    if (!lastRow) { return [] }
    if (!lastRow.transactionId) { return [lastRow.command] }

    const result = [lastRow.command]
    while (this.lines.at(-1)?.transactionId === lastRow.transactionId) {
      result.push((this.lines.pop() as ExecutionHistoryLine).command)
    }
    return result
  }
}
