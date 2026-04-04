"use client";

import { useState, useMemo, useCallback } from "react";
import { Button } from "@uprevit/ui/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@uprevit/ui/components/ui/dialog";
import { Input } from "@uprevit/ui/components/ui/input";
import { Label } from "@uprevit/ui/components/ui/label";

interface FindReplaceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cellData: Record<string, string>;
  onReplace: (updatedCells: Record<string, string>) => void;
}

export function FindReplaceDialog({
  open,
  onOpenChange,
  cellData,
  onReplace,
}: FindReplaceDialogProps) {
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");

  const matches = useMemo(() => {
    if (!findText.trim()) return [];
    const searchTerm = findText.toLowerCase();
    return Object.entries(cellData)
      .filter(([, value]) => value.toLowerCase().includes(searchTerm))
      .map(([key]) => key);
  }, [cellData, findText]);

  const handleReplaceAll = useCallback(() => {
    if (matches.length === 0) return;

    const searchTerm = findText.toLowerCase();
    const updated = { ...cellData };

    matches.forEach((key) => {
      const currentValue = updated[key];
      const regex = new RegExp(
        findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "gi"
      );
      updated[key] = currentValue.replace(regex, replaceText);
    });

    onReplace(updated);
    onOpenChange(false);
    setFindText("");
    setReplaceText("");
  }, [matches, findText, replaceText, cellData, onReplace, onOpenChange]);

  const handleClose = () => {
    onOpenChange(false);
    setFindText("");
    setReplaceText("");
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Find & Replace</DialogTitle>
          <DialogDescription>
            Search and replace text across all cells in the table.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="find">Find</Label>
            <Input
              id="find"
              placeholder="Text to find..."
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              autoFocus
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="replace">Replace with</Label>
            <Input
              id="replace"
              placeholder="Replacement text..."
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
            />
          </div>

          {findText.trim() && (
            <p className="text-sm text-muted-foreground">
              {matches.length === 0
                ? "No matches found"
                : `${matches.length} cell${
                    matches.length === 1 ? "" : "s"
                  } found with matching text`}
            </p>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleReplaceAll} disabled={matches.length === 0}>
            Replace All
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
