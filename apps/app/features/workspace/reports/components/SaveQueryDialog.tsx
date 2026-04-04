"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Button } from "@uprevit/ui/components/ui/button";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";
import { PiFloppyDiskDuotone, PiInfoDuotone } from "react-icons/pi";

interface SaveQueryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (name: string) => void;
  isConditionsEmpty: boolean;
}

export function SaveQueryDialog({
  open,
  onOpenChange,
  onSave,
  isConditionsEmpty,
}: SaveQueryDialogProps) {
  const [name, setName] = useState("");

  const handleSave = () => {
    if (name.trim()) {
      onSave(name.trim());
      setName("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[400px] p-4">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <PiFloppyDiskDuotone size={20} />
            Save Query
          </DialogTitle>
          <DialogDescription>
            Save your current query conditions for later use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          {/* Info Banner */}
          <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
            <PiInfoDuotone
              size={18}
              className="text-blue-500 shrink-0 mt-0.5"
            />
            <p className="text-xs text-blue-600">
              Saved queries are stored locally in your browser. They will not
              sync across devices and may be lost if you clear browser data.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="query-name">Query Name</Label>
            <Input
              id="query-name"
              placeholder="e.g., OUS Products with CE Marking"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={!name.trim() || isConditionsEmpty}
          >
            Save Query
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
