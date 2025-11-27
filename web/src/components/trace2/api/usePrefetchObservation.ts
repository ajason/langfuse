import { api } from "@/src/utils/api";

export type UsePrefetchObservationParams = {
  projectId: string;
};

<<<<<<< HEAD
/**
 * Hook to prefetch observation data on hover.
 * Matches the old trace component's prefetch behavior with 5-minute staleTime.
 */
=======
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
export function usePrefetchObservation({
  projectId,
}: UsePrefetchObservationParams) {
  const utils = api.useUtils();

<<<<<<< HEAD
  const prefetch = (
    observationId: string,
    traceId: string,
    startTime?: Date,
  ) => {
    void utils.observations.byId.prefetch(
      {
        observationId,
        traceId,
        projectId,
        startTime,
      },
      {
        staleTime: 5 * 60 * 1000, // 5 minutes - matches old trace behavior
      },
    );
=======
  const prefetch = (observationId: string, traceId: string) => {
    void utils.observations.byId.prefetch({
      observationId,
      traceId,
      projectId,
    });
<<<<<<< HEAD
>>>>>>> 4783d11e4 (feat(trace2): new trace viewer UI for parallel testing (#10762))
=======
>>>>>>> c1ce96097 (feat(trace2): new trace viewer UI for parallel testing (#10762))
>>>>>>> ad3e2a4b1 (feat(trace2): new trace viewer UI for parallel testing (#10762))
  };

  return { prefetch };
}
