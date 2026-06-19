import HomeFeatures from "../Pages/HomeFeatures.jsx";
import HomeCenter from "../Pages/HomeCenter.jsx";
import HomeAbout from "../Pages/HomeAbout.jsx";
import NotFound from "../Pages/404.jsx";

export default function Center({ type }) {
  const choice = () => {
    if (type == "home") return <HomeCenter />;
    if (type == "about") return <HomeAbout />;
    if (type == "features") return <HomeFeatures />;

    if (type == "404") return <NotFound />;
  };

  return <div className="CenterPage">{choice()}</div>;
}
