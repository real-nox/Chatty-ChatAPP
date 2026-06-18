import HomeFeatures from "../pages/HomeFeatures";
import HomeCenter from "../pages/HomeCenter";
import HomeAbout from "../pages/HomeAbout";
import NotFound from "../pages/404";

export default function Center({ type }) {
  const choice = () => {
    if (type == "home") return <HomeCenter />;
    if (type == "about") return <HomeAbout />;
    if (type == "features") return <HomeFeatures />;

    if (type == "404") return <NotFound />;
  };

  return <div className="CenterPage">{choice()}</div>;
}
