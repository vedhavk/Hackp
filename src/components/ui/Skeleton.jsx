import React from "react";
import PropTypes from "prop-types";

const Skeleton = ({
  variant = "rectangular",
  width = "100%",
  height = "1rem",
  className = "",
  rounded = false,
  lines = 1,
}) => {
  const baseClasses = "animate-pulse bg-gray-300 dark:bg-gray-600";
  const roundedClasses = rounded ? "rounded-full" : "rounded";

  if (variant === "text" && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClasses} ${roundedClasses}`}
            style={{
              width: index === lines - 1 ? "75%" : width,
              height: height,
            }}
          />
        ))}
      </div>
    );
  }

  const variantClasses = {
    rectangular: "rounded",
    circular: "rounded-full",
    text: "rounded",
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      style={{ width, height }}
    />
  );
};

Skeleton.propTypes = {
  variant: PropTypes.oneOf(["rectangular", "circular", "text"]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  className: PropTypes.string,
  rounded: PropTypes.bool,
  lines: PropTypes.number,
};

export default Skeleton;
