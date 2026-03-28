"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Package, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface ExtraItem {
  id: string;
  name: string;
  price: number;
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

  const handleAdd = () => {
    if (!newItem.name) return;
    const item: ExtraItem = {
      id: crypto.randomUUID(),
      name: newItem.name,
      price: Number(newItem.price) || 0,
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
          {isAdding ? 'Cancelar' : <><Plus className="h-4 w-4 mr-1" /> Adicionar</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-1 gap-3">
              <div>
                <Label>Nome do Item</Label>
                <Input 
                  value={newItem.name} 
                  onChange={e => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Ex: Embalagem Kraft"
                />
              </div>
              <div>
                <Label>Preço ({currency})</Label>
                <Input 
                  type="number" 
                  value={newItem.price} 
                  onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                />
              </div>
            </div>
            <Button className="w-full bg-orange-600 hover:bg-orange-700" onClick={handleAdd}>Adicionar Extra</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-2">
        {extras.map(item => (
          <div
            key={item.id}
            className="p-3 rounded-xl border bg-card flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100 text-orange-600">
                <Package className="h-4 w-4" />
              </div>
              <div>
                <p className="font-bold text-sm">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {currency} {item.price.toFixed(2)}
                </p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => handleDelete(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {extras.length === 0 && !isAdding && (
          <p className="text-sm text-center text-muted-foreground py-4 italic">Nenhum item extra adicionado.</p>
        )}
      </div>
    </div>
  );
};

export default ExtraManager;