"use client";

import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Eye, Calendar, Package, Clock, Weight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from '@/components/ui/separator';

export interface SavedPrint {
  id: string;
  name: string;
  date: string;
  currency: string;
  inputs: {
    jobGrams: number;
    jobHours: number;
    jobMinutes: number;
    quantity: number;
    profitMargin: number;
  };
  results: {
    subtotal: number;
    suggestedPrice: number;
  };
}

interface SavedPrintsManagerProps {
  prints: SavedPrint[];
  onDelete: (id: string) => void;
  currency: string;
}

const SavedPrintsManager = ({ prints, onDelete, currency }: SavedPrintsManagerProps) => {
  const [selectedPrint, setSelectedPrint] = useState<SavedPrint | null>(null);

  const format = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-4">
      {prints.length === 0 ? (
        <div className="text-center py-12 bg-muted/20 rounded-2xl border-2 border-dashed">
          <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <p className="text-muted-foreground">Nenhuma impressão salva ainda.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {prints.map((print) => (
            <Card key={print.id} className="group hover:border-primary/50 transition-colors cursor-pointer" onClick={() => setSelectedPrint(print)}>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-xl text-primary">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight">{print.name}</h4>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(print.date).toLocaleDateString()}</span>
                      <span>•</span>
                      <span className="font-bold text-green-600 dark:text-green-400">{currency} {format(print.results.suggestedPrice)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(print.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!selectedPrint} onOpenChange={(open) => !open && setSelectedPrint(null)}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedPrint && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">{selectedPrint.name}</DialogTitle>
                <p className="text-sm text-muted-foreground">Salvo em {new Date(selectedPrint.date).toLocaleString()}</p>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-4 py-4">
                <div className="bg-muted/50 p-4 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Peso Total</p>
                  <div className="flex items-center gap-2">
                    <Weight className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">{selectedPrint.inputs.jobGrams}g</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Tempo Total</p>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">{selectedPrint.inputs.jobHours}h {selectedPrint.inputs.jobMinutes}m</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Quantidade</p>
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-lg font-bold">{selectedPrint.inputs.quantity} un.</span>
                  </div>
                </div>
                <div className="bg-muted/50 p-4 rounded-xl space-y-1">
                  <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Margem</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">{selectedPrint.inputs.profitMargin}%</span>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4 pt-2">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Custo de Produção:</span>
                  <span className="font-bold">{currency} {format(selectedPrint.results.subtotal)}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-green-50 dark:bg-green-950/30 rounded-xl border border-green-100 dark:border-green-900">
                  <span className="font-bold text-green-800 dark:text-green-300">Preço Sugerido:</span>
                  <span className="text-2xl font-black text-green-600 dark:text-green-400">{currency} {format(selectedPrint.results.suggestedPrice)}</span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SavedPrintsManager;