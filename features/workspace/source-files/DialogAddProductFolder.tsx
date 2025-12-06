import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useAddSourceFilesFolder } from "@/hooks/source-files/useAddSourceFilesFolder";
import {
  PiPlusCircleDuotone,
  PiXCircleDuotone,
  PiFolderPlusDuotone,
} from "react-icons/pi";

interface FormValues {
  folderName: string;
}

export default function DialogAddProductFolder({
  parentId,
  folderId,
}: {
  parentId?: string;
  folderId?: string;
}) {
  const { mutate: addSourceFilesFolder, isPending } =
    useAddSourceFilesFolder(folderId);
  const [open, setOpen] = useState(false);
  const auth = useAuth();
  const workspaceId = auth?.user?.profile?.workspaceId;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      folderName: "",
    },
    mode: "onSubmit",
  });

  const folderName = watch("folderName");

  const onSubmit: SubmitHandler<FormValues> = (data) => {
    const sourceFilesFolderData = {
      workspace_id: workspaceId as string,
      name: data.folderName,
      type: "folder",
      parentId: parentId,
    };

    addSourceFilesFolder(sourceFilesFolderData, {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
      onError: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <PiFolderPlusDuotone className="w-5 h-5" />
          Add Folder
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b px-4 py-4 text-sm bg-accent flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
              <PiFolderPlusDuotone className="w-5 h-5 text-muted-foreground" />
              <p>Add New Folder</p>
            </div>
            <DialogClose asChild>
              <button type="button" className="cursor-pointer">
                <PiXCircleDuotone size={18} />
              </button>
            </DialogClose>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Enter a name for the new folder in your source files.
          </DialogDescription>
        </DialogHeader>

        <form
          id="add-folder-form"
          className="overflow-y-auto"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)(e);
          }}
        >
          <div className="space-y-4 p-4">
            <div className="space-y-2">
              <Label htmlFor="folderName" className="text-sm font-medium">
                Folder Name
              </Label>
              <Input
                id="folderName"
                placeholder="e.g. 'Marketing Materials'"
                {...register("folderName", {
                  required: "Folder name is required.",
                })}
              />
              {errors.folderName && (
                <p className="text-xs text-destructive">
                  {errors.folderName.message}
                </p>
              )}
            </div>
          </div>
        </form>
        <DialogFooter className="border-t border-border bg-muted/10 px-4 py-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary" size="sm">
              <PiXCircleDuotone className="mr-2" />
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            size="sm"
            form="add-folder-form"
            disabled={!folderName || isPending}
          >
            {isPending ? (
              <>
                <PiPlusCircleDuotone className="animate-spin mr-2" />
                Adding...
              </>
            ) : (
              <>
                <PiPlusCircleDuotone className="mr-2" />
                Add Folder
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
