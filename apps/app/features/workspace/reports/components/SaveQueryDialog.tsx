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
import {
  SaveIcon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { Icon } from "@uprevit/ui/components/common/Icon";

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
      <DialogContent className="p-4 sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon={SaveIcon} size={18} strokeWidth={2} />
            Save Query
          </DialogTitle>
          <DialogDescription>
            Save your current query conditions for later use.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <div className="flex items-start gap-2 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
            <Icon
              icon={InformationCircleIcon}
              size={16}
              strokeWidth={2}
              className="mt-0.5 shrink-0 text-blue-500"
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
