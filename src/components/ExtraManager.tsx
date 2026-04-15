"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

export interface ExtraItem {
  id: string;
  name: string;
  price: number;
  enabled: boolean;
  isDefault?: boolean;
}

interface ExtraManagerProps {
  extras: ExtraItem[];
  onUpdate: (extras: ExtraItem[]) => void;
  currency: string;
}

const ExtraManager = ({ extras, onUpdate, currency }: ExtraManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState<Partial<ExtraItem>>({
    name: '',
    price: 0
  });

  const handleToggle = (id: string) => {
    onUpdate(extras.map(item => 
      item.id === id ? { ...item, enabled: !item.enabled } : item
    ));
  };

  const handlePriceChange = (id: string, newPrice: number) => {
    onUpdate(extras.map(item => 
      item.id === id ? { ...item, price: newPrice } : item
    ));
  };

  const handleAdd = () => {
    if (!newItem.name) return;
    const item: ExtraItem = {
      id: crypto.randomUUID(),
      name: newItem.name,
      price: Number(newItem.price) || 0,
      enabled: true,
      isDefault: false
    };
    onUpdate([...extras, item]);
    setNewItem({ name: '', price: 0 });
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    onUpdate(extras.filter(e => e.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Package className="h-5 w-5 text-orange-500" /> Itens Extras
        </h3>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancelar' : <><Plus className="h-4 w-4 mr-1" /> Novo</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label className="text-xs">Nome do Item</Label>
                <Input 
                  value={newItem.name} 
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Ex: Cartão de Visita"
                  className="h-8 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs">Preço ({currency})</Label>
                <Input 
                  type="number" 
                  value={newItem.price} 
                  onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                  className="h-8 text-sm"
                />
              </div>
            </div>
            <Button size="sm" className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleAdd}>Adicionar</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-2">
        {extras.map(item => (
          <div
            key={item.id}
            className={cn(
              "p-2 rounded-xl border transition-all flex items-center justify-between group",
              item.enabled ? "bg-orange-50/50 border-orange-200 dark:bg-orange-950/20 dark:border-orange-900" : "bg-card opacity-60"
            )}
          >
            <div className="flex items-center gap-3 flex-1">
              <Checkbox 
                checked={item.enabled} 
                onCheckedChange={() => handleToggle(item.id)}
                className="data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
              />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-xs truncate">{item.name}</p>
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-[10px] text-muted-foreground">{currency}</span>
                  <input 
                    type="number"
                    value={item.price}
                    onChange={(e) => handlePriceChange(item.id, Number(e.target.value))}
                    className="bg-transparent border-none p-0 text-[10px] font-bold w-16 focus:ring-0 focus:outline-none"
                    step="0.01"
                  />
                </div>
              </div>
            </div>
            {!item.isDefault && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => handleDelete(item.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtraManager;