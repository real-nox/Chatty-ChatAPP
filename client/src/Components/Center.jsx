import HomeCenter from "./HomeCenter"

export default function Center({ type }) {

    const choice = () => {
        if (type == "home") return <HomeCenter />
    }
    
    return (
        <div className="Center">
            {
                choice()
            }
        </div>
    )
}