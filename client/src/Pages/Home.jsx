import { useEffect, useState } from "react";
import "../css/Home.css";

import {
  EllipsisVertical,
  PhoneCallIcon,
  Search,
  VideoIcon,
} from "lucide-react";
import { formatedDate, getFriendsList } from "../utils/Utils";

export default function Home() {
  const [friendList, setFriendList] = useState([]);
  const [message, setMessage] = useState({
    content: null,
    created_at: null,
    seen: null,
  });

  useEffect(() => {
    document.title = "Home | Chatty - Chat App";
    document.documentElement.setAttribute("data-theme", "Dark");

    const getList = async () => {
      const data = await getFriendsList();
      setFriendList(data);
    };

    getList();
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
          {friendList
            ? friendList.map((friend) => {
                {
                  console.log(friend);
                }
                return (
                  <button key={friend.id} className="FriendTemplate">
                    <div className="Icon">
                      <img src={friend?.avatar ? `${friend?.avatar}` : "../../img/avatar.png"} alt="Avatar" />
                    </div>
                    <div className="Center">
                      <h4>{friend.username}</h4>
                      <p>{friend.last_message}</p>
                    </div>
                    <div className="Right">
                      <p>{formatedDate(friend.created_at)}</p>
                      {friend?.unseen_count > 0 ? (
                        <div className="Badge">
                          {friend.unseen_count}
                        </div>
                      ) : ""}
                    </div>
                  </button>
                );
              })
            : ""}
        </div>
      </div>

      <div className="RightSection">
        <div className="TopBarUser">
          <div className="User">
            <p>Me</p>
          </div>
          <div className="Options">
            <PhoneCallIcon />
            <VideoIcon />
            <EllipsisVertical />
          </div>
        </div>
        <div className="Chat"></div>
      </div>
    </div>
  );
}
