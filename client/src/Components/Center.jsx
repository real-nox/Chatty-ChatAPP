import HomeAbout from "./HomeAbout"
import HomeCenter from "./HomeCenter"
import HomeFeatures from "./HomeFeatures"

export default function Center({ type }) {

    const choice = () => {
        if (type == "home") return <HomeCenter />
        if (type == "about") return <HomeAbout />
        if (type == "features") return <HomeFeatures />
    }
    
    return (
        <div className="CenterPage">
            {
                choice()
            }
        </div>
    )
}