import React from "react";
import { useTheme } from "../../contexts/ThemeContext";
import Button from "./Button";

const ThemeToggle = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      className={`p-2 border rounded transition-colors ${className}`}
      variant="outline"
    >
      {theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode"}
    </Button>
  );
};

export default ThemeToggle;
