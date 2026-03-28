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
import { Save } from "lucide-react";

interface SavePrintDialogProps {
  onSave: (name: string) => void;
}

const SavePrintDialog = ({ onSave }: SavePrintDialogProps) => {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name);
    setName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 gap-2">
          <Save className="h-4 w-4" /> Salvar Impressão
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-width-[425px]">
        <DialogHeader>
          <DialogTitle>Salvar Configuração</DialogTitle>
          <DialogDescription>
            Dê um nome para identificar esta impressão no seu histórico.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome do Projeto</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Vaso Articulado - Lote 20"
              autoFocus
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={!name.trim()}>Confirmar e Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavePrintDialog;