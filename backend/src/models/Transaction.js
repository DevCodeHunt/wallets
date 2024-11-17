import {model, Schema} from "mongoose"

const transactionSchema = new Schema(
  {
    transactionId: {type: String, required: true},
    walletId: {type: Schema.Types.ObjectId, ref: "Wallet"},
    amount: {type: Number, required: true},
    description: {type: String},
    type: {type: String, enum: ["debit", "credit"], required: true},
    date: {type: Date, default: Date.now()},
    balance: {type: Number},
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v
        return ret
      },
    },
  }
)

const Transaction = model("Transaction", transactionSchema)

export default Transaction
