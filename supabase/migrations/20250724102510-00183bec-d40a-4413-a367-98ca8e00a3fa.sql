-- Add currency column to transactions table
ALTER TABLE public.transactions 
ADD COLUMN currency TEXT NOT NULL DEFAULT 'USD';

-- Add check constraint to ensure valid currency codes
ALTER TABLE public.transactions 
ADD CONSTRAINT valid_currency_code 
CHECK (currency ~ '^[A-Z]{3}$');