"use client";

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

const CurrencySelector = ({ value, onChange }: CurrencySelectorProps) => {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium">Moeda:</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="R$" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="R$">R$</SelectItem>
          <SelectItem value="$">$</SelectItem>
          <SelectItem value="€">€</SelectItem>
          <SelectItem value="£">£</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CurrencySelector;