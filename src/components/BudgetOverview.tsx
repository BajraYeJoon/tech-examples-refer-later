import { useFinanceStore } from "../store/financeStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Progress } from "../components/ui/progress";
import { Button } from "../components/ui/button";
import { useState } from "react";
import { BudgetForm } from "./BudgetForm";

export function BudgetOverview() {
  const { budgets, transactions } = useFinanceStore();
  const [showForm, setShowForm] = useState(false);

  // Calculate current spending for each budget
  const budgetsWithSpending = budgets.map((budget) => {
    const spent = transactions
      .filter(
        (t) =>
          t.type === "EXPENSE" &&
          t.category === budget.category &&
          new Date(t.date).getMonth() === new Date().getMonth()
      )
      .reduce((sum, t) => sum + t.amount, 0);

    const percentage = (spent / budget.limit) * 100;

    return {
      ...budget,
      spent,
      percentage: Math.min(percentage, 100),
    };
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Monthly Budgets</h2>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Close Form" : "Add Budget"}
        </Button>
      </div>

      {showForm && <BudgetForm onComplete={() => setShowForm(false)} />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgetsWithSpending.map((budget) => (
          <Card key={budget.id}>
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>{budget.category}</span>
                <span className="text-sm text-muted-foreground">
                  ${budget.spent.toFixed(2)} / ${budget.limit.toFixed(2)}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={budget.percentage} className="h-2" />
              <p className="mt-2 text-sm text-muted-foreground">
                {budget.percentage.toFixed(1)}% used
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
