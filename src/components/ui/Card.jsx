import React from "react";
import PropTypes from "prop-types";

const Card = ({
  children,
  className = "",
  padding = "md",
  shadow = "md",
  hover = false,
  ...props
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
  };

  const baseClasses =
    "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-200";
  const hoverClasses = hover ? "hover:shadow-lg hover:-translate-y-1" : "";

  const classes = `${baseClasses} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.oneOf(["none", "sm", "md", "lg"]),
  shadow: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  hover: PropTypes.bool,
};

export default Card;
