import { Palette, User } from "lucide-react";
import "../css/Settings.css";

export default function Settings({ isSettings, toggleSettingssbar }) {
  return (
    <div className="SettingContainerWrapper" onClick={toggleSettingssbar}>
      <div className={`SettingContainer ${isSettings ? "Open" : ""}`}>
        <div className="SettingsCard" onClick={(e) => e.stopPropagation()}>
          <div className="LeftBar">
            <div className="Section">
              <p>Account</p>
              <button className="Item">
                <User /> Profile
              </button>
            </div>
            <div className="Section">
              <p>APP</p>
              <button className="Item">
                <Palette /> Apperance
              </button>
              <div className="Section">
                <p>More</p>
              </div>
            </div>
            <div className="Sets"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
