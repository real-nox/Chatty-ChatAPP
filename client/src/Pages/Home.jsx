import { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
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
import SideBar from "../components/SideBar";

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

  const [loading, setLoading] = useState(false);

  const timeout = useRef(null);
  const interval = useRef(null);

  const firstLoad = useRef(true);
  const messagesEndRef = useRef(null);

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
      setFriendList((prev) => {
        const updated = { ...prev };

        //Test

        updated["8"] = {
          display_name: "ranoxiski",
          username: "tacos",
          created_at: "2026-06-13T11:50:58.505Z",
        };
        return updated;
      });
    };

    getList();

    console.log(friendList);
  }, []);

  //WebSocket connection
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

  //In chat events
  useEffect(() => {
    if (!currentfriend.id) return;

    socket.on("loadMessages", ({ messages }) => {
      setLoading(false);
      setMessageList(messages);
    });

    const handleLastSeen = (content) => {
      setFriendList((prev) => {
        const updated = { ...prev };
        if (updated[currentfriend.id]) {
          updated[currentfriend.id] = {
            ...updated[currentfriend.id],
            last_message: content,
            unseen_count: 0,
          };
        }

        return updated;
      });
    };

    const handleMessageReceived = ({ content, username, id, userId }) => {
      setMessageList((prev) => {
        return [
          ...(prev ?? []),
          {
            id: id,
            sender_id: userId,
            content: content,
            seen: 0,
            created_at: new Date(),
          },
        ];
      });

      handleLastSeen(content, userId);

      if (currentChannel)
        socket.emit("readMessage", {
          roomName: currentChannel,
          message_id: id,
        });
    };

    const handleMessageSent = ({ content, username, id, userId }) => {
      setMessageList((prev) => {
        return [
          ...(prev ?? []),
          {
            id: id,
            sender_id: userId,
            content: content,
            seen: 0,
            created_at: new Date(),
          },
        ];
      });

      handleLastSeen(content);
      socket.emit("stopWriting", { roomName: currentChannel });
    };

    const handleSeenMsg = async ({ message_id }) => {
      setMessageList((prev) => {
        return prev.map((mg) =>
          mg.id == message_id ? { ...mg, seen: 1 } : mg,
        );
      });
    };

    const handleAllSeen = async ({}) => {
      setMessageList((prev) => {
        return (prev ?? []).map((mg) =>
          mg.sender_id == userId ? { ...mg, seen: 1 } : mg,
        );
      });

      socket.emit("MessagesRead", {
        roomName: currentChannel,
        currentfriend: currentfriend,
      });
    };

    const handleAllSeenReader = async ({}) => {
      setMessageList((prev) => {
        return (prev ?? []).map((mg) =>
          mg.sender_id != userId ? { ...mg, seen: 1 } : mg,
        );
      });
    };

    const handleFriendWriting = ({ username }) => {
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
    };

    const handleFriendStopWriting = ({ username }) => {
      clearTimeout(timeout.current);
      clearInterval(interval.current);
      setFriendisTyping({ ongoing: false, dots: 1 });
    };

    socket.on("newMessage", handleMessageReceived);
    socket.on("messageSent", handleMessageSent);

    socket.on("MarkMessageSeen", handleSeenMsg);
    socket.on("allMessagesRead", handleAllSeen);

    socket.on("UpdateMessages", handleAllSeenReader);

    socket.on("friendWriting", handleFriendWriting);
    socket.on("friendStopWriting", handleFriendStopWriting);

    return () => {
      socket.off("loadMessages");
      socket.off("newMessage", handleMessageReceived);
      socket.off("messageSent", handleMessageSent);

      socket.off("MarkMessageSeen", handleSeenMsg);
      socket.off("allMessagesRead", handleAllSeen);

      socket.off("UpdateMessages", handleAllSeenReader);

      socket.off("friendStopWriting", handleFriendStopWriting);
      socket.off("friendWriting", handleFriendWriting);
    };
  }, [currentChannel]);

  //Off chat events
  useEffect(() => {
    if (!friendList) return;

    const messageShowList = ({ content, userId }) => {
      if (String(userId) === String(currentfriend.id)) return;
      setFriendList((prev) => {
        const updated = { ...prev };
        if (updated[userId]) {
          updated[userId] = {
            ...updated[userId],
            last_message: content,
            unseen_count: String(Number(updated[userId].unseen_count ?? 0) + 1),
          };
        }

        return updated;
      });
    };

    const handleOffline = (data) => {
      handleFriendPresence({ userId: data.userId, presence: "offline" });
    };

    const handleOnline = (data) => {
      handleFriendPresence({ userId: data.userId, presence: "online" });
    };

    const handleFriendPresence = ({ userId, presence }) => {
      setFriendList((prev) => {
        const updated = { ...prev };
        if (updated[userId]) {
          updated[userId] = {
            ...updated[userId],
            presence: presence == "online" ? true : false,
          };
        }

        return updated;
      });
    };

    const handleOnlineFriend = ({ userId }) => {};

    socket.on("showMessage", messageShowList);

    socket.on("friendOnline", handleOnline);
    socket.on("friendOffline", handleOffline);

    return () => {
      socket.off("showMessage", messageShowList);
      socket.off("friendOnline", handleOnline);
      socket.off("friendOffline", handleOffline);
    };
  }, [friendList]);

  const openConversation = ({ id, username, display_name }) => {
    const channel = [userId, id].sort().join("_");
    setCurrentChannel(channel);
    setCurrentFriend({
      id: id,
      username,
      username,
      display_name: display_name,
    });

    socket.emit("joinroom", channel);
    console.log(channel, currentfriend.id);
    socket.emit("MarkAllMsgAsSeen", { roomName: channel, friendId: id });

    setFriendList((prev) => {
      const updated = { ...prev };
      if (updated[id]) {
        updated[id] = {
          ...updated[id],
          unseen_count: 0,
        };
      }

      return updated;
    });
    setLoading(true);
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

  useEffect(() => {
    firstLoad.current = true;
  }, [currentChannel]);

  useEffect(() => {
    if (!messageList?.length) return;

    if (firstLoad.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
      firstLoad.current = false;
    }
  }, [messageList]);

  return (
    <div className="HomeContainer">
      <SideBar
        currentfriend={currentfriend}
        friendisTyping={friendisTyping}
        friendList={friendList}
        openConversation={openConversation}
      />

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
          {loading ? (
            <>
              <div className="ChatBubble skel"></div>
              <div className="ChatBubble own skel"></div>
              <div className="ChatBubble skel"></div>
              <div className="ChatBubble own skel"></div>
            </>
          ) : messageList ? (
            <>
              {messageList.map((msg) => (
                <div
                  className={`ChatBubble ${msg.sender_id == userId ? "own" : ""} ${msg.seen ? "seen" : ""}`}
                  key={msg.id}
                >
                  <div className="Message">{msg.content}</div>
                  <div className="Date">
                    <p>{formatedDateMsg(msg.created_at)} </p>
                    {msg.seen ? <CheckCheck /> : <Check />}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
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
                setInput(SanitizeInput(ev.target.value));
              }}
              onKeyDown={(ev) => ev.key === "Enter" && submitMessage()}
              type="text"
              name="chat"
              id="chat"
              placeholder="Type a message..."
            />
            <EmojiPicker
              style={{
                display: "none",
                position: "absolute",
                top: "45%",
                right: "1.5%",
              }}
              theme={"dark"}
              onEmojiClick={(EmojiObject) => {
                let emoji = EmojiObject.emoji;
                Typing();
                setInput((prev) => {
                  return prev + emoji;
                });
              }}
            />
            <button
              type="button"
              id="emojiToggle"
              style={{
                backgroundColor: "transparent",
                border: "0",
                fontSize: "1.2rem",
              }}
              onClick={(ev) => {
                let picker = document.querySelector(".EmojiPickerReact");

                picker.style.display =
                  picker.style.display == "none" ? "block" : "none";
              }}
            >
              😊
            </button>
            <Send
              onClick={() => submitMessage()}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <script
          type="module"
          src="https://cdn.jsdelivr.net/npm/emoji-picker-element@^1/index.js"
        ></script>
      </div>
    </div>
  );
}
