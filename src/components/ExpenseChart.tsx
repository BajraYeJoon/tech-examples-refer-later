import { useFinanceStore } from "../store/financeStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import { useMemo } from "react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function ExpenseChart() {
  const { transactions } = useFinanceStore();

  const expensesByCategory = useMemo(() => {
    const expenses = transactions.filter((t) => t.type === "EXPENSE");
    const groupedExpenses = expenses.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(groupedExpenses).map(([name, value]) => ({
      name,
      value,
    }));
  }, [transactions]);

  const totalExpenses = expensesByCategory.reduce(
    (sum, item) => sum + item.value,
    0
  );

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Expenses by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expensesByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={150}
                  label={({ name, percent }) =>
                    `${name} (${(percent * 100).toFixed(1)}%)`
                  }
                >
                  {expensesByCategory.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    `$${value.toFixed(2)}`,
                    "Amount",
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expensesByCategory.map((category, index) => (
          <Card key={category.name}>
            <CardHeader>
              <CardTitle className="text-lg">{category.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${category.value.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">
                {((category.value / totalExpenses) * 100).toFixed(1)}% of total
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
