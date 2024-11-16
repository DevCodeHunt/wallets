import { model, Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionId: { type: String, required: true},
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    amount: { type: Number, required: true },
    transactionType: { type: String, enum: ["debit", "credit"], required: true },
    description: { type: String },
    date: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (doc, ret) => {
        delete ret.__v;
        return ret;
      },
    },
  }
);

const Transaction = model("Transaction", transactionSchema);

export default Transaction;
