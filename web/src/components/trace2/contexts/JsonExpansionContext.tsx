/**
 * JsonExpansionContext - Persists JSON expand/collapse state across observations
 *
 * Purpose:
 * - Store which JSON paths are expanded/collapsed (e.g., "response.data.items": true)
 * - Persist state in sessionStorage (per-tab, clears on tab close)
 * - Share expansion state between observations with similar JSON structure
 *
 * Usage:
 * - Components receive externalExpansionState and onExternalExpansionChange props
 * - When user expands a path, it persists across observation switches
 * - Separate from TraceDataContext to avoid unnecessary re-renders
 */

import { createContext, useContext, useCallback, type ReactNode } from "react";
import useSessionStorage from "@/src/components/useSessionStorage";

type ExpandedState = Record<string, boolean> | boolean;

type JsonExpansionState = {
  input: ExpandedState;
  output: ExpandedState;
  metadata: ExpandedState;
  log: ExpandedState;
<<<<<<< HEAD
  // Dynamic keys for per-observation log view expansion (e.g., "log:observationId")
  [key: string]: ExpandedState;
=======
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
};

interface JsonExpansionContextValue {
  expansionState: JsonExpansionState;
<<<<<<< HEAD
  setFieldExpansion: (field: string, expansion: ExpandedState) => void;
=======
  setFieldExpansion: (
    field: keyof JsonExpansionState,
    expansion: ExpandedState,
  ) => void;
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
}

const JsonExpansionContext = createContext<JsonExpansionContextValue>({
  expansionState: { input: {}, output: {}, metadata: {}, log: {} },
  setFieldExpansion: () => {},
});

export const useJsonExpansion = () => useContext(JsonExpansionContext);

export function JsonExpansionProvider({ children }: { children: ReactNode }) {
  const [expansionState, setExpansionState] =
    useSessionStorage<JsonExpansionState>("trace2-jsonExpansionState", {
      input: {},
      output: {},
      metadata: {},
      log: {},
    });

  const setFieldExpansion = useCallback(
<<<<<<< HEAD
    (field: string, expansion: ExpandedState) => {
=======
    (field: keyof JsonExpansionState, expansion: ExpandedState) => {
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
      setExpansionState((prev) => ({
        ...prev,
        [field]: expansion,
      }));
    },
    [setExpansionState],
  );

  return (
    <JsonExpansionContext.Provider
<<<<<<< HEAD
      value={{
        expansionState,
        setFieldExpansion,
      }}
=======
      value={{ expansionState, setFieldExpansion }}
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
    >
      {children}
    </JsonExpansionContext.Provider>
  );
}
