"use client";

import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AddStandardDialog() {
  const id = useId();
  const [standardNumber, setStandardNumber] = useState("");
  const [standardName, setStandardName] = useState("");
  const [description, setDescription] = useState("");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="secondary" className="text-xs">
          Add Standard
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-xl [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-6 py-4 text-base">
            Add New Standard
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Add a new compliance standard by providing standard details.
        </DialogDescription>
        <div className="overflow-y-auto">
          <div className="px-6 pt-4 pb-6">
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`${id}-standard-number`}>Standard Number</Label>
                <Input
                  id={`${id}-standard-number`}
                  placeholder="Enter standard number (e.g., ISO 9001)"
                  type="text"
                  value={standardNumber}
                  onChange={(e) => setStandardNumber(e.target.value)}
                  required
                />
                <div className="rounded-md bg-blue-50 p-3 text-xs">
                  <h4 className="mb-2 font-medium text-blue-700">
                    Standard Number Guidelines
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-blue-600">
                    <li>
                      Use official standard designation (e.g., ISO 9001, IEC
                      60601)
                    </li>
                    <li>
                      Include version/year if applicable (e.g., ISO 13485:2016)
                    </li>
                    <li>Use standard industry notation</li>
                  </ul>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-standard-name`}>Standard Name</Label>
                <Input
                  id={`${id}-standard-name`}
                  placeholder="Enter standard name"
                  type="text"
                  value={standardName}
                  onChange={(e) => setStandardName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`${id}-description`}>Description</Label>
                <Textarea
                  id={`${id}-description`}
                  placeholder="Describe the standard's purpose, scope, and requirements"
                  className="min-h-[100px] resize-none"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="border-t px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button">Add Standard</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
