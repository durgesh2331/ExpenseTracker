import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useCurrency = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currency, setCurrency] = useState<string>('USD');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserCurrency();
    }
  }, [user]);

  const fetchUserCurrency = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('currency')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching user currency:', error);
        return;
      }

      if (data?.currency) {
        setCurrency(data.currency);
      }
    } catch (error) {
      console.error('Error in fetchUserCurrency:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCurrency = async (newCurrency: string) => {
    if (!user) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .update({ currency: newCurrency })
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating currency:', error);
        toast({
          title: "Error",
          description: "Failed to update currency. Please try again.",
          variant: "destructive",
        });
        return;
      }

      setCurrency(newCurrency);
      toast({
        title: "Success",
        description: "Currency updated successfully.",
      });
    } catch (error) {
      console.error('Error in updateCurrency:', error);
      toast({
        title: "Error",
        description: "Failed to update currency. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    currency,
    updateCurrency,
    loading,
  };
};