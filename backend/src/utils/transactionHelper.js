import mongoose from "mongoose"
/**
 * Wraps a function in a MongoDB transaction session.
 * @param {Function} transactionCallback - The function to execute within the transaction.
 * @returns {Promise<any>} - The result of the transactionCallback function.
 */
export const withTransaction = async (transactionCallback) => {
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const result = await transactionCallback(session)
    await session.commitTransaction()
    return result
  } catch (error) {
    await session.abortTransaction()
    throw error // Propagate the error to the caller
  } finally {
    session.endSession()
  }
}
