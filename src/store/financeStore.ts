import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid";
import type { z } from "zod";
import type { transactionSchema } from "../schemas/financeSchemas";

type Transaction = z.infer<typeof transactionSchema> & { id: string };

interface Budget {
  id: string;
  category: string;
  limit: number;
  period: "MONTHLY" | "YEARLY";
  currentSpent: number;
}

interface FinanceStore {
  transactions: Transaction[];
  budgets: Budget[];
  categories: string[];
  addTransaction: (transaction: z.infer<typeof transactionSchema>) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  addBudget: (budget: Omit<Budget, "id" | "currentSpent">) => void;
  updateBudget: (id: string, budget: Partial<Budget>) => void;
  deleteBudget: (id: string) => void;
  addCategory: (category: string) => void;
  deleteCategory: (category: string) => void;
}

const log =
  (fn: Function) =>
  (...args: any[]) => {
    console.log(`Calling ${fn.name} with:`, ...args);
    const result = fn(...args);
    console.log(`${fn.name} result:`, result);
    return result;
  };

export const useFinanceStore = create<FinanceStore>()(
  persist(
    immer((set) => ({
      transactions: [],
      budgets: [],
      categories: [
        "Salary",
        "Food",
        "Transport",
        "Entertainment",
        "Bills",
        "Shopping",
      ],

      addTransaction: (transaction) =>
        set((state) => {
          console.log("Adding transaction:", transaction);
          const newTransaction = { ...transaction, id: uuidv4() };
          state.transactions.push(newTransaction);
          console.log("New transaction list:", state.transactions);
        }),

      updateTransaction: (id, transaction) =>
        set((state) => {
          const index = state.transactions.findIndex((t) => t.id === id);
          if (index !== -1) {
            state.transactions[index] = {
              ...state.transactions[index],
              ...transaction,
            };
          }
        }),

      deleteTransaction: (id) =>
        set((state) => {
          state.transactions = state.transactions.filter((t) => t.id !== id);
        }),

      addBudget: (budget) =>
        set((state) => {
          state.budgets.push({ ...budget, id: uuidv4(), currentSpent: 0 });
        }),

      updateBudget: (id, budget) =>
        set((state) => {
          const index = state.budgets.findIndex((b) => b.id === id);
          if (index !== -1) {
            state.budgets[index] = { ...state.budgets[index], ...budget };
          }
        }),

      deleteBudget: (id) =>
        set((state) => {
          state.budgets = state.budgets.filter((b) => b.id !== id);
        }),

      addCategory: (category) =>
        set((state) => {
          state.categories.push(category);
        }),

      deleteCategory: (category) =>
        set((state) => {
          state.categories = state.categories.filter((c) => c !== category);
        }),
    })),
    {
      name: "finance-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        transactions: state.transactions,
        budgets: state.budgets,
        categories: state.categories,
      }),
    }
  )
);
