// src/Context/ThemeContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext();

const getInitialTheme = () => {
  const saved = localStorage.getItem("horizon_theme");
  if (saved === "light" || saved === "dark") return saved;

  // First visit: follow the system preference
  const prefersDark =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  return prefersDark ? "dark" : "light";
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    localStorage.setItem("horizon_theme", theme);
    // Bootstrap and index.css both switch on this attribute
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}