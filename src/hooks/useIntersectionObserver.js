import { useState, useEffect, useCallback, useMemo, useRef } from "react";

const useIntersectionObserver = (options = {}) => {
  const [entries, setEntries] = useState([]);
  const observerRef = useRef(null);

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(
    () => ({
      threshold: options.threshold ?? 0.1,
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? "0px",
    }),
    [options.threshold, options.root, options.rootMargin]
  );

  // Create observer only once or when options change
  useEffect(() => {
    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create new observer
    observerRef.current = new IntersectionObserver((observedEntries) => {
      setEntries(observedEntries);
    }, memoizedOptions);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [memoizedOptions]);

  const observe = useCallback((element) => {
    if (observerRef.current && element) {
      observerRef.current.observe(element);
    }
  }, []);

  const unobserve = useCallback((element) => {
    if (observerRef.current && element) {
      observerRef.current.unobserve(element);
    }
  }, []);

  return { entries, observe, unobserve };
};

export default useIntersectionObserver;
