import { useState, useEffect, useCallback } from "react";

const useIntersectionObserver = (options = {}) => {
  const [entries, setEntries] = useState([]);
  const [observer, setObserver] = useState(null);

  const { threshold = 0.1, root = null, rootMargin = "0px" } = options;

  useEffect(() => {
    const obs = new IntersectionObserver(
      (observedEntries) => {
        setEntries(observedEntries);
      },
      {
        threshold,
        root,
        rootMargin,
      }
    );

    setObserver(obs);

    return () => {
      obs.disconnect();
    };
  }, [threshold, root, rootMargin]);

  const observe = useCallback(
    (element) => {
      if (observer && element) {
        observer.observe(element);
      }
    },
    [observer]
  );

  const unobserve = useCallback(
    (element) => {
      if (observer && element) {
        observer.unobserve(element);
      }
    },
    [observer]
  );

  return { entries, observe, unobserve };
};

export default useIntersectionObserver;
