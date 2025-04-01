import { z } from "zod";

export const transactionSchema = z.object({
  type: z.enum(["INCOME", "EXPENSE"], {
    required_error: "Transaction type is required",
    invalid_type_error: "Transaction type must be either 'INCOME' or 'EXPENSE'",
  }),

  amount: z
    .number()
    .positive("Amount must be positive")
    .min(0.01, "Amount must be at least 0.01")
    .max(1000000, "Amount cannot exceed 1,000,000"),

  category: z
    .string()
    .min(1, "Category is required")
    .max(50, "Category name is too long"),

  description: z
    .string()
    .min(3, "Description must be at least 3 characters")
    .max(500, "Description is too long")
    .optional(),

  date: z.date({
    required_error: "Date is required",
    invalid_type_error: "Invalid date format",
  }),

  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed").default([]),

  recurringType: z
    .enum(["NONE", "DAILY", "WEEKLY", "MONTHLY", "YEARLY"])
    .default("NONE"),

  attachments: z
    .array(z.string().url("Invalid attachment URL"))
    .max(3, "Maximum 3 attachments allowed")
    .default([]),
});
