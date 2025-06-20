"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PiPlusBold } from "react-icons/pi";
import { FolderIcon } from "lucide-react";
import { sampleProducts } from "@/app/(app)/products/page";
import { useParams } from "next/navigation";
import { useState } from "react";
import UploadSourceFiles from "@/features/source-files/UploadSourceFiles";

export default function ProductSourceFilesPage() {
  const params = useParams();
  const slug = params.product as string;
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const product = sampleProducts.find((p) => p.productId === slug);

  // For now, we'll assume there are no source files
  const hasSourceFiles = false;

  const handleUploadComplete = () => {
    // This function will be called when upload is complete
    // For now, we'll just close the dialog
    setIsDialogOpen(false);
    // TODO: Refresh the source files list
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full">
      <div className="flex flex-col items-start gap-4 justify-start border border-input bg-background rounded-xl p-4 w-full h-full">
        <div className="flex flex-wrap gap-2 items-center w-full justify-between">
          <div className="flex items-center gap-2">
            <FolderIcon className="w-6 h-6 text-primary" />
            <p className="text-base font-semibold">
              {product?.productName || "Product"} Source Files
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" className="flex items-center gap-2">
                Upload Source File <PiPlusBold />
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <FolderIcon className="w-5 h-5" />
                  Upload Source Files for {product?.productName || "Product"}
                </DialogTitle>
                <DialogDescription>
                  Upload source files for this product. You can drag and drop
                  files or click to browse.
                </DialogDescription>
              </DialogHeader>

              <div className="py-4">
                <UploadSourceFiles />
              </div>

              <DialogFooter className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUploadComplete}>Upload Files</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {!hasSourceFiles && (
          <Card className="w-full h-[calc(100vh-12rem)] flex items-center justify-center bg-background">
            <CardContent className="flex flex-col items-center gap-4 text-muted-foreground">
              <FolderIcon className="w-16 h-16" />
              <p className="text-lg">No source files uploaded yet</p>
              <p className="text-sm">
                Upload your first source file to get started
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
