import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import { formatCurrency } from '@/lib/currency';
import { useCurrency } from '@/hooks/use-currency';

interface Profile {
  monthly_salary: number;
}

interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: string;
  date: string;
  currency: string;
}

interface CurrencySummary {
  currency: string;
  totalIncome: number;
  totalExpenses: number;
  balance: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { currency: userCurrency } = useCurrency();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchTransactions();
    }
  }, [user]);

  const fetchProfile = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('monthly_salary')
      .eq('user_id', user?.id)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
    } else {
      setProfile(data);
    }
  };

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching transactions:', error);
    } else {
      setTransactions(data || []);
    }
    setLoading(false);
  };

  // Group transactions by currency
  const currencySummaries = transactions.reduce((acc, transaction) => {
    const currency = transaction.currency;
    if (!acc[currency]) {
      acc[currency] = {
        currency,
        totalIncome: 0,
        totalExpenses: 0,
        balance: 0
      };
    }
    
    if (transaction.type === 'income') {
      acc[currency].totalIncome += Number(transaction.amount);
    } else {
      acc[currency].totalExpenses += Number(transaction.amount);
    }
    
    return acc;
  }, {} as Record<string, CurrencySummary>);

  // Calculate balances and add monthly salary to user's default currency
  Object.values(currencySummaries).forEach(summary => {
    summary.balance = summary.totalIncome - summary.totalExpenses;
    if (summary.currency === userCurrency) {
      summary.balance += (profile?.monthly_salary || 0);
    }
  });

  const summariesArray = Object.values(currencySummaries);
  const primarySummary = currencySummaries[userCurrency] || {
    currency: userCurrency,
    totalIncome: 0,
    totalExpenses: 0,
    balance: (profile?.monthly_salary || 0)
  };

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
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial status
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(profile?.monthly_salary || 0, userCurrency)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(primarySummary.totalIncome, userCurrency)}
            </div>
            {summariesArray.length > 1 && (
              <div className="text-sm text-muted-foreground mt-1">
                {summariesArray.filter(s => s.currency !== userCurrency).map(summary => (
                  <div key={summary.currency}>
                    {formatCurrency(summary.totalIncome, summary.currency)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(primarySummary.totalExpenses, userCurrency)}
            </div>
            {summariesArray.length > 1 && (
              <div className="text-sm text-muted-foreground mt-1">
                {summariesArray.filter(s => s.currency !== userCurrency).map(summary => (
                  <div key={summary.currency}>
                    {formatCurrency(summary.totalExpenses, summary.currency)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Balance</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${primarySummary.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(primarySummary.balance, userCurrency)}
            </div>
            {summariesArray.length > 1 && (
              <div className="text-sm text-muted-foreground mt-1">
                {summariesArray.filter(s => s.currency !== userCurrency).map(summary => (
                  <div key={summary.currency} className={summary.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                    {formatCurrency(summary.balance, summary.currency)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <p className="text-muted-foreground">No transactions found. Start by adding your first transaction!</p>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className={`font-bold ${
                    transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(Number(transaction.amount), transaction.currency)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;