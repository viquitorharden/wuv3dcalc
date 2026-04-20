"use client";

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, DollarSign, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfitSimulatorProps {
  productionCostPerUnit: number;
  currency: string;
}

const ProfitSimulator = ({ productionCostPerUnit, currency }: ProfitSimulatorProps) => {
  const [customPrice, setCustomPrice] = useState<number | "">(0);
  const [platform, setPlatform] = useState("direct");

  const format = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const analysis = useMemo(() => {
    const price = Number(customPrice) || 0;
    let fees = 0;

    // Lógica de taxas simplificada para simulação (baseada no MarketplacePrices)
    if (platform === 'shopee') {
      const commission = 0.20;
      const fixedFee = price < 8 ? price * 0.5 : (price < 80 ? 4 : price < 100 ? 16 : price < 200 ? 20 : 26);
      fees = (price * commission) + fixedFee;
    } else if (platform === 'ml_classico') {
      const commission = 0.12;
      const fixedFee = price < 12.5 ? price * 0.5 : (price < 80 ? 6.75 : 0);
      fees = (price * commission) + fixedFee;
    } else if (platform === 'ml_premium') {
      const commission = 0.16;
      const fixedFee = price < 12.5 ? price * 0.5 : (price < 80 ? 6.75 : 0);
      fees = (price * commission) + fixedFee;
    } else if (platform === 'amazon_ind') {
      fees = (price * 0.13) + 2;
    } else if (platform === 'tiktok') {
      fees = (price * 0.06) + 4;
    }

    const netReceived = price - fees;
    const profit = netReceived - productionCostPerUnit;
    const margin = price > 0 ? (profit / price) * 100 : 0;
    const isProfit = profit > 0;

    return { fees, netReceived, profit, margin, isProfit };
  }, [customPrice, platform, productionCostPerUnit]);

  return (
    <Card className="border-2 border-primary/10 shadow-md">
      <CardHeader className="pb-2 pt-4 px-4">
        <CardTitle className="text-base font-bold flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" /> Simulador de Venda
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Preço de Venda</Label>
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">{currency}</span>
              <Input 
                type="number" 
                value={customPrice} 
                onChange={(e) => setCustomPrice(e.target.value === '' ? '' : Number(e.target.value))}
                className="pl-8 h-9 text-sm font-bold"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[10px] font-bold uppercase text-muted-foreground">Canal</Label>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger className="h-9 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Venda Direta</SelectItem>
                <SelectItem value="shopee">Shopee</SelectItem>
                <SelectItem value="ml_classico">ML Clássico</SelectItem>
                <SelectItem value="ml_premium">ML Premium</SelectItem>
                <SelectItem value="amazon_ind">Amazon (Ind.)</SelectItem>
                <SelectItem value="tiktok">TikTok Shop</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className={cn(
          "p-4 rounded-xl border-2 transition-all",
          analysis.isProfit 
            ? "bg-green-50 border-green-200 dark:bg-green-950/20 dark:border-green-900" 
            : "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900"
        )}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-[10px] font-bold uppercase text-muted-foreground">Lucro Líquido / Un.</p>
              <p className={cn("text-2xl font-black", analysis.isProfit ? "text-green-600" : "text-red-600")}>
                {currency} {format(analysis.profit)}
              </p>
            </div>
            <div className={cn(
              "p-2 rounded-lg",
              analysis.isProfit ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {analysis.isProfit ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-current/10">
            <div className="space-y-0.5">
              <p className="text-[10px] font-medium opacity-70">Margem Real</p>
              <p className="text-sm font-bold flex items-center gap-1">
                <Percent className="h-3 w-3" /> {analysis.margin.toFixed(1)}%
              </p>
            </div>
            <div className="space-y-0.5 text-right">
              <p className="text-[10px] font-medium opacity-70">Taxas Canal</p>
              <p className="text-sm font-bold">{currency} {format(analysis.fees)}</p>
            </div>
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground italic">
          Custo de produção base: {currency} {format(productionCostPerUnit)}
        </p>
      </CardContent>
    </Card>
  );
};

export default ProfitSimulator;