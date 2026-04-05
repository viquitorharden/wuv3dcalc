"use client";

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText } from "lucide-react";
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface BudgetGeneratorProps {
  results: {
    suggestedPrice: number;
    quantity: number;
  };
  currency: string;
}

const BudgetGenerator = ({ results, currency }: BudgetGeneratorProps) => {
  const [itemName, setItemName] = useState("");
  const [open, setOpen] = useState(false);

  const format = (val: number) => val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  const generatePDF = () => {
    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('pt-BR');
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("ORÇAMENTO DE IMPRESSÃO 3D", 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`WUV STUDIOS`, 20, 35);
    doc.text(`Data: ${date}`, 190, 35, { align: 'right' });
    
    doc.setLineWidth(0.5);
    doc.line(20, 40, 190, 40);

    // Content
    doc.setFontSize(14);
    doc.text("Detalhes do Item:", 20, 55);
    
    autoTable(doc, {
      startY: 60,
      head: [['Descrição', 'Quantidade', 'Valor Unitário', 'Valor Total']],
      body: [
        [
          itemName || "Item de Impressão 3D",
          `${results.quantity} un.`,
          `${currency} ${format(results.suggestedPrice / results.quantity)}`,
          `${currency} ${format(results.suggestedPrice)}`
        ]
      ],
      theme: 'striped',
      headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Total Section
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text(`VALOR TOTAL: ${currency} ${format(results.suggestedPrice)}`, 190, finalY + 10, { align: 'right' });

    // Footer
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text("Este orçamento é válido por 7 dias.", 105, 280, { align: 'center' });
    doc.text("Gerado por WUV Studios - Calculadora 3D", 105, 285, { align: 'center' });

    doc.save(`Orcamento_${itemName.replace(/\s+/g, '_') || 'WUV_Studios'}.pdf`);
    setOpen(false);
    setItemName("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full mt-2 border-primary text-primary hover:bg-primary/5 gap-2">
          <FileText className="h-4 w-4" /> Gerar Orçamento (PDF)
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Gerar Orçamento</DialogTitle>
          <DialogDescription>
            Insira o nome do item para aparecer no documento PDF.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="budget-name">Nome do Item / Projeto</Label>
            <Input
              id="budget-name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="Ex: Vaso Decorativo Geométrico"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={generatePDF} disabled={!itemName.trim()}>Baixar PDF</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BudgetGenerator;