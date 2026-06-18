import { setTheme as applyTheme } from "./Utils";
import { useEffect, useState } from "react";

export function Appearance({ theme, setTheme }) {
  const [currentTheme, setCurrentTheme] = useState(1);

  const toggleTheme = async (n) => {
    if (n !== currentTheme) {
      setCurrentTheme(n);

      switch (n) {
        case 0:
          await applyTheme("Light");
          setTheme("Light");
          break;
        case 1:
          await applyTheme("Dark");
          setTheme("Dark");
          break;
        case 2:
          const matched = window.matchMedia("(prefers-color-scheme: dark)")
            .matches
            ? "Dark"
            : "Light";
          await applyTheme(matched);
          setTheme(matched);
          break;
      }
    }
  };

  useEffect(() => {
    if (theme === "Dark") {
      setCurrentTheme(1);
    } else {
      setCurrentTheme(0);
    }
  }, [theme]);

  return (
    <div className="appearance">
      <div className="Top">
        <h3>Appearance</h3>
        <p>Customize how Chatty looks on your device.</p>
      </div>
      <div className="Themes">
        <div className="ThemeTitle">
          <p>THEME</p>
        </div>
        <div className="ListCards">
          <div
            className={`Card LightCard ${currentTheme === 0 ? "current" : ""}`}
            onClick={() => toggleTheme(0)}
          >
            <div className="Display">
              <div className="dis">
                <div className="dis1"></div>
                <div className="dis1"></div>
              </div>
            </div>
            <div className="Name">Light</div>
          </div>
          <div
            className={`Card DarkCard ${currentTheme === 1 ? "current" : ""}`}
            onClick={() => toggleTheme(1)}
          >
            <div className="Display">
              <div className="dis">
                <div className="dis1"></div>
                <div className="dis1"></div>
              </div>
            </div>
            <div className="Name">Dark</div>
          </div>
          <div
            className={`Card SystemCard ${currentTheme === 2 ? "current" : ""}`}
            onClick={() => toggleTheme(2)}
          >
            <div className="Display"></div>
            <div className="Name">System</div>
          </div>
        </div>
      </div>
    </div>
  );
}
