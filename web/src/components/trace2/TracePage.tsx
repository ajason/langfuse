import { StringParam, useQueryParam, withDefault } from "use-query-params";
import { PublishTraceSwitch } from "@/src/components/publish-object-switch";
import { DetailPageNav } from "@/src/features/navigate-detail-pages/DetailPageNav";
import { useRouter } from "next/router";
import { api } from "@/src/utils/api";
import { StarTraceDetailsToggle } from "@/src/components/star-toggle";
import { ErrorPage } from "@/src/components/error-page";
import { DeleteTraceButton } from "@/src/components/deleteButton";
import Page from "@/src/components/layouts/page";
import { Trace } from "@/src/components/trace2/Trace";
<<<<<<< HEAD
import { useSession } from "next-auth/react";
import { useIsAuthenticatedAndProjectMember } from "@/src/features/auth/hooks";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";
import { stripBasePath } from "@/src/utils/redirect";
import { Badge } from "@/src/components/ui/badge";
=======
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))

export function TracePage({
  traceId,
  timestamp,
}: {
  traceId: string;
  timestamp?: Date;
}) {
  const router = useRouter();
<<<<<<< HEAD
  const session = useSession();
  const routeProjectId = (router.query.projectId as string) ?? "";
=======
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))

  const trace = api.traces.byIdWithObservationsAndScores.useQuery(
    {
      traceId,
      timestamp,
<<<<<<< HEAD
      projectId: routeProjectId,
=======
      projectId: router.query.projectId as string,
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
    },
    {
      retry(failureCount, error) {
        if (
          error.data?.code === "UNAUTHORIZED" ||
          error.data?.code === "NOT_FOUND"
        )
          return false;
        return failureCount < 3;
      },
    },
  );

<<<<<<< HEAD
  const projectIdForAccessCheck = trace.data?.projectId ?? routeProjectId;
  const hasProjectAccess = useIsAuthenticatedAndProjectMember(
    projectIdForAccessCheck,
  );

=======
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
  const [selectedTab, setSelectedTab] = useQueryParam(
    "display",
    withDefault(StringParam, "details"),
  );

  if (trace.error?.data?.code === "UNAUTHORIZED")
    return <ErrorPage message="You do not have access to this trace." />;

  if (trace.error?.data?.code === "NOT_FOUND")
    return (
      <ErrorPage
        title="Trace not found"
        message="The trace is either still being processed or has been deleted."
        additionalButton={{
          label: "Retry",
          onClick: () => void window.location.reload(),
        }}
      />
    );

  if (!trace.data) return <div className="p-3">Loading...</div>;

<<<<<<< HEAD
  const isSharedTrace = trace.data.public;
  const showPublicIndicators = isSharedTrace && !hasProjectAccess;
  const encodedTargetPath = encodeURIComponent(
    stripBasePath(router.asPath || "/"),
  );
  const leadingControl = showPublicIndicators ? (
    session.status === "authenticated" ? (
      <Button
        asChild
        size="sm"
        variant="outline"
        title="Back to Langfuse"
        className="px-3"
      >
        <Link href="/">Langfuse</Link>
      </Button>
    ) : (
      <Button
        asChild
        size="sm"
        variant="default"
        title="Sign in to Langfuse"
        className="px-3"
      >
        <Link href={`/auth/sign-in?targetPath=${encodedTargetPath}`}>
          Sign in
        </Link>
      </Button>
    )
  ) : undefined;
  const sharedBadge = showPublicIndicators ? (
    <Badge variant="outline" className="text-xs font-medium">
      Public
    </Badge>
  ) : undefined;

=======
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
  return (
    <Page
      headerProps={{
        title: trace.data.name
          ? `${trace.data.name}: ${trace.data.id}`
          : trace.data.id,
        itemType: "TRACE",
        breadcrumb: [
          {
            name: "Traces",
            href: `/project/${router.query.projectId as string}/traces`,
          },
        ],
<<<<<<< HEAD
        showSidebarTrigger: !showPublicIndicators,
        leadingControl,
        breadcrumbBadges: sharedBadge,
=======
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
        actionButtonsLeft: (
          <div className="ml-1 flex items-center gap-1">
            <div className="flex items-center gap-0">
              <StarTraceDetailsToggle
                traceId={trace.data.id}
                projectId={trace.data.projectId}
                value={trace.data.bookmarked}
                size="icon-xs"
              />
              <PublishTraceSwitch
                traceId={trace.data.id}
                projectId={trace.data.projectId}
                isPublic={trace.data.public}
                size="icon-xs"
              />
            </div>
          </div>
        ),
        actionButtonsRight: (
          <>
            <DetailPageNav
              currentId={traceId}
              path={(entry) => {
                const { view, display, projectId } = router.query;
                const queryParams = new URLSearchParams({
                  ...(typeof view === "string" ? { view } : {}),
                  ...(typeof display === "string" ? { display } : {}),
                });
                const timestamp =
                  entry.params && entry.params.timestamp
                    ? encodeURIComponent(entry.params.timestamp)
                    : undefined;

                if (timestamp) {
                  queryParams.set("timestamp", timestamp);
                }

                const finalQueryString = queryParams.size
                  ? `?${queryParams.toString()}`
                  : "";

<<<<<<< HEAD
                return `/project/${projectId as string}/traces/${entry.id}${finalQueryString}`;
=======
                return `/project/${projectId as string}/traces2/${entry.id}${finalQueryString}`;
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
              }}
              listKey="traces"
            />
            <DeleteTraceButton
              itemId={traceId}
              projectId={trace.data.projectId}
              redirectUrl={`/project/${router.query.projectId as string}/traces`}
              deleteConfirmation={trace.data.name ?? ""}
              icon
            />
          </>
        ),
      }}
    >
      <div className="flex max-h-full min-h-0 flex-1 overflow-hidden">
        <Trace
          trace={trace.data}
          scores={trace.data.scores}
          projectId={trace.data.projectId}
          observations={trace.data.observations}
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          context={router.query.peek !== undefined ? "peek" : "fullscreen"}
        />
      </div>
    </Page>
  );
}
