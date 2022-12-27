/**
 * Transaction is a marker for a group of commands.
 */


export class Transaction {
  private _id: string

  /**
   * Initialize a new instance of the Transaction class.
   * @param value Unique identifier of the transaction.
   */
  constructor() {
    this._id = Math.random().toString(36)
  }

  get id() { return this._id }
}
