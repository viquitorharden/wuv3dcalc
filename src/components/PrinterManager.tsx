"use client";

import React, { useState } from 'react';
import { Plus, Trash2, Printer as PrinterIcon, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export interface Printer {
  id: string;
  name: string;
  powerWatts: number;
  price: number;
  lifespanHours: number;
  maintenancePerHour: number;
}

interface PrinterManagerProps {
  printers: Printer[];
  onUpdate: (printers: Printer[]) => void;
  selectedId: string;
  onSelect: (id: string) => void;
  currency: string;
}

const PrinterManager = ({ printers, onUpdate, selectedId, onSelect, currency }: PrinterManagerProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newPrinter, setNewPrinter] = useState<Partial<Printer>>({
    name: '',
    powerWatts: 150,
    price: 1500,
    lifespanHours: 2000,
    maintenancePerHour: 0.05
  });

  const handleAdd = () => {
    if (!newPrinter.name) return;
    const printer: Printer = {
      id: crypto.randomUUID(),
      name: newPrinter.name,
      powerWatts: Number(newPrinter.powerWatts) || 0,
      price: Number(newPrinter.price) || 0,
      lifespanHours: Number(newPrinter.lifespanHours) || 1,
      maintenancePerHour: Number(newPrinter.maintenancePerHour) || 0,
    };
    onUpdate([...printers, printer]);
    setNewPrinter({ name: '', powerWatts: 150, price: 1500, lifespanHours: 2000, maintenancePerHour: 0.05 });
    setIsAdding(false);
    if (printers.length === 0) onSelect(printer.id);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate(printers.filter(p => p.id !== id));
    if (selectedId === id) onSelect('');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <PrinterIcon className="h-5 w-5 text-blue-500" /> Impressoras
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
                <Label>Nome da Impressora</Label>
                <Input 
                  value={newPrinter.name} 
                  onChange={e => setNewPrinter({...newPrinter, name: e.target.value})}
                  placeholder="Ex: Kobra S1"
                />
              </div>
              <div>
                <Label>Consumo (Watts)</Label>
                <Input 
                  type="number" 
                  value={newPrinter.powerWatts} 
                  onChange={e => setNewPrinter({...newPrinter, powerWatts: Number(e.target.value)})}
                />
              </div>
              <div>
                <Label>Preço ({currency})</Label>
                <Input 
                  type="number" 
                  value={newPrinter.price} 
                  onChange={e => setNewPrinter({...newPrinter, price: Number(e.target.value)})}
                />
              </div>
            </div>
            <Button className="w-full bg-blue-600 hover:bg-blue-700" onClick={handleAdd}>Salvar Impressora</Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3">
        {printers.map(printer => {
          const isSelected = selectedId === printer.id;
          return (
            <div
              key={printer.id}
              onClick={() => onSelect(printer.id)}
              className={cn(
                "p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between group relative overflow-hidden",
                isSelected 
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40 ring-4 ring-blue-500/10 shadow-md" 
                  : "border-border bg-card hover:border-blue-200 hover:bg-muted/30"
              )}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 p-1">
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-lg",
                  isSelected ? "bg-blue-500 text-white" : "bg-muted text-muted-foreground group-hover:bg-blue-100 group-hover:text-blue-600"
                )}>
                  <PrinterIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className={cn("font-bold", isSelected ? "text-blue-700 dark:text-blue-300" : "text-foreground")}>
                    {printer.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {printer.powerWatts}W • {currency}{printer.price}
                  </p>
                </div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => handleDelete(printer.id, e)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          );
        })}
        {printers.length === 0 && !isAdding && (
          <p className="text-sm text-center text-muted-foreground py-4 italic">Nenhuma impressora cadastrada.</p>
        )}
      </div>
    </div>
  );
};

export default PrinterManager;