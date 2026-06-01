import { useEffect, useRef, useState } from "react";
import "../css/Home.css";

import {
  Check,
  CheckCheck,
  EllipsisVertical,
  PhoneCallIcon,
  Search,
  Send,
  VideoIcon,
} from "lucide-react";
import {
  formatedDate,
  formatedDateMsg,
  getFriendsList,
  getUser,
  SanitizeInput,
} from "../utils/Utils";
import { useNavigate } from "react-router-dom";
import socket from "../utils/Socket";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [currentChannel, setCurrentChannel] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [messageList, setMessageList] = useState([]);

  const [input, setInput] = useState("");

  const [currentfriend, setCurrentFriend] = useState({
    id: null,
    display_name: null,
    username: null,
    avatar: null,
  });

  const [friendisTyping, setFriendisTyping] = useState({
    ongoing: false,
    dots: 1,
  });

  const timeout = useRef(null);
  const interval = useRef(null);

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
      socket.off("connect");
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!currentfriend.id) return;

    socket.on("loadMessages", ({ messages }) => {
      setMessageList(messages);
    });

    const handleMessageReceived = ({ content, username, id, userId }) => {
      setMessageList((prev) => [
        ...prev,
        {
          id: id,
          sender_id: userId,
          content: content,
          seen: 0,
          created_at: new Date(),
        },
      ]);
    };

    const handleMessageSent = ({ content, username, id, userId }) => {
      setMessageList((prev) => [
        ...prev,
        {
          id: id,
          sender_id: userId,
          content: content,
          seen: 0,
          created_at: new Date(),
        },
      ]);

      socket.emit("stopWriting", { roomName: currentChannel });
    };

    socket.on("hello", () => console.log("hello"))

    socket.on("newMessage", handleMessageReceived)
    socket.on("messageSent", handleMessageSent);

    return () => {
      socket.off("loadMessages");
      socket.off("newMessage", handleMessageReceived);
      socket.off("messageSent", handleMessageSent);
    };
  }, [currentChannel]);

  useEffect(() => {
    if (!currentfriend.id) return;

    socket.on("friendWriting", ({ username }) => {
      setFriendisTyping((prev) => ({ ...prev, ongoing: true }));

      clearTimeout(timeout.current);
      clearInterval(interval.current);

      let dots = 3;
      interval.current = setInterval(() => {
        setFriendisTyping((prev) => ({ ...prev, dots: (prev.dots % 3) + 1 }));
      }, 500);

      timeout.current = setTimeout(() => {
        clearInterval(interval.current);
        setFriendisTyping({ ongoing: false, dots: 1 });
      }, 10000);
    });

    return () => socket.off("friendWriting");
  }, [currentChannel]);

  useEffect(() => {
    if (!currentfriend.id) return;

    socket.on("friendStopWriting", ({ username }) => {
      console.log("here");
      clearTimeout(timeout.current);
      clearInterval(interval.current);
      setFriendisTyping({ ongoing: false, dots: 1 });
    });

    return () => socket.off("friendStopWriting");
  }, [currentfriend.id]);

  const openConversation = ({ id, username, display_name }) => {
    const channel = [userId, id].sort().join("_");
    setCurrentChannel(channel);
    setCurrentFriend({
      id: id,
      username,
      username,
      display_name: display_name,
    });

    console.log(userId, id);
    socket.emit("joinroom", channel);
  };

  const Typing = () => {
    socket.emit("writing", { roomName: currentChannel });
  };

  const submitMessage = () => {
    if (!currentfriend.id || !input.trim()) return;

    socket.emit("messageSend", {
      roomName: currentChannel,
      content: input,
      userId: userId,
    });

    setInput("");
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
                        display_name: friend.display_name,
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
                      <h4>{friend.display_name}</h4>
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

      <div className={`RightSection ${!currentfriend.id ? "Empty" : ""}`}>
        <div className="TopBarUser">
          <div className="User">
            <p>
              {currentfriend?.display_name} - {currentfriend?.username}
            </p>
          </div>
          <div className="Options">
            <PhoneCallIcon />
            <VideoIcon />
            <EllipsisVertical />
          </div>
        </div>
        <div className="Messages">
          {messageList ? (
            messageList.map((msg) => (
              <div
                className={`ChatBubble ${msg.sender_id == userId ? "own" : ""} ${msg.seen ? "seen" : ""}`}
                key={msg.id}
              >
                <div className="Message">
                  <p>{msg.content}</p>
                </div>
                <div className="Date">
                  <p>{formatedDateMsg(msg.created_at)} </p>
                  {msg.seen ? <CheckCheck /> : <Check />}
                </div>
              </div>
            ))
          ) : (
            <p>Start conversation!</p>
          )}
        </div>
        <div className="Bar">
          {friendisTyping.ongoing && (
            <p>
              {currentfriend.display_name}{" "}
              {`Writing
              ${".".repeat(friendisTyping.dots)}`}
            </p>
          )}
        </div>
        <div className="Chat">
          <div className="Chatbar">
            <input
              value={input}
              onInput={Typing}
              onChange={(ev) => {
                console.log(ev.target.value);
                setInput(SanitizeInput(ev.target.value));
              }}
              onKeyDown={(ev) => ev.key === "Enter" && submitMessage()}
              type="text"
              name="chat"
              id="chat"
              placeholder="Type a message..."
            />
            <Send
              onClick={() => submitMessage()}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
