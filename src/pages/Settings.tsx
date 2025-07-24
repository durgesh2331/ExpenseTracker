import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencySelector } from '@/components/ui/currency-selector';
import { useCurrency } from '@/hooks/use-currency';
import { LogOut, User, Shield, DollarSign } from 'lucide-react';

const Settings = () => {
  const { user, signOut } = useAuth();
  const { currency, updateCurrency, loading: currencyLoading } = useCurrency();

  const handleSignOut = () => {
    signOut();
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <p className="text-foreground">{user?.email}</p>
          </div>
          
          <div>
            <label className="text-sm font-medium text-muted-foreground">Account Created</label>
            <p className="text-foreground">
              {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Currency Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground mb-2 block">
              Preferred Currency
            </label>
            <p className="text-sm text-muted-foreground mb-4">
              Choose your preferred currency for displaying amounts throughout the app.
            </p>
            <CurrencySelector
              value={currency}
              onValueChange={updateCurrency}
              className="max-w-md"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">Sign Out</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Sign out of your account on this device. You'll need to sign in again to access your data.
            </p>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>About</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              <strong>Expense Tracker</strong> helps you manage your finances by tracking income, expenses, and providing insights into your spending patterns.
            </p>
            <p className="text-sm text-muted-foreground">
              Your data is securely stored and only accessible to you.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;