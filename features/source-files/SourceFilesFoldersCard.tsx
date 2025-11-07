import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FolderIcon } from "lucide-react";
import { PiPlusBold, PiBookmarkSimpleDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useToggleBookmarkSourceFilesFolder } from "@/hooks/source-files/useToggleBookmarkSourceFilesFolder";
import DialogDeleteSourceFilesFolder from "@/features/source-files/DialogDeleteSourceFilesFolder";

interface SourceFilesFolder {
  _id: string;
  name: string;
  product_id: string;
  created_at?: string;
}

interface SourceFilesFoldersCardProps {
  folders: SourceFilesFolder[];
}

function SourceFilesFoldersCard({ folders }: SourceFilesFoldersCardProps) {
  const router = useRouter();
  const toggleBookmark = useToggleBookmarkSourceFilesFolder();
  const userId = "68a1cf8c2cb63e45ad511688";

  return (
    <div className="w-full h-full">
      {folders?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 auto-rows-max">
          {folders?.map((folder) => (
            <div
              key={folder._id}
              className="relative flex flex-col w-full max-w-xs rounded-2xl"
            >
              <div className="absolute top-2 right-2 flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Toggle bookmark folder"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark.mutate({ folderId: folder._id, userId });
                  }}
                  disabled={toggleBookmark.isPending}
                  title="Bookmark folder"
                >
                  <PiBookmarkSimpleDuotone className="h-5 w-5" />
                </Button>
                <div onClick={(e) => e.stopPropagation()}>
                  <DialogDeleteSourceFilesFolder
                    id={folder._id}
                    folderName={folder.name}
                  />
                </div>
              </div>
              <Card
                className="cursor-pointer shadow-none hover:bg-muted/50 transition-colors w-full"
                onClick={() => router.push(`/source-files/view/${folder._id}`)}
              >
                <CardContent className="p-4 flex flex-row items-center gap-3">
                  <div className="w-16 h-16 rounded-lg bg-muted border border-input flex items-center justify-center">
                    <FolderIcon className="w-10 h-10 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-sm mb-1 truncate">
                      {folder.name}
                    </p>
                    {/* <p className="text-xs text-muted-foreground truncate">
                      Product ID: {folder.product_id}
                    </p> */}
                    {folder.created_at && (
                      <p className="text-xs text-muted-foreground">
                        Created:{" "}
                        {new Date(folder.created_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center w-full h-100">
          <p className="text-base md:text-xl font-semibold text-foreground">
            There are no source files folders to display. Create your first
            folder
          </p>
          <Button variant="default" className="flex items-center gap-2">
            Create new Folder <PiPlusBold />
          </Button>
        </div>
      )}
    </div>
  );
}

export default SourceFilesFoldersCard;
