/**
 * TraceDetailView - Shows trace-level details when no observation is selected
 */

import { type TraceDomain, type ScoreDomain } from "@langfuse/shared";
import { type ObservationReturnTypeWithMetadata } from "@/src/server/api/routers/traces";
import { type WithStringifiedMetadata } from "@/src/utils/clientSideDomainTypes";
import {
  TabsBar,
  TabsBarContent,
  TabsBarList,
  TabsBarTrigger,
} from "@/src/components/ui/tabs-bar";
import { Tabs, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
<<<<<<< HEAD
import { useMemo, useState } from "react";
=======
import useLocalStorage from "@/src/components/useLocalStorage";
import { useEffect, useMemo, useState } from "react";
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/ui/tooltip";
<<<<<<< HEAD
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/src/components/ui/hover-card";
=======
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))

// Preview tab components
import { IOPreview } from "@/src/components/trace2/components/IOPreview/IOPreview";
import { PrettyJsonView } from "@/src/components/ui/PrettyJsonView";
import TagList from "@/src/features/tag/components/TagList";
import { useJsonExpansion } from "@/src/components/trace2/contexts/JsonExpansionContext";
import { useMedia } from "@/src/components/trace2/api/useMedia";

// Contexts and hooks
import { useTraceData } from "@/src/components/trace2/contexts/TraceDataContext";
import { useViewPreferences } from "@/src/components/trace2/contexts/ViewPreferencesContext";
<<<<<<< HEAD
import { useSelection } from "@/src/components/trace2/contexts/SelectionContext";
import { useIsAuthenticatedAndProjectMember } from "@/src/features/auth/hooks";
// Extracted components
import { TraceDetailViewHeader } from "./TraceDetailViewHeader";
import { TraceLogView } from "../TraceLogView/TraceLogView";
import { TRACE_VIEW_CONFIG } from "@/src/components/trace2/config/trace-view-config";
=======
import { useIsAuthenticatedAndProjectMember } from "@/src/features/auth/hooks";
import {
  useLogViewConfirmation,
  LOG_VIEW_DISABLED_THRESHOLD,
} from "@/src/components/trace2/components/TraceLogView/useLogViewConfirmation";

// Extracted components
import { TraceDetailViewHeader } from "./TraceDetailViewHeader";
import { TraceLogViewConfirmationDialog } from "../TraceLogView/TraceLogViewConfirmationDialog";
import { TraceLogView } from "../TraceLogView/TraceLogView";
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
import ScoresTable from "@/src/components/table/use-cases/scores";

export interface TraceDetailViewProps {
  trace: Omit<WithStringifiedMetadata<TraceDomain>, "input" | "output"> & {
    latency?: number;
    input: string | null;
    output: string | null;
  };
  observations: ObservationReturnTypeWithMetadata[];
  scores: WithStringifiedMetadata<ScoreDomain>[];
  projectId: string;
}

export function TraceDetailView({
  trace,
  observations,
  scores,
  projectId,
}: TraceDetailViewProps) {
<<<<<<< HEAD
  // Tab and view state from URL (via SelectionContext)
  const { selectedTab, setSelectedTab, viewPref, setViewPref } = useSelection();
  const [isPrettyViewAvailable, setIsPrettyViewAvailable] = useState(true);

  // Map viewPref to currentView format expected by child components
  const currentView = viewPref === "json" ? "json" : "pretty";

=======
  // Tab and view state
  const [selectedTab, setSelectedTab] = useState<"preview" | "log" | "scores">(
    "preview",
  );
  const [currentView, setCurrentView] = useLocalStorage<"pretty" | "json">(
    "jsonViewPreference",
    "pretty",
  );
  const [isPrettyViewAvailable, setIsPrettyViewAvailable] = useState(true);

<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
  // Context hooks
  const { comments } = useTraceData();
  const { expansionState, setFieldExpansion } = useJsonExpansion();

  // Data fetching
  const traceMedia = useMedia({ projectId, traceId: trace.id });

  // Derived state
  const traceScores = useMemo(
    () => scores.filter((s) => !s.observationId),
    [scores],
  );

<<<<<<< HEAD
  const showLogViewTab = observations.length > 0;

  // Check if log view will be virtualized (affects JSON tab availability)
  const isLogViewVirtualized =
    observations.length >= TRACE_VIEW_CONFIG.logView.virtualizationThreshold;
=======
  // Log view confirmation logic
  const logViewConfirmation = useLogViewConfirmation({
    observationCount: observations.length,
    traceId: trace.id,
  });

  const showLogViewTab = observations.length > 0;

  // Auto-redirect from invalid tab state
  useEffect(() => {
    if (
      (logViewConfirmation.isDisabled || !showLogViewTab) &&
      selectedTab === "log"
    ) {
      setSelectedTab("preview");
    }
  }, [logViewConfirmation.isDisabled, showLogViewTab, selectedTab]);
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))

  // Scores tab visibility: hide for public trace viewers and in peek mode (annotation queues)
  const { isPeekMode } = useViewPreferences();
  const isAuthenticatedAndProjectMember =
    useIsAuthenticatedAndProjectMember(projectId);
  const showScoresTab = isAuthenticatedAndProjectMember && !isPeekMode;

<<<<<<< HEAD
  // Handle tab change
  const handleTabChange = (value: string) => {
    setSelectedTab(value as "preview" | "log" | "scores");
  };

=======
  // Handle tab change with log view confirmation
  const handleTabChange = (value: string) => {
    if (value === "log") {
      const canProceed = logViewConfirmation.attemptLogView();
      if (!canProceed) return;
    }
    setSelectedTab(value as "preview" | "log" | "scores");
  };

  // Handle log view confirmation
  const handleLogViewConfirm = () => {
    logViewConfirmation.confirmLogView();
    setSelectedTab("log");
  };

<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header section (extracted component) */}
      <TraceDetailViewHeader
        trace={trace}
        projectId={projectId}
        traceScores={traceScores}
        commentCount={comments.get(trace.id)}
      />

      {/* Tabs section */}
      <TabsBar
        value={selectedTab}
        className="flex min-h-0 flex-1 flex-col overflow-hidden"
        onValueChange={handleTabChange}
      >
        <TooltipProvider>
          <TabsBarList>
            <TabsBarTrigger value="preview">Preview</TabsBarTrigger>
            {showLogViewTab && (
<<<<<<< HEAD
              <TabsBarTrigger value="log">
=======
              <TabsBarTrigger
                value="log"
                disabled={logViewConfirmation.isDisabled}
              >
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>Log View</span>
                  </TooltipTrigger>
                  <TooltipContent className="text-xs">
<<<<<<< HEAD
                    {isLogViewVirtualized
                      ? `Shows all ${observations.length} observations with virtualization enabled.`
                      : "Shows all observations concatenated. Great for quickly scanning through them."}
=======
                    {logViewConfirmation.isDisabled
                      ? `Log View is disabled for traces with more than ${LOG_VIEW_DISABLED_THRESHOLD} observations (this trace has ${observations.length})`
                      : logViewConfirmation.requiresConfirmation
                        ? `Log View may be slow with ${observations.length} observations. Click to confirm.`
                        : "Shows all observations concatenated. Great for quickly scanning through them. Nullish values are omitted."}
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
                  </TooltipContent>
                </Tooltip>
              </TabsBarTrigger>
            )}
            {showScoresTab && (
              <TabsBarTrigger value="scores">Scores</TabsBarTrigger>
            )}

            {/* View toggle (Formatted/JSON) - show for preview and log tabs when pretty view available */}
<<<<<<< HEAD
            {/* JSON is disabled for virtualized log view (large traces) */}
=======
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
            {(selectedTab === "log" ||
              (selectedTab === "preview" && isPrettyViewAvailable)) && (
              <Tabs
                className="ml-auto mr-1 h-fit px-2 py-0.5"
<<<<<<< HEAD
                value={
                  selectedTab === "log" && isLogViewVirtualized
                    ? "pretty"
                    : currentView
                }
                onValueChange={(value) => {
                  // Don't allow JSON for virtualized log view
                  if (
                    selectedTab === "log" &&
                    isLogViewVirtualized &&
                    value === "json"
                  ) {
                    return;
                  }
                  setViewPref(value === "json" ? "json" : "formatted");
=======
                value={currentView}
                onValueChange={(value) => {
                  setCurrentView(value as "pretty" | "json");
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
                }}
              >
                <TabsList className="h-fit py-0.5">
                  <TabsTrigger value="pretty" className="h-fit px-1 text-xs">
                    Formatted
                  </TabsTrigger>
<<<<<<< HEAD
                  {selectedTab === "log" && isLogViewVirtualized ? (
                    <HoverCard openDelay={200}>
                      <HoverCardTrigger asChild>
                        <TabsTrigger
                          value="json"
                          className="h-fit px-1 text-xs"
                          disabled
                        >
                          JSON
                        </TabsTrigger>
                      </HoverCardTrigger>
                      <HoverCardContent
                        align="end"
                        className="w-64 text-sm"
                        sideOffset={8}
                      >
                        <p className="font-medium">JSON view unavailable</p>
                        <p className="mt-1 text-muted-foreground">
                          Disabled for traces with{" "}
                          {TRACE_VIEW_CONFIG.logView.virtualizationThreshold}+
                          observations to maintain performance.
                        </p>
                      </HoverCardContent>
                    </HoverCard>
                  ) : (
                    <TabsTrigger value="json" className="h-fit px-1 text-xs">
                      JSON
                    </TabsTrigger>
                  )}
=======
                  <TabsTrigger value="json" className="h-fit px-1 text-xs">
                    JSON
                  </TabsTrigger>
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
                </TabsList>
              </Tabs>
            )}
          </TabsBarList>
        </TooltipProvider>

        {/* Preview tab content */}
        <TabsBarContent
          value="preview"
          className="mt-0 flex max-h-full min-h-0 w-full flex-1"
        >
<<<<<<< HEAD
          <div className="flex w-full flex-col gap-2 overflow-y-auto">
=======
          <div className="flex w-full flex-col gap-2 overflow-y-auto p-4">
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
            {/* I/O Preview */}
            <IOPreview
              key={trace.id + "-io"}
              input={trace.input ?? undefined}
              output={trace.output ?? undefined}
              media={traceMedia.data}
              currentView={currentView}
              setIsPrettyViewAvailable={setIsPrettyViewAvailable}
              inputExpansionState={expansionState.input}
              outputExpansionState={expansionState.output}
              onInputExpansionChange={(exp) => setFieldExpansion("input", exp)}
              onOutputExpansionChange={(exp) =>
                setFieldExpansion("output", exp)
              }
            />

            {/* Tags Section */}
            <div className="px-2 text-sm font-medium">Tags</div>
            <div className="flex flex-wrap gap-x-1 gap-y-1 px-2">
              <TagList selectedTags={trace.tags} isLoading={false} />
            </div>

            {/* Metadata Section */}
            {trace.metadata && (
              <div className="px-2">
                <PrettyJsonView
                  key={trace.id + "-metadata"}
                  title="Metadata"
                  json={trace.metadata}
                  media={traceMedia.data?.filter((m) => m.field === "metadata")}
                  currentView={currentView}
                  externalExpansionState={expansionState.metadata}
                  onExternalExpansionChange={(exp) =>
                    setFieldExpansion("metadata", exp)
                  }
                />
              </div>
            )}
          </div>
        </TabsBarContent>

        {/* Log View tab content */}
        <TabsBarContent
          value="log"
          className="mt-0 flex max-h-full min-h-0 w-full flex-1"
        >
          <TraceLogView
<<<<<<< HEAD
            traceId={trace.id}
            projectId={projectId}
            currentView={isLogViewVirtualized ? "pretty" : currentView}
=======
            observations={observations}
            traceId={trace.id}
            projectId={projectId}
            currentView={currentView}
            trace={trace}
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
          />
        </TabsBarContent>

        {/* Scores tab content */}
        {showScoresTab && (
          <TabsBarContent
            value="scores"
            className="mt-0 flex max-h-full min-h-0 w-full flex-1 overflow-hidden"
          >
            <div className="flex h-full min-h-0 w-full flex-col overflow-hidden pr-3">
              <ScoresTable
                projectId={projectId}
                omittedFilter={["Trace ID"]}
                traceId={trace.id}
                hiddenColumns={["traceName", "jobConfigurationId", "userId"]}
                localStorageSuffix="TracePreview"
              />
            </div>
          </TabsBarContent>
        )}
      </TabsBar>
<<<<<<< HEAD
=======

      {/* Confirmation dialog for log view with many observations (extracted component) */}
      <TraceLogViewConfirmationDialog
        open={logViewConfirmation.showDialog}
        onOpenChange={logViewConfirmation.setShowDialog}
        observationCount={observations.length}
        onConfirm={handleLogViewConfirm}
      />
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
    </div>
  );
}
