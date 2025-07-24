import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const Salary = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [salary, setSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
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
      setSalary(data?.monthly_salary?.toString() || '0');
    }
    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase
      .from('profiles')
      .update({ monthly_salary: parseFloat(salary) })
      .eq('user_id', user?.id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update salary",
      });
    } else {
      toast({
        title: "Success",
        description: "Monthly salary updated successfully",
      });
    }

    setLoading(false);
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Monthly Salary</h1>
        <p className="text-muted-foreground">
          Set your monthly salary to track your budget effectively
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Update Monthly Salary</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="salary">Monthly Salary</Label>
              <Input
                id="salary"
                type="number"
                step="0.01"
                placeholder="Enter your monthly salary"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Why set your salary?</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Calculate your remaining balance after expenses</li>
                <li>• Track spending against your income</li>
                <li>• Get insights on your expense-to-income ratio</li>
                <li>• Better budget planning and financial awareness</li>
              </ul>
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Salary'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Salary;