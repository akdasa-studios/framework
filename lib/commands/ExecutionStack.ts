import { AnyCommand } from './Command'
import { Transaction } from './Transaction'


/**
 * ExecutionStack is a stack of executed commands.
 */
export interface ExecutionHistoryLine {
  command: AnyCommand,
  transaction: Transaction | undefined
}

/**
 * ExecutionStack is a stack of executed commands.
 */
export class ExecutionStack {
  private lines: ExecutionHistoryLine[] = []

  public push(command: AnyCommand, transaction?: Transaction) {
    this.lines.push({ command, transaction: transaction })
  }

  public includes(command: AnyCommand) {
    return this.lines.map(r => r.command).includes(command)
  }

  public pop(): readonly AnyCommand[] {
    const lastRow = this.lines.pop()
    if (!lastRow) { return [] }
    if (!lastRow.transaction) { return [lastRow.command] }

    const result = [lastRow.command]
    while (this.lines.at(-1)?.transaction?.id === lastRow.transaction.id) {
      result.push((this.lines.pop() as ExecutionHistoryLine).command)
    }
    return result
  }
}
