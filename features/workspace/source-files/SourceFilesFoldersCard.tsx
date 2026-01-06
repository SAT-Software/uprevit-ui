import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PiPlusBold, PiBookmarkSimpleDuotone, PiFolderDuotone } from "react-icons/pi";
import { useRouter } from "next/navigation";
import { useToggleBookmarkSourceFilesFolder } from "@/hooks/source-files/useToggleBookmarkSourceFilesFolder";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

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
  const { mutate: toggleBookmark } = useToggleBookmarkSourceFilesFolder();
  const auth = useAuth();
  const userId = auth?.user?.profile?.userId;
  const [pendingFolderId, setPendingFolderId] = useState<string | null>(null);

  return (
    <div className="w-full h-full">
      {folders?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-2 auto-rows-max">
          {folders?.map((folder) => (
            <div
              key={folder._id}
              className="relative flex flex-col w-full max-w-xs rounded-xl"
            >
              <Card
                className="cursor-pointer shadow-none hover:bg-muted/50 transition-colors w-full border-border"
                onClick={() => router.push(`/source-files/view/${folder._id}`)}
              >
                <CardContent className="p-2 flex flex-row items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-muted border border-border flex items-center justify-center">
                      <FolderIcon className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-sm leading-tight line-clamp-2">
                        {folder.name}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      aria-label="Toggle bookmark folder"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (userId) {
                          setPendingFolderId(folder._id);
                          toggleBookmark(
                            {
                              folderId: folder._id,
                              userId: userId as string,
                            },
                            {
                              onSettled: () => setPendingFolderId(null),
                            }
                          );
                        } else {
                          toast.error(
                            "User ID not available. Please log in again."
                          );
                        }
                      }}
                      disabled={pendingFolderId === folder._id}
                      title="Bookmark folder"
                    >
                      {pendingFolderId === folder._id ? (
                        <Spinner />
                      ) : (
                        <PiBookmarkSimpleDuotone className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center w-full h-100">
          <p className="text-base md:text-lg font-normal text-muted-foreground">
            There are no source files folders to display. Create your first
            folder
          </p>
        </div>
      )}
    </div>
  );
}
export default SourceFilesFoldersCard;
