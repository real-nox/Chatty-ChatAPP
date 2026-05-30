import { useEffect } from "react";
import "../css/Home.css";

import { Search } from "lucide-react";

export default function Home() {
  useEffect(() => {
    document.title = "Home | Chatty - Chat App";
    document.documentElement.setAttribute("data-theme", "Light");
  }, []);

  return (
    <div className="HomeContainer">
      <div className="SideBar">
        <div className="SearchBar">
          <div className="Title">
            <p>Messages</p>
          </div>
          <div className="Bar">
            <Search />
            <input type="text" placeholder="Search conversations..." />
          </div>
        </div>
        <div className="FriendsList">
          <div className="FriendTemplate"></div>
        </div>
      </div>
    </div>
  );
}
