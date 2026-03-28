"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';

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
          <Layers className="h-5 w-5" /> Filamentos
        </h3>
        <Button variant="outline" size="sm" onClick={() => setIsAdding(!isAdding)}>
          {isAdding ? 'Cancelar' : <><Plus className="h-4 w-4 mr-1" /> Adicionar</>}
        </Button>
      </div>

      {isAdding && (
        <Card className="bg-muted/50">
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
                <Label>Preço do Carretel ({currency})</Label>
                <Input 
                  type="number" 
                  value={newFilament.price} 
                  onChange={e => setNewFilament({...newFilament, price: Number(e.target.value)})}
                />
              </div>
            </div>
            <Button className="w-full" onClick={handleAdd}>Salvar Filamento</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-2">
        {filaments.map(filament => (
          <div
            key={filament.id}
            onClick={() => onSelect(filament.id)}
            className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
              selectedId === filament.id 
                ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                : 'hover:bg-muted'
            }`}
          >
            <div>
              <p className="font-medium">{filament.name}</p>
              <p className="text-xs text-muted-foreground">
                {filament.weightGrams}g • {currency}{filament.price} ({currency}{(filament.price / filament.weightGrams).toFixed(3)}/g)
              </p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={(e) => handleDelete(filament.id, e)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
        {filaments.length === 0 && !isAdding && (
          <p className="text-sm text-center text-muted-foreground py-4">Nenhum filamento cadastrado.</p>
        )}
      </div>
    </div>
  );
};

export default FilamentManager;