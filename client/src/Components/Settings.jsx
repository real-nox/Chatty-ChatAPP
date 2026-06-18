import { Palette, User } from "lucide-react";
import "../css/Settings.css";
import { useState } from "react";
import { Appearance } from "../utils/SettingsOptions";

export default function Settings({ isSettings, toggleSettingssbar, theme, setTheme }) {
  const [type, setType] = useState(0);

  const Setting = (numb) => setType(numb);

  const SettingOpt = () => {
    switch (type) {
      case 0:
        return <p>Coming soon</p>;
      case 1:
        return <Appearance theme={theme} setTheme={setTheme}/>;

      default:
        return null;
    }
  };

  return (
    <div className="SettingContainerWrapper" onClick={toggleSettingssbar}>
      <div className={`SettingContainer ${isSettings ? "Open" : ""}`}>
        <div className="SettingsCard" onClick={(e) => e.stopPropagation()}>
          <div className="LeftBar">
            <div className="Section">
              <p>Account</p>
              <button
                className={`Item ${type === 0 ? "selected" : ""}`}
                onClick={() => Setting(0)}
              >
                <User /> Profile
              </button>
            </div>
            <div className="Section">
              <p>APP</p>
              <button
                className={`Item ${type === 1 ? "selected" : ""}`}
                onClick={() => Setting(1)}
              >
                <Palette /> Appearance
              </button>
              <div className="Section">
                <p>More</p>
              </div>
            </div>
          </div>
          <div className="Sets"><SettingOpt /></div>
        </div>
      </div>
    </div>
  );
}
