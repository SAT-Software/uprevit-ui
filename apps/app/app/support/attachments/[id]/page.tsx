"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAuth } from "react-oidc-context";
import {
  AlertCircleIcon,
  Image01Icon,
  LockIcon,
  Login01Icon,
  RefreshIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "@uprevit/ui/components/common/Icon";
import { Button } from "@uprevit/ui/components/ui/button";
import { Spinner } from "@uprevit/ui/components/ui/spinner";
import {
  SupportAttachmentError,
  useGetSupportAttachment,
} from "@/hooks/support/useGetSupportAttachment";
import { stopSupportReplay } from "@/lib/posthog/support";
import { formatToLocalDateTime } from "@/utils/formatDateAndTimeLocal";
import { isSupportAttachmentId } from "@/utils/supportReturnPath";

function ViewerMessage({
  icon,
  title,
  description,
  action,
}: {
  icon: IconSvgElement;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md rounded-xl border border-border bg-muted/30 p-6 text-center shadow-sm">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full border bg-background text-muted-foreground">
        <Icon icon={icon} size={24} strokeWidth={2} />
      </div>
      <h1 className="text-lg font-semibold">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}

export default function SupportAttachmentPage() {
  const { id } = useParams<{ id: string }>();
  const auth = useAuth();
  const validId = isSupportAttachmentId(id);
  const { data, error, isLoading, isFetching, refetch } =
    useGetSupportAttachment(validId ? id : "");
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    stopSupportReplay();
  }, []);

  const signIn = () =>
    auth.signinRedirect({ state: { supportReturnTo: `/support/attachments/${id}` } });

  const reload = () => {
    setImageFailed(false);
    void refetch();
  };

  const signInAction = (
    <Button onClick={signIn}>
      <Icon icon={Login01Icon} size={16} strokeWidth={2} />
      Sign in
    </Button>
  );

  let content: React.ReactNode;

  if (!validId) {
    content = (
      <ViewerMessage
        icon={Image01Icon}
        title="Screenshot not found"
        description="This link is not a valid support screenshot link."
      />
    );
  } else if (auth.isLoading || (auth.isAuthenticated && isLoading)) {
    content = <Spinner className="size-6" />;
  } else if (!auth.isAuthenticated) {
    content = (
      <ViewerMessage
        icon={LockIcon}
        title="Sign in to view this screenshot"
        description="Support screenshots are only visible to the Uprevit support team."
        action={signInAction}
      />
    );
  } else if (error) {
    const status = error instanceof SupportAttachmentError ? error.status : 0;
    content =
      status === 401 ? (
        <ViewerMessage
          icon={LockIcon}
          title="Your session has expired"
          description="Sign in again to view this screenshot."
          action={signInAction}
        />
      ) : status === 403 ? (
        <ViewerMessage
          icon={LockIcon}
          title="You don't have access"
          description="Support screenshots are only visible to the Uprevit support team."
        />
      ) : status === 404 ? (
        <ViewerMessage
          icon={Image01Icon}
          title="Screenshot not found"
          description="This screenshot does not exist or was never uploaded."
        />
      ) : (
        <ViewerMessage
          icon={AlertCircleIcon}
          title="Could not load the screenshot"
          description="Please try again in a moment."
          action={
            <Button variant="outline" onClick={reload} disabled={isFetching}>
              <Icon icon={RefreshIcon} size={16} strokeWidth={2} />
              Try again
            </Button>
          }
        />
      );
  } else if (data) {
    content = (
      <div className="flex w-full max-w-5xl flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
          <span>
            Support screenshot
            {data.uploadedAt ? ` · uploaded ${formatToLocalDateTime(data.uploadedAt)}` : ""}
          </span>
          <Button variant="outline" size="sm" onClick={reload} disabled={isFetching}>
            <Icon icon={RefreshIcon} size={14} strokeWidth={2} />
            Reload
          </Button>
        </div>
        {imageFailed ? (
          <ViewerMessage
            icon={AlertCircleIcon}
            title="This view link has expired"
            description="Screenshot links are short-lived. Reload to view it again."
            action={
              <Button variant="outline" onClick={reload} disabled={isFetching}>
                <Icon icon={RefreshIcon} size={16} strokeWidth={2} />
                Reload
              </Button>
            }
          />
        ) : (
          <div className="ph-no-capture relative h-[75vh] w-full overflow-hidden rounded-xl border border-border bg-muted/30">
            <Image
              key={data.url}
              src={data.url}
              alt="Support screenshot"
              fill
              unoptimized
              referrerPolicy="no-referrer"
              className="object-contain"
              onError={() => setImageFailed(true)}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-background px-6 py-10">
      {content}
    </main>
  );
}
