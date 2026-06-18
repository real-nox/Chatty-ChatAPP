export function Appearance() {
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
          <div className="Card LightCard">
            <div className="Display">
              <div className="dis">
                <div className="dis1"></div>
                <div className="dis1"></div>
              </div>
            </div>
            <div className="Name">Light</div>
          </div>
          <div className="Card DarkCard">
            <div className="Display">
              <div className="dis">
                <div className="dis1"></div>
                <div className="dis1"></div>
              </div>
            </div>
            <div className="Name">Dark</div>
          </div>
          <div className="Card SystemCard">
            <div className="Display"></div>
            <div className="Name">System</div>
          </div>
        </div>
      </div>
    </div>
  );
}
