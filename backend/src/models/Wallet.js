import {model, Schema} from "mongoose"

const walletSchema = new Schema(
  {
    name: String,
    balance: Number,
    date: {type: Date, default: Date.now()},
  },
  {
    toJSON: {
      transform: (doc, ret) => {
        ret.id = ret._id
        delete ret.__v
        delete ret._id
        return ret
      },
    },
  }
)

const Wallet = model("Wallet", walletSchema)

export default Wallet
