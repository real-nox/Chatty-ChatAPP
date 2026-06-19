import HomeFeatures from "../pages/HomeFeatures.jsx";
import HomeCenter from "../pages/HomeCenter.jsx";
import HomeAbout from "../pages/HomeAbout.jsx";
import NotFound from "../pages/404.jsx";

export default function Center({ type }) {
  const choice = () => {
    if (type == "home") return <HomeCenter />;
    if (type == "about") return <HomeAbout />;
    if (type == "features") return <HomeFeatures />;

    if (type == "404") return <NotFound />;
  };

  return <div className="CenterPage">{choice()}</div>;
}
