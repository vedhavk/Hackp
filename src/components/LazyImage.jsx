import React, { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import { Skeleton } from "../components/ui";

const LazyImage = ({
  src,
  alt = "",
  className = "",
  thumbnail = null,
  aspectRatio = "auto",
  onClick,
  onLoad,
  onError,
  ...props
}) => {
  const [imageState, setImageState] = useState("idle"); // idle, loading, loaded, error
  const [imageSrc, setImageSrc] = useState(thumbnail || null);
  const imageRef = useRef(null);

  // Memoize the intersection observer options to prevent infinite re-renders
  const intersectionOptions = useMemo(
    () => ({
      threshold: 0.1,
      rootMargin: "50px",
    }),
    []
  );

  const { entries, observe } = useIntersectionObserver(intersectionOptions);

  useEffect(() => {
    if (imageRef.current) {
      observe(imageRef.current);
    }
  }, [observe]);

  useEffect(() => {
    if (entries.length === 0) return;

    const entry = entries.find((entry) => entry.target === imageRef.current);

    if (entry?.isIntersecting && imageState === "idle" && src) {
      loadImage();
    }
  }, [entries, src]); // Keep src in dependencies but remove imageState to prevent loops

  const loadImage = () => {
    if (!src) return;

    // Check if already loading or loaded to prevent duplicate requests
    if (imageState !== "idle") return;

    setImageState("loading");

    const img = new Image();
    img.onload = () => {
      setImageSrc(src);
      setImageState("loaded");
      onLoad?.();
    };
    img.onerror = () => {
      setImageState("error");
      onError?.();
    };
    img.src = src;
  };

  const aspectRatioClasses = {
    square: "aspect-square",
    "4/3": "aspect-[4/3]",
    "3/2": "aspect-[3/2]",
    "16/9": "aspect-[16/9]",
    auto: "",
  };

  const containerClasses = `relative overflow-hidden ${aspectRatioClasses[aspectRatio]} ${className}`;

  if (imageState === "error") {
    return (
      <div
        ref={imageRef}
        className={`${containerClasses} bg-gray-200 dark:bg-gray-700 flex items-center justify-center`}
      >
        <div className="text-center p-4">
          <svg
            className="w-8 h-8 mx-auto mb-2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Failed to load image
          </p>
        </div>
      </div>
    );
  }

  return (
    <div ref={imageRef} className={containerClasses}>
      {/* Loading skeleton */}
      {imageState === "idle" && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          className="absolute inset-0"
        />
      )}

      {/* Image */}
      {imageSrc && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            imageState === "loaded" ? "opacity-100" : "opacity-70"
          }`}
          onClick={onClick}
          {...props}
        />
      )}

      {/* Loading overlay */}
      {imageState === "loading" && !thumbnail && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        </div>
      )}

      {/* Loading indicator for progressive loading */}
      {imageState === "loading" && thumbnail && (
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  className: PropTypes.string,
  thumbnail: PropTypes.string,
  aspectRatio: PropTypes.oneOf(["square", "4/3", "3/2", "16/9", "auto"]),
  onClick: PropTypes.func,
  onLoad: PropTypes.func,
  onError: PropTypes.func,
};

export default LazyImage;
