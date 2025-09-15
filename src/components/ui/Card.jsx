import React from "react";
import PropTypes from "prop-types";

const Card = ({
  children,
  className = "",
  padding = "md",
  shadow = "md",
  hover = false,
  variant = "default",
  ...props
}) => {
  const paddingClasses = {
    none: "",
    sm: "p-4",
    md: "p-6",
    lg: "p-8",
    xl: "p-10",
  };

  const shadowClasses = {
    none: "",
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    xl: "shadow-xl",
    "2xl": "shadow-2xl",
  };

  const variantClasses = {
    default: "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700",
    elevated:
      "bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-lg",
    glass:
      "bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-white/20 dark:border-gray-700/50",
    gradient:
      "bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-gray-200 dark:border-gray-700",
  };

  const baseClasses =
    "rounded-xl border transition-all duration-300 ease-in-out";
  const hoverClasses = hover
    ? "hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] cursor-pointer"
    : "";

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${shadowClasses[shadow]} ${hoverClasses} ${className}`;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  padding: PropTypes.oneOf(["none", "sm", "md", "lg", "xl"]),
  shadow: PropTypes.oneOf(["none", "sm", "md", "lg", "xl", "2xl"]),
  hover: PropTypes.bool,
  variant: PropTypes.oneOf(["default", "elevated", "glass", "gradient"]),
};

export default Card;
