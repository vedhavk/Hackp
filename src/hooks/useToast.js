import { useState, useCallback } from "react";

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(
    ({ message, type = "info", duration = 4000, position = "top-right" }) => {
      const id = Date.now() + Math.random();
      const toast = { id, message, type, duration, position };

      setToasts((prev) => [...prev, toast]);

      return id;
    },
    []
  );

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const success = useCallback(
    (message, options = {}) => {
      return addToast({ message, type: "success", ...options });
    },
    [addToast]
  );

  const error = useCallback(
    (message, options = {}) => {
      return addToast({ message, type: "error", ...options });
    },
    [addToast]
  );

  const warning = useCallback(
    (message, options = {}) => {
      return addToast({ message, type: "warning", ...options });
    },
    [addToast]
  );

  const info = useCallback(
    (message, options = {}) => {
      return addToast({ message, type: "info", ...options });
    },
    [addToast]
  );

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    warning,
    info,
  };
};

export default useToast;
