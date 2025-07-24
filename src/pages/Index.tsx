import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, BarChart3, CreditCard, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading while checking auth state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect authenticated users to dashboard
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Take Control of Your Finances
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Track your income, manage expenses, and gain insights into your spending patterns
            with our comprehensive expense tracking solution.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="px-8">
                Get Started
              </Button>
            </Link>
            <Link to="/auth">
              <Button variant="outline" size="lg" className="px-8">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
          <Card className="text-center">
            <CardHeader>
              <DollarSign className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Track Income & Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Easily log your income and expenses with categorization for better organization.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <BarChart3 className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Visual Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Get insights with beautiful charts and graphs showing your financial trends.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <CreditCard className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Budget Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Set your monthly salary and track how much you spend versus your income.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <TrendingUp className="h-12 w-12 mx-auto text-primary mb-4" />
              <CardTitle>Financial Growth</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Monitor your savings rate and make informed decisions about your spending.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Ready to start your financial journey?
          </h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of users who have taken control of their finances
          </p>
          <Link to="/auth">
            <Button size="lg" className="px-12">
              Start Tracking Today
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
