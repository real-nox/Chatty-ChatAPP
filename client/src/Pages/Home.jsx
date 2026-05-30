import { useEffect, useState } from "react";
import "../css/Home.css";

import {
  EllipsisVertical,
  PhoneCallIcon,
  Search,
  VideoIcon,
} from "lucide-react";
import { formatedDate, getFriendsList, getUser } from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import socket from "../utils/Socket";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [currentChannel, setCurrentChannel] = useState("");
  const [friendList, setFriendList] = useState([]);

  const [currentfriend, setCurrentFriend] = useState({
    id: null,
    username: null,
    avatar: null,
  });

  const [message, setMessage] = useState({
    content: null,
    created_at: null,
    seen: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Home | Chatty - Chat App";
    document.documentElement.setAttribute("data-theme", "Dark");

    const checkUser = async () => {
      const isUser = await getUser();

      if (!isUser) return navigate("/");
      else setUserId(isUser);
    };

    checkUser();

    const getList = async () => {
      const data = await getFriendsList();
      setFriendList(data);
    };

    getList();
  }, []);

  //Socket events

  useEffect(() => {
    socket.connect();
    socket.on("connect", (s) =>
      console.log("Connected to server : ", socket.id),
    );

    return () => {
      socket.off("connect")
      socket.disconnect()
    }
  }, []);

  useEffect(() => {
    if (!currentfriend.id) return

    socket.on("loadMessages", async ({ messages }) => {

      console.log(messages);
    });

    return () => socket.off("loadMessages");
  }, [currentfriend.id]);

  const openConversation = ({ id, username }) => {
    const channel = [userId, id].sort().join("_");
    setCurrentChannel(channel);
    setCurrentFriend({ id: id, username, username });
    socket.emit("joinroom", channel);
  };

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
                return (
                  <button
                    key={friend.id}
                    className="FriendTemplate"
                    onClick={() =>
                      openConversation({
                        id: friend.id,
                        username: friend.username,
                      })
                    }
                  >
                    <div className="Icon">
                      <img
                        src={
                          friend?.avatar
                            ? `${friend?.avatar}`
                            : "../../img/avatar.png"
                        }
                        alt="Avatar"
                      />
                    </div>
                    <div className="Center">
                      <h4>{friend.username}</h4>
                      <p>{friend.last_message}</p>
                    </div>
                    <div className="Right">
                      <p>{formatedDate(friend.created_at)}</p>
                      {friend?.unseen_count > 0 ? (
                        <div className="Badge">{friend.unseen_count}</div>
                      ) : (
                        ""
                      )}
                    </div>
                  </button>
                );
              })
            : ""}
        </div>
      </div>

      <div className={`RightSection ${!currentfriend ? "Empty" : ""}`}>
        <div className="TopBarUser">
          <div className="User">
            <p>{currentfriend?.username}</p>
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
