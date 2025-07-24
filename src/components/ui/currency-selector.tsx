import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { POPULAR_CURRENCIES, Currency, getCurrencyByCode } from "@/lib/currency";
import { useState } from "react";

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export function CurrencySelector({ value, onValueChange, className }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const selectedCurrency = getCurrencyByCode(value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
        >
          {selectedCurrency ? (
            <span className="flex items-center gap-2">
              <span className="font-mono text-lg">{selectedCurrency.symbol}</span>
              <span>{selectedCurrency.code}</span>
              <span className="text-muted-foreground">- {selectedCurrency.name}</span>
            </span>
          ) : (
            "Select currency..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {POPULAR_CURRENCIES.map((currency) => (
                <CommandItem
                  key={currency.code}
                  value={`${currency.code} ${currency.name}`}
                  onSelect={() => {
                    onValueChange(currency.code);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === currency.code ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="flex items-center gap-3 w-full">
                    <span className="font-mono text-lg w-8">{currency.symbol}</span>
                    <span className="font-medium">{currency.code}</span>
                    <span className="text-muted-foreground">{currency.name}</span>
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}