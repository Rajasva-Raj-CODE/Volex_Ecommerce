import { useCallback, useEffect, useRef, useState } from "react";

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** Re-runs the fetcher. Safe to pass straight to RefreshControl. */
  reload: () => void;
}

interface InternalState<T> {
  /** depsKey + reload counter — identifies one specific request. */
  key: string;
  /** depsKey alone, so a reload can keep showing the previous data. */
  depsKey: string;
  data: T | null;
  error: string | null;
  loading: boolean;
}

/**
 * Every async surface gets loading → empty → error → content (DESIGN_SYSTEM.md §10).
 * This gives a screen the first three without each one re-implementing them.
 *
 * The request is aborted when `deps` change or the screen unmounts, so a slow
 * response can't land on a dead component or overwrite a newer one.
 *
 * `deps` are identified by their JSON form, so pass primitives (ids, query
 * strings) — not objects with functions or cycles.
 */
export function useAsync<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  deps: readonly unknown[]
): AsyncState<T> {
  const [nonce, setNonce] = useState(0);
  const depsKey = JSON.stringify(deps);
  const key = `${depsKey}#${nonce}`;

  const [state, setState] = useState<InternalState<T>>(() => ({
    key,
    depsKey,
    data: null,
    error: null,
    loading: true,
  }));

  // Callers pass inline arrows, so the fetcher identity changes every render.
  // Park it in a ref updated from an effect — assigning during render is not
  // allowed, and this effect is declared first so it lands before the fetch below.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  // Adjusting state during render when the inputs change — React's documented
  // alternative to a reset effect, and it avoids the extra render a
  // setState-inside-useEffect would cost.
  if (state.key !== key) {
    setState({
      key,
      depsKey,
      // A reload (same deps) keeps the old data on screen; genuinely new deps clear it.
      data: state.depsKey === depsKey ? state.data : null,
      error: null,
      loading: true,
    });
  }

  useEffect(() => {
    const controller = new AbortController();

    fetcherRef.current(controller.signal).then(
      (result) => {
        if (controller.signal.aborted) return;
        setState((s) => (s.key === key ? { ...s, data: result, loading: false } : s));
      },
      (err: unknown) => {
        if (controller.signal.aborted) return;
        const message = err instanceof Error ? err.message : "Something went wrong";
        setState((s) => (s.key === key ? { ...s, error: message, loading: false } : s));
      }
    );

    return () => controller.abort();
  }, [key]);

  const reload = useCallback(() => setNonce((n) => n + 1), []);

  return { data: state.data, loading: state.loading, error: state.error, reload };
}
