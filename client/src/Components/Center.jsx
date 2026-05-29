import NotFound from "../pages/404"
import HomeAbout from "../pages/HomeAbout"
import HomeCenter from "../pages/HomeCenter"
import HomeFeatures from "../pages/HomeFeatures"

export default function Center({ type }) {

    const choice = () => {
        if (type == "home") return <HomeCenter />
        if (type == "about") return <HomeAbout />
        if (type == "features") return <HomeFeatures />
        
        if (type == "404") return <NotFound />
    }
    
    return (
        <div className="CenterPage">
            {
                choice()
            }
        </div>
    )
}