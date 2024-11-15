import { model, Schema } from "mongoose";

const transactionSchema = new Schema(
  {
    transactionId: { type: String, required: true},
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["deposit", "withdrawal"], required: true },
    status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
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
