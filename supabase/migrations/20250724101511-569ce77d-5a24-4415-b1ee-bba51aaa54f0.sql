-- Add currency column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN currency TEXT DEFAULT 'USD' NOT NULL;

-- Add a check constraint to ensure valid currency codes
ALTER TABLE public.profiles 
ADD CONSTRAINT valid_currency CHECK (currency ~ '^[A-Z]{3}$');

-- Create an index for better performance when filtering by currency
CREATE INDEX idx_profiles_currency ON public.profiles(currency);