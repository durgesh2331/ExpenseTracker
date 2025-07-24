import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
}

interface Profile {
  monthly_salary: number;
}

const Reports = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    const [transactionsResponse, profileResponse] = await Promise.all([
      supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false }),
      supabase
        .from('profiles')
        .select('monthly_salary')
        .eq('user_id', user?.id)
        .single()
    ]);

    if (transactionsResponse.error) {
      console.error('Error fetching transactions:', transactionsResponse.error);
    } else {
      setTransactions(transactionsResponse.data || []);
    }

    if (profileResponse.error) {
      console.error('Error fetching profile:', profileResponse.error);
    } else {
      setProfile(profileResponse.data);
    }

    setLoading(false);
  };

  const expenses = transactions.filter(t => t.type === 'expense');
  const income = transactions.filter(t => t.type === 'income');

  // Calculate expense categories for pie chart
  const expenseCategories = expenses.reduce((acc, transaction) => {
    const category = transaction.category;
    acc[category] = (acc[category] || 0) + Number(transaction.amount);
    return acc;
  }, {} as Record<string, number>);

  const pieData = Object.entries(expenseCategories).map(([category, amount]) => ({
    name: category,
    value: amount
  }));

  // Calculate monthly data for bar chart
  const monthlyData = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
    if (!acc[month]) {
      acc[month] = { month, income: 0, expenses: 0 };
    }
    
    if (transaction.type === 'income') {
      acc[month].income += Number(transaction.amount);
    } else {
      acc[month].expenses += Number(transaction.amount);
    }
    
    return acc;
  }, {} as Record<string, { month: string; income: number; expenses: number }>);

  const barData = Object.values(monthlyData).slice(-6); // Last 6 months

  const totalIncome = income.reduce((sum, t) => sum + Number(t.amount), 0);
  const totalExpenses = expenses.reduce((sum, t) => sum + Number(t.amount), 0);
  const monthlySalary = profile?.monthly_salary || 0;
  const totalAvailable = monthlySalary + totalIncome;
  const expenseRatio = totalAvailable > 0 ? (totalExpenses / totalAvailable) * 100 : 0;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Reports & Insights</h1>
        <p className="text-muted-foreground">
          Analyze your spending patterns and financial trends
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Expense Ratio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{expenseRatio.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">Of total available funds</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Funds</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAvailable.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Salary + Additional Income</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalAvailable > 0 ? (((totalAvailable - totalExpenses) / totalAvailable) * 100).toFixed(1) : 0}%
            </div>
            <p className="text-xs text-muted-foreground">Money saved this period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Avg. Daily Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${expenses.length > 0 ? (totalExpenses / 30).toFixed(2) : '0.00'}
            </div>
            <p className="text-xs text-muted-foreground">Based on current data</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Expense Categories</CardTitle>
          </CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Amount']} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No expense data available
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income vs Expenses (Monthly)</CardTitle>
          </CardHeader>
          <CardContent>
            {barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, '']} />
                  <Bar dataKey="income" fill="#00C49F" name="Income" />
                  <Bar dataKey="expenses" fill="#FF8042" name="Expenses" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                No transaction data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;