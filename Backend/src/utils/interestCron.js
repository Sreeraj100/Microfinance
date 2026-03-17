import cron from "node-cron";
import User from "../models/userModel.js";
import LoanTransaction from "../models/loanModel.js";

/**
 * Auto-applies 1% interest (balance × 0.01) for every user
 * who has an outstanding loan balance, every 28 days.
 *
 * The cron runs daily at midnight and checks whether 28 days
 * have passed since the last interest transaction for each user.
 * This avoids duplicates and works even if the server restarts.
 */
const applyLoanInterest = async () => {
  console.log("[InterestCron] Running loan interest check...");

  try {
    // Get all regular users
    const users = await User.find({ role: "user" }).select("_id name");

    let applied = 0;
    let skipped = 0;

    for (const user of users) {
      // Get all transactions for this user, sorted oldest first
      const transactions = await LoanTransaction.find({ user: user._id }).sort({
        date: 1,
      });

      if (transactions.length === 0) {
        skipped++;
        continue;
      }

      // Compute current balance
      let balance = 0;
      for (const tx of transactions) {
        if (
          tx.type === "loan" ||
          tx.type === "interest" ||
          tx.type === "fine"
        ) {
          balance += tx.amount;
        } else if (tx.type === "repayment") {
          balance -= tx.amount;
        }
      }

      // Skip users with zero or negative balance (loan fully repaid)
      if (balance <= 0) {
        skipped++;
        continue;
      }

      // Find the date of the last interest transaction
      const lastInterestTx = transactions
        .filter((tx) => tx.type === "interest")
        .at(-1);

      // If no prior interest, use the date of the first loan disbursement
      const referenceDate = lastInterestTx
        ? new Date(lastInterestTx.date)
        : new Date(transactions.find((tx) => tx.type === "loan")?.date);

      if (!referenceDate) {
        skipped++;
        continue;
      }

      const now = new Date();
      const daysSinceReference = Math.floor(
        (now - referenceDate) / (1000 * 60 * 60 * 24),
      );

      // Only apply interest if 28 days have passed
      if (daysSinceReference < 28) {
        skipped++;
        continue;
      }

      // Calculate interest: 1% of current balance
      const interestAmount = parseFloat((balance * 0.01).toFixed(2));

      await LoanTransaction.create({
        user: user._id,
        type: "interest",
        amount: interestAmount,
        date: now,
        note: `Auto interest: 1% of balance ₹${balance.toFixed(2)}`,
        recordedBy: null, // System-generated
      });

      console.log(
        `[InterestCron] Applied ₹${interestAmount} interest for user ${user.name} (balance: ₹${balance.toFixed(2)})`,
      );
      applied++;
    }

    console.log(
      `[InterestCron] Done — applied: ${applied}, skipped: ${skipped}`,
    );
  } catch (err) {
    console.error("[InterestCron] Error applying interest:", err.message);
  }
};

/**
 * Schedule: runs every day at midnight (00:00).
 * The handler itself checks if 28 days have elapsed per user,
 * so running daily is just the trigger — no duplicate interest is applied.
 */
const startInterestCron = () => {
  // Run every day at midnight
  cron.schedule("0 0 * * *", applyLoanInterest, {
    timezone: "Asia/Kolkata",
  });
  console.log("[InterestCron] 28-day loan interest scheduler started.");
};

export { startInterestCron, applyLoanInterest };
