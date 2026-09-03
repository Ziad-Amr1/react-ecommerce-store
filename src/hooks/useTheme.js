import { useCallback, useLayoutEffect, useState } from "react";

const STORAGE_KEY = "theme";
const DARK = "dark";
const LIGHT = "light";

function getInitialTheme() {
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === DARK || stored === LIGHT) {
    return stored;
  }
  return LIGHT;
}

function applyTheme(theme) {
  const root = document.documentElement;
  if (theme === DARK) {
    root.setAttribute("data-theme", DARK);
  } else {
    root.removeAttribute("data-theme");
  }
}

export default function useTheme() {
  const [theme, setTheme] = useState(() => getInitialTheme());

  useLayoutEffect(() => {
    applyTheme(theme);
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === DARK ? LIGHT : DARK));
  }, []);

  return { theme, toggleTheme };
}
