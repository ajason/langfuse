<<<<<<< HEAD
/**
 * TraceLogView - Log view of trace observations with conditional virtualization.
 *
 * Features:
 * - Conditional virtualization based on observation count threshold
 * - Non-virtualized (< 350 obs): All rows in DOM, full features
 * - Virtualized (>= 350 obs): Only visible rows rendered
 * - Lazy I/O loading (data fetched only when row is expanded)
 * - Two view modes: chronological (by time) and tree-order (DFS hierarchy)
 * - Search filtering by name, type, or ID
 * - Expandable rows with full I/O preview
 * - Copy/Download JSON functionality
 *
 * Uses JSONTableView for table rendering with domain-specific column definitions.
 *
 * **IMPORTANT: Context Dependencies**
 * This component MUST be rendered within the following context providers:
 * - `TraceDataProvider` - Provides tree, observations, and scores data
 * - `ViewPreferencesProvider` - Provides logViewMode, logViewTreeStyle preferences
 * - `JsonExpansionProvider` - Manages expansion state persistence
 *
 * Example usage:
 * ```tsx
 * <TraceDataProvider trace={trace} observations={observations}>
 *   <ViewPreferencesProvider>
 *     <JsonExpansionProvider>
 *       <TraceLogView traceId={id} projectId={pid} currentView="pretty" />
 *     </JsonExpansionProvider>
 *   </ViewPreferencesProvider>
 * </TraceDataProvider>
 * ```
 */

import { useState, useMemo, useCallback } from "react";
import { TRACE_VIEW_CONFIG } from "@/src/components/trace2/config/trace-view-config";
import { useTraceData } from "@/src/components/trace2/contexts/TraceDataContext";
import { useViewPreferences } from "@/src/components/trace2/contexts/ViewPreferencesContext";
import { useJsonExpansion } from "@/src/components/trace2/contexts/JsonExpansionContext";
import { JSONTableView } from "@/src/components/trace2/components/_shared/JSONTableView";
import {
  flattenChronological,
  flattenTreeOrder,
  filterBySearch,
} from "./log-view-flattening";
import { type FlatLogItem } from "./log-view-types";
import { LogViewToolbar } from "./LogViewToolbar";
import { LogViewExpandedContent } from "./LogViewExpandedContent";
import { LogViewTreeIndent } from "./LogViewTreeIndent";
import { LogViewJsonMode } from "./LogViewJsonMode";
import { useLogViewAllObservationsIO } from "./useLogViewAllObservationsIO";
import { useObservationIOLoadedCount } from "./useLogViewObservationIO";
import { useLogViewPreferences } from "./useLogViewPreferences";
import { useLogViewDownload } from "./useLogViewDownload";
import { useLogViewColumns } from "./useLogViewColumns";

export interface TraceLogViewProps {
  traceId: string;
  projectId: string;
  currentView?: "pretty" | "json";
}

// Import configuration constants
const {
  virtualizationThreshold: LOG_VIEW_VIRTUALIZATION_THRESHOLD,
  downloadThreshold: LOG_VIEW_DOWNLOAD_THRESHOLD,
  rowHeight: { collapsed: COLLAPSED_ROW_HEIGHT, expanded: EXPANDED_ROW_HEIGHT },
  maxIndentDepth: INDENT_DEPTH_THRESHOLD,
} = TRACE_VIEW_CONFIG.logView;

// Re-export thresholds for use in parent components
export { LOG_VIEW_VIRTUALIZATION_THRESHOLD };

export const TraceLogView = ({
  traceId,
  projectId,
  currentView = "pretty",
}: TraceLogViewProps) => {
  const { tree, observations } = useTraceData();
  const { logViewMode, logViewTreeStyle } = useViewPreferences();
  const { expansionState, setFieldExpansion } = useJsonExpansion();

  // Determine if we should virtualize based on observation count
  const isVirtualized =
    observations.length >= LOG_VIEW_VIRTUALIZATION_THRESHOLD;

  // Determine if download/copy should use cached I/O only (vs loading all)
  const isDownloadCacheOnly =
    observations.length >= LOG_VIEW_DOWNLOAD_THRESHOLD;

  // Get expanded keys from context (persisted in sessionStorage)
  // Uses dynamic key format: logViewRows:${traceId}
  const expandedRowsKey = `logViewRows:${traceId}`;

  const expandedKeys = useMemo(() => {
    const expandedRowsState = (expansionState[expandedRowsKey] ?? {}) as Record<
      string,
      boolean
    >;
    return new Set(
      Object.entries(expandedRowsState)
        .filter(([, isExpanded]) => isExpanded)
        .map(([id]) => id),
    );
  }, [expansionState, expandedRowsKey]);

  // Update expanded keys in context
  const setExpandedKeys = useCallback(
    (keysOrUpdater: Set<string> | ((prev: Set<string>) => Set<string>)) => {
      const newKeys =
        typeof keysOrUpdater === "function"
          ? keysOrUpdater(expandedKeys)
          : keysOrUpdater;

      // Convert Set to Record<string, boolean>
      const newState: Record<string, boolean> = {};
      newKeys.forEach((id) => {
        newState[id] = true;
      });

      setFieldExpansion(expandedRowsKey, newState);
    },
    [expandedKeys, setFieldExpansion, expandedRowsKey],
  );

  // Local state for search
  const [searchQuery, setSearchQuery] = useState("");

  // State for JSON view collapse
  const [jsonViewCollapsed, setJsonViewCollapsed] = useState(false);

  // Preferences from localStorage
  const {
    indentEnabled: indentEnabledPref,
    setIndentEnabled,
    showMilliseconds,
    setShowMilliseconds,
  } = useLogViewPreferences();

  // Disable indent when tree is too deep
  const indentDisabled = tree.childrenDepth > INDENT_DEPTH_THRESHOLD;
  const indentEnabled = indentEnabledPref && !indentDisabled;

  // Flatten tree based on mode
  const allItems = useMemo(() => {
    return logViewMode === "chronological"
      ? flattenChronological(tree)
      : flattenTreeOrder(tree);
  }, [tree, logViewMode]);

  // Apply search filter
  const flatItems = useMemo(() => {
    return filterBySearch(allItems, searchQuery);
  }, [allItems, searchQuery]);

  // Tree style: flat for chronological, use preference for tree-order
  const treeStyle = logViewMode === "chronological" ? "flat" : logViewTreeStyle;

  // Column definitions
  const columns = useLogViewColumns({
    indentEnabled,
    showMilliseconds,
    projectId,
    traceId,
  });

  // Render tree indentation for indented mode
  const renderRowPrefix = useCallback(
    (item: FlatLogItem) => {
      if (treeStyle !== "indented" || item.node.depth <= 0) return null;

      return (
        <LogViewTreeIndent
          treeLines={item.treeLines}
          isLastSibling={item.isLastSibling}
          depth={item.node.depth}
        />
      );
    },
    [treeStyle],
  );

  // Render expanded content with JSON expansion context integration
  // Always persist expansion state regardless of virtualization mode
  const renderExpanded = useCallback(
    (item: FlatLogItem) => {
      const observationExpansionKey = `log:${item.node.id}`;

      return (
        <LogViewExpandedContent
          node={item.node}
          traceId={traceId}
          projectId={projectId}
          currentView={currentView}
          externalExpansionState={expansionState[observationExpansionKey]}
          onExternalExpansionChange={(exp) =>
            setFieldExpansion(observationExpansionKey, exp)
          }
        />
      );
    },
    [traceId, projectId, currentView, expansionState, setFieldExpansion],
  );

  // Track if all rows are expanded (for non-virtualized mode)
  const allRowsExpanded = useMemo(() => {
    if (flatItems.length === 0) return false;
    return flatItems.every((item) => expandedKeys.has(item.node.id));
  }, [flatItems, expandedKeys]);

  // Toggle expand/collapse all (non-virtualized mode only)
  const handleToggleExpandAll = useCallback(() => {
    if (allRowsExpanded) {
      // Collapse all
      setExpandedKeys(new Set());
    } else {
      // Expand all
      const allKeys = new Set(flatItems.map((item) => item.node.id));
      setExpandedKeys(allKeys);
    }
  }, [allRowsExpanded, flatItems, setExpandedKeys]);

  // On-demand loading hook for observation I/O data
  // Does NOT auto-fetch - call loadAllData() or buildDataFromCache() when needed
  const allObservationsIO = useLogViewAllObservationsIO({
    items: flatItems,
    traceId,
    projectId,
  });

  // Track loaded observation count for cache-only mode UX
  const { loaded: loadedObservationCount } = useObservationIOLoadedCount({
    items: flatItems,
    traceId,
    projectId,
  });

  // Download and copy handlers
  const { handleCopyJson, handleDownloadJson, isDownloadOrCopyLoading } =
    useLogViewDownload({
      traceId,
      isDownloadCacheOnly,
      allObservationsData: allObservationsIO.data,
      isLoadingAllData: allObservationsIO.isLoading,
      failedObservationIds: allObservationsIO.failedObservationIds,
      loadAllData: allObservationsIO.loadAllData,
      buildDataFromCache: allObservationsIO.buildDataFromCache,
    });

  // Toggle JSON view collapse
  const handleToggleJsonCollapse = useCallback(() => {
    setJsonViewCollapsed((prev) => !prev);
  }, []);

  // Check if there are any observations at all
  const hasNoObservations = allItems.length === 0;
  const hasNoSearchResults = !hasNoObservations && flatItems.length === 0;

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Toolbar with search and actions */}
      <LogViewToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isVirtualized={isVirtualized}
        observationCount={observations.length}
        loadedObservationCount={loadedObservationCount}
        onToggleExpandAll={handleToggleExpandAll}
        allRowsExpanded={allRowsExpanded}
        onCopyJson={handleCopyJson}
        onDownloadJson={handleDownloadJson}
        isDownloadCacheOnly={isDownloadCacheOnly}
        isDownloadLoading={isDownloadOrCopyLoading}
        currentView={currentView}
        indentEnabled={indentEnabled}
        indentDisabled={indentDisabled}
        onToggleIndent={() => setIndentEnabled(!indentEnabledPref)}
        showMilliseconds={showMilliseconds}
        onToggleMilliseconds={() => setShowMilliseconds(!showMilliseconds)}
      />

      {/* Empty states */}
      {hasNoObservations && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-muted-foreground">
            No observations in this trace
          </div>
        </div>
      )}

      {hasNoSearchResults && (
        <div className="flex flex-1 items-center justify-center">
          <div className="text-sm text-muted-foreground">
            No observations match &quot;{searchQuery}&quot;
          </div>
        </div>
      )}

      {/* JSON view mode - only available for non-virtualized traces */}
      {flatItems.length > 0 && currentView === "json" && !isVirtualized && (
        <LogViewJsonMode
          items={flatItems}
          traceId={traceId}
          projectId={projectId}
          isCollapsed={jsonViewCollapsed}
          onToggleCollapse={handleToggleJsonCollapse}
        />
      )}

      {/* Table view mode - render as expandable table */}
      {flatItems.length > 0 && currentView === "pretty" && (
        <JSONTableView
          items={flatItems}
          columns={columns}
          getItemKey={(item) => item.node.id}
          expandable
          renderExpanded={renderExpanded}
          expandedKeys={expandedKeys}
          onExpandedKeysChange={setExpandedKeys}
          virtualized={isVirtualized}
          overscan={100}
          collapsedRowHeight={COLLAPSED_ROW_HEIGHT}
          expandedRowHeight={EXPANDED_ROW_HEIGHT}
          renderRowPrefix={renderRowPrefix}
        />
      )}
=======
import { useMemo, useEffect, useCallback } from "react";
import { PrettyJsonView } from "@/src/components/ui/PrettyJsonView";
import { type ObservationReturnTypeWithMetadata } from "@/src/server/api/routers/traces";
import { api } from "@/src/utils/api";
import { StringParam, useQueryParam } from "use-query-params";
import { useQueries } from "@tanstack/react-query";
import { type JsonNested } from "@langfuse/shared";
import { useJsonExpansion } from "@/src/components/trace2/contexts/JsonExpansionContext";
import {
  normalizeExpansionState,
  denormalizeExpansionState,
} from "@/src/components/trace2/contexts/json-expansion-utils";
import { Download } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { downloadTraceAsJson as downloadTraceUtil } from "@/src/components/trace2/lib/download-trace";

export interface TraceLogViewProps {
  observations: ObservationReturnTypeWithMetadata[];
  traceId: string;
  projectId: string;
  currentView: "pretty" | "json";
  trace: {
    id: string;
    [key: string]: unknown;
  };
}

export const TraceLogView = ({
  observations,
  traceId,
  projectId,
  currentView,
  trace,
}: TraceLogViewProps) => {
  const [currentObservationId] = useQueryParam("observation", StringParam);
  const [selectedTab] = useQueryParam("view", StringParam);
  const utils = api.useUtils();
  const { expansionState, setFieldExpansion } = useJsonExpansion();

  // Load all observations with their input/output for the log view
  const observationsWithIO = useQueries({
    queries: observations.map((obs) =>
      utils.observations.byId.queryOptions({
        observationId: obs.id,
        startTime: obs.startTime,
        traceId: traceId,
        projectId: projectId,
      }),
    ),
  });

  const logData = useMemo(() => {
    // Sort observations by start time
    const sortedObservations = [...observations].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime(),
    );

    const allObsData: Record<
      string,
      {
        id: string;
        type: string;
        name: string | null;
        startTime: string;
        endTime: string | null;
        latency: number | null;
        level: string;
        parentObservationId: string | null;
        model: string | null;
        modelParameters:
          | string
          | number
          | boolean
          | JsonNested[]
          | { [key: string]: JsonNested }
          | null;
        promptName: string | null;
        promptVersion: number | null;
        input: unknown;
        output: unknown;
        metadata: unknown;
        statusMessage: string | null;
        inputUsage: number;
        outputUsage: number;
        totalUsage: number;
        totalCost: number | null;
      }
    > = {};

    const idToDisplayName = new Map<string, string>();

    sortedObservations.forEach((obs) => {
      const index = observations.findIndex((o) => o.id === obs.id);
      const obsWithIO = observationsWithIO[index]?.data;

      const displayName = `${obs.name || obs.type} (${obs.id.substring(0, 8)})`;
      idToDisplayName.set(obs.id, displayName);

      allObsData[displayName] = {
        id: obs.id,
        type: obs.type,
        name: obs.name,
        startTime: obs.startTime.toISOString(),
        endTime: obs.endTime?.toISOString() || null,
        latency: obs.latency,
        level: obs.level,
        parentObservationId: obs.parentObservationId,
        model: obs.model,
        modelParameters: obs.modelParameters,
        promptName: obs.promptName,
        promptVersion: obs.promptVersion,
        input: obsWithIO?.input,
        output: obsWithIO?.output,
        metadata: obsWithIO?.metadata,
        statusMessage: obs.statusMessage,
        inputUsage: obs.inputUsage,
        outputUsage: obs.outputUsage,
        totalUsage: obs.totalUsage,
        totalCost: obs.totalCost,
      };
    });

    return { data: allObsData, idToDisplayName };
  }, [observations, observationsWithIO]);

  // Check if any data is still loading
  const isLoading = observationsWithIO.some((query) => query.isPending);

  // Scroll to observation when clicked in trace tree
  useEffect(() => {
    if (currentObservationId && selectedTab === "log") {
      const displayName = logData.idToDisplayName.get(currentObservationId);
      if (displayName) {
        // Convert display name format: hyphens to dots to match convertRowIdToKeyPath
        const keyPathFormat = displayName.replace(/-/g, ".");
        const element = document.querySelector(
          `[data-observation-id="${keyPathFormat}"]`,
        );
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }
  }, [currentObservationId, selectedTab, logData]);

  // Get top-level observation keys for denormalization
  const observationKeys = useMemo(
    () => Object.keys(logData.data),
    [logData.data],
  );

  // Convert normalized state from context to actual state with observation IDs
  const denormalizedState = useMemo(
    () => denormalizeExpansionState(expansionState.log, observationKeys),
    [expansionState.log, observationKeys],
  );

  // download includes trace + observations with full I/O
  const downloadLogAsJson = useCallback(() => {
    const observationsWithFullData = observations.map((obs, index) => {
      const obsWithIO = observationsWithIO[index]?.data;
      return {
        ...obs,
        input: obsWithIO?.input,
        output: obsWithIO?.output,
        metadata: obsWithIO?.metadata,
      };
    });

    downloadTraceUtil({
      trace,
      observations: observationsWithFullData,
      filename: `trace-with-observations-${traceId}.json`,
    });
  }, [trace, observations, observationsWithIO, traceId]);

  // Only render the actual log view when all data is loaded
  // prevents partial rendering and improves performance
  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col overflow-hidden px-2">
        <div className="mb-2 flex max-h-full min-h-0 w-full flex-col gap-2 overflow-y-auto">
          <div className="rounded-md border p-4">
            <div className="text-sm text-muted-foreground">
              Loading {observations.length} observations...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden pr-2">
      <div className="mb-2 flex max-h-full min-h-0 w-full flex-col gap-2 overflow-y-auto px-2">
        <PrettyJsonView
          key="trace-log-view"
          title="Concatenated Observation Log"
          json={logData.data}
          currentView={currentView}
          isLoading={false}
          showNullValues={false}
          externalExpansionState={denormalizedState}
          onExternalExpansionChange={(expansion) =>
            setFieldExpansion("log", normalizeExpansionState(expansion))
          }
          stickyTopLevelKey={true}
          showObservationTypeBadge={true}
          controlButtons={
            <Button
              variant="ghost"
              size="sm"
              onClick={downloadLogAsJson}
              title="Download trace log as JSON"
              className="-mr-2"
            >
              <Download className="h-3 w-3" />
            </Button>
          }
        />
      </div>
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
    </div>
  );
};
