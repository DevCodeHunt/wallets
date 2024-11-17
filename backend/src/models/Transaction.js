import {model, Schema} from "mongoose"

const transactionSchema = new Schema(
  {
    walletId: {type: Schema.Types.ObjectId, ref: "Wallet"},
    amount: {type: Number, required: true},
    description: {type: String},
    type: {type: String, enum: ["DEBIT", "CREDIT"], required: true},
    date: {type: Date, default: Date.now()},
    balance: {type: Number},
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.transactionId = ret._id
        delete ret.__v
        delete ret._id
        return ret
      },
    },
  }
)

const Transaction = model("Transaction", transactionSchema)

export default Transaction
