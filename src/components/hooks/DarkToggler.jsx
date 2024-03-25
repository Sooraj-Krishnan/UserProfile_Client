import { useContext } from "react";
import { MdDarkMode, MdOutlineLightMode } from "react-icons/md";
import { ThemeContext } from "../state-management/ThemeContext";

function DarkModeToggle() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? (
        <MdDarkMode size={25} />
      ) : (
        <MdOutlineLightMode size={25} color="white" />
      )}
    </button>
  );
}

export default DarkModeToggle;
