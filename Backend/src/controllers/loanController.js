import LoanTransaction from "../models/loanModel.js";
import User from "../models/userModel.js";

// ─── Helper: compute loan summary from transactions ───────────────────────────
const computeLoanSummary = (transactions) => {
  let totalLoan = 0;
  let totalRepayment = 0;
  let totalInterest = 0;
  let totalFine = 0;

  for (const tx of transactions) {
    if (tx.type === "loan") totalLoan += tx.amount;
    else if (tx.type === "repayment") totalRepayment += tx.amount;
    else if (tx.type === "interest") totalInterest += tx.amount;
    else if (tx.type === "fine") totalFine += tx.amount;
  }

  const currentBalance = totalLoan + totalInterest + totalFine - totalRepayment;

  return {
    totalLoan,
    totalRepayment,
    totalInterest,
    totalFine,
    currentBalance,
  };
};

// ─── ADMIN: Add a loan transaction for a user ─────────────────────────────────
// POST /api/admin/loans/:userId/transaction
// Body: { type, amount, date, note }
const addLoanTransaction = async (req, res) => {
  const { userId } = req.params;
  const { type, amount, date, note } = req.body;

  if (!type || !amount || !date) {
    return res.status(400).json({ message: "type, amount, and date are required" });
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "user") {
    return res.status(404).json({ message: "User not found" });
  }

  const transaction = await LoanTransaction.create({
    user: userId,
    type,
    amount,
    date: new Date(date),
    note,
    recordedBy: req.user._id,
  });

  res.status(201).json(transaction);
};

// ─── ADMIN: Get full loan ledger for a user ───────────────────────────────────
// GET /api/admin/loans/:userId
const getUserLoanDetail = async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select("name email");
  if (!user) return res.status(404).json({ message: "User not found" });

  const transactions = await LoanTransaction.find({ user: userId })
    .sort({ date: 1 })
    .populate("recordedBy", "name");

  const summary = computeLoanSummary(transactions);

  res.json({
    user,
    summary,
    transactions,
  });
};

// ─── ADMIN: Overview of all users' loan balances ──────────────────────────────
// GET /api/admin/loans
const getAllUsersLoanOverview = async (req, res) => {
  // Aggregate balance per user across all transaction types
  const aggregated = await LoanTransaction.aggregate([
    {
      $group: {
        _id: "$user",
        totalLoan: {
          $sum: { $cond: [{ $eq: ["$type", "loan"] }, "$amount", 0] },
        },
        totalRepayment: {
          $sum: { $cond: [{ $eq: ["$type", "repayment"] }, "$amount", 0] },
        },
        totalInterest: {
          $sum: { $cond: [{ $eq: ["$type", "interest"] }, "$amount", 0] },
        },
        totalFine: {
          $sum: { $cond: [{ $eq: ["$type", "fine"] }, "$amount", 0] },
        },
      },
    },
    {
      $addFields: {
        currentBalance: {
          $subtract: [
            { $add: ["$totalLoan", "$totalInterest", "$totalFine"] },
            "$totalRepayment",
          ],
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "userInfo",
      },
    },
    {
      $unwind: { path: "$userInfo", preserveNullAndEmpty: true },
    },
    {
      $project: {
        userId: "$_id",
        name: "$userInfo.name",
        email: "$userInfo.email",
        totalLoan: 1,
        totalRepayment: 1,
        totalInterest: 1,
        totalFine: 1,
        currentBalance: 1,
      },
    },
    { $sort: { name: 1 } },
  ]);

  res.json(aggregated);
};

// ─── USER: View own loan summary ──────────────────────────────────────────────
// GET /api/loans/me
const getMyLoanSummary = async (req, res) => {
  const userId = req.user._id;

  const transactions = await LoanTransaction.find({ user: userId }).sort({
    date: 1,
  });

  const summary = computeLoanSummary(transactions);

  // Only expose repayments with their date (not internal interest/fine details)
  const repayments = transactions
    .filter((tx) => tx.type === "repayment")
    .map((tx) => ({ date: tx.date, amount: tx.amount }));

  res.json({
    totalLoanTaken: summary.totalLoan,
    totalPaid: summary.totalRepayment,
    currentBalance: summary.currentBalance,
    repayments,
  });
};

export {
  addLoanTransaction,
  getUserLoanDetail,
  getAllUsersLoanOverview,
  getMyLoanSummary,
};
