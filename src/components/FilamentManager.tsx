"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Layers, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Filament {
  id: string;
  name: string;
  weightGrams: number;
  price: number;
}

interface FilamentManagerProps {
  filaments: Filament[];
  onUpdate: (filaments: Filament[]) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  currency: string;
}

const FilamentManager = ({ filaments, onUpdate, selectedId, onSelect, currency }: FilamentManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newFilament, setNewFilament] = useState<Partial<Filament>>({
    name: '',
    weightGrams: 1000,
    price: 90
  });

  const handleAdd = () => {
    if (!newFilament.name) return;
    const filament: Filament = {
      id: crypto.randomUUID(),
      name: newFilament.name,
      weightGrams: Number(newFilament.weightGrams) || 1,
      price: Number(newFilament.price) || 0,
    };
    onUpdate([...filaments, filament]);
    setNewFilament({ name: '', weightGrams: 1000, price: 90 });
    setIsAdding(false);
    if (filaments.length === 0) onSelect(filament.id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(filaments.filter(f => f.id !== id));
    if (selectedId === id) onSelect('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Layers className="h-5 w-5 text-purple-500" /> Filamentos
        </h3>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancelar' : <><Plus className="h-4 w-4 mr-1" /> Adicionar</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Nome do Filamento</Label>
                <Input 
                  value={newFilament.name} 
                  onChange={e => setNewFilament({...newFilament, name: e.target.value})}
                  placeholder="Ex: PLA Preto Bambu"
                />
              </div>
              <div>
                <Label>Peso (g)</Label>
                <Input 
                  type="number" 
                  value={newFilament.weightGrams} 
                  onChange={e => setNewFilament({...newFilament, weightGrams: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>Preço ({currency})</Label>
                <Input 
                  type="number" 
                  value={newFilament.price} 
                  onChange={e => setNewFilament({...newFilament, price: Number(e.target.value)})}
                />
              </div>
            </div>
            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleAdd}>Salvar Filamento</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {filaments.map(filament => {
          const isSelected = selectedId === filament.id;
          return (
            <div
              key={filament.id}
              onClick={() => onSelect(filament.id)}
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden",
                isSelected 
                  ? "border-purple-500 bg-purple-50 dark:bg-purple-950/40 ring-4 ring-purple-500/10 shadow-md" 
                  : "border-border bg-card hover:border-purple-200 hover:bg-muted/30"
              )}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 p-1">
                  <CheckCircle2 className="h-4 w-4 text-purple-500" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isSelected ? "bg-purple-500 text-white" : "bg-muted text-muted-foreground group-hover:bg-purple-100 group-hover:text-purple-600"
                )}>
                  <Layers className="h-5 w-5" />
                </div>
                <div>
                  <p className={cn("font-bold", isSelected ? "text-purple-700 dark:text-purple-300" : "text-foreground")}>
                    {filament.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {filament.weightGrams}g • {currency}{filament.price}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(filament.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
        {filaments.length === 0 && !isAdding && (
          <p className="text-sm text-center text-muted-foreground py-4 italic">Nenhum filamento cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default FilamentManager;