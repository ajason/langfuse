/**
 * TraceTree - Composition of VirtualizedTree + TreeNodeWrapper + SpanContent.
 *
 * Connects three layers:
 * - VirtualizedTree (virtualization)
 * - TreeNodeWrapper (tree structure rendering)
 * - SpanContent (span-specific content)
 *
 * This composition pattern allows each component to have a single responsibility.
 */

import { VirtualizedTree } from "./_shared/VirtualizedTree";
import { VirtualizedTreeNodeWrapper } from "./_shared/VirtualizedTreeNodeWrapper";
import { SpanContent } from "./SpanContent";
import { useTraceData } from "../contexts/TraceDataContext";
import { useSelection } from "../contexts/SelectionContext";
<<<<<<< HEAD
import { useHandlePrefetchObservation } from "../hooks/useHandlePrefetchObservation";
=======
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
import { type TreeNode } from "../lib/types";

export function TraceTree() {
  const { tree, comments } = useTraceData();
  const { selectedNodeId, setSelectedNodeId, collapsedNodes, toggleCollapsed } =
    useSelection();
<<<<<<< HEAD
  const { handleHover } = useHandlePrefetchObservation();
=======
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))

  // Calculate root totals for heatmap color scaling
  // These values are used as the "max" reference for all nodes
  const rootTotalCost = tree.totalCost;
  const rootTotalDuration =
    tree.latency != null ? tree.latency * 1000 : undefined;

  return (
    <VirtualizedTree
      tree={tree}
      collapsedNodes={collapsedNodes}
      selectedNodeId={selectedNodeId}
      onToggleCollapse={toggleCollapsed}
      onSelectNode={setSelectedNodeId}
      renderNode={({
        node,
        treeMetadata,
        isSelected,
        isCollapsed,
        onToggleCollapse,
        onSelect,
      }) => {
        const typedNode = node as TreeNode;

        return (
          <VirtualizedTreeNodeWrapper
            metadata={treeMetadata}
            nodeType={typedNode.type}
            hasChildren={typedNode.children.length > 0}
            isCollapsed={isCollapsed}
            onToggleCollapse={onToggleCollapse}
            isSelected={isSelected}
            onSelect={onSelect}
          >
            <SpanContent
              node={typedNode}
              parentTotalCost={rootTotalCost}
              parentTotalDuration={rootTotalDuration}
              commentCount={comments.get(typedNode.id)}
              onSelect={onSelect}
<<<<<<< HEAD
              onHover={() => handleHover(typedNode)}
=======
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
            />
          </VirtualizedTreeNodeWrapper>
        );
      }}
    />
  );
}
