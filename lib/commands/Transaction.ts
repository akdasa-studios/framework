/**
 * Transaction is a marker for a group of commands.
 */


export class Transaction {
  /**
   * Initialize a new instance of the Transaction class.
   * @param value Unique identifier of the transaction.
   */
  constructor(public readonly value: string) { }
}
