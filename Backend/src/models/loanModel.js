import mongoose from "mongoose";

/**
 * LoanTransaction — audit log of all loan-related events for a user.
 *
 * Types:
 *   loan       → new loan disbursed to user (increases balance)
 *   repayment  → user paid back money (decreases balance)
 *   interest   → auto-applied 1% of balance every 28 days (increases balance)
 *   fine       → optional penalty added by admin (increases balance)
 *
 * Current balance = sum(loan) + sum(interest) + sum(fine) - sum(repayment)
 */
const loanTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    type: {
      type: String,
      enum: ["loan", "repayment", "interest", "fine"],
      required: [true, "Transaction type is required"],
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than 0"],
    },
    // The date the transaction is recorded as happening (admin-controlled)
    date: {
      type: Date,
      required: [true, "Transaction date is required"],
    },
    note: {
      type: String,
      trim: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Admin who entered this record
    },
  },
  { timestamps: true }
);

// Index for fast per-user queries
loanTransactionSchema.index({ user: 1, date: -1 });
loanTransactionSchema.index({ user: 1, type: 1 });

export default mongoose.model("LoanTransaction", loanTransactionSchema);
