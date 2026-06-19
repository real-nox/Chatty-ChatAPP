import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/Home.css";

import {
  formatedDate,
  formatedDateMsg,
  getFriendsList,
  getFullUser,
  getNoti,
  getTheme,
  getUser,
  SanitizeInput,
  setNoti,
} from "../utils/Utils";

import socket from "../utils/Socket";
import SideBar from "../components/SideBar";
import ChatChannel from "../components/ChatChannel";
import FriendsComponent from "../components/Friends";
import Settings from "../components/Settings";

export default function Home() {
  const [userId, setUserId] = useState("");
  const [currentChannel, setCurrentChannel] = useState("");
  const [friendList, setFriendList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [theme, setTheme] = useState("");

  const [input, setInput] = useState("");

  const [currentfriend, setCurrentFriend] = useState({
    id: null,
    display_name: null,
    username: null,
    avatar: null,
  });

  const [me, setMe] = useState({
    id: null,
    display_name: null,
    username: null,
    avatar: null,
    presence: true,
  });

  const [friendisTyping, setFriendisTyping] = useState({
    ongoing: false,
    dots: 1,
  });

  const [pageLoading, setPageLoading] = useState(false);
  const [contentLoading, setContentLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isFriendCard, setIsFriendCard] = useState(false);

  const [requestUsers, setRequestUsers] = useState([]);
  const [reqNumb, setReqNumb] = useState(0);

  const [isSettings, setIsSettings] = useState(false);

  const [type, setType] = useState(0);

  const timeout = useRef(null);
  const interval = useRef(null);

  const firstLoad = useRef(true);
  const messagesEndRef = useRef(null);
  const prevLen = useRef(0);
  const userID = useRef(null);

  const navigate = useNavigate();

  useEffect(() => {
    const Themes = async () => {
      setTheme(await getTheme());
    };
    Themes();
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.setAttribute("data-theme", theme);
    setContentLoading(false);
  }, [theme]);

  useEffect(() => {
    document.title = "Home | Chatty - Chat App";

    const checkUser = async () => {
      const isUser = await getUser();

      if (!isUser) return navigate("/");
      else {
        const user = await getFullUser();
        setMe({
          avatar: user.avatar,
          display_name: user.display_name,
          id: user.id,
          username: user.username,
          presence: user.presence,
        });
        setUserId(isUser);
      }
    };

    checkUser();

    const getList = async () => {
      const data = await getFriendsList();
      setFriendList(data);
    };

    setPageLoading(true);
    getList();
    const timeout = setTimeout(() => {
      setPageLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    socket.on("friendRequestAccepted", async () => {
      const updatedList = await getFriendsList();
      setFriendList((prev) => ({
        ...updatedList,
        ...Object.keys(updatedList).reduce((acc, id) => {
          acc[id] = {
            ...updatedList[id],
            presence: true,
          };
          return acc;
        }, {}),
      }));
    });

    return () => socket.off("friendRequestAccepted");
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
        if (!Array.isArray(prev))
          return [
            {
              id: id,
              sender_id: userId,
              content: content,
              seen: 0,
              created_at: new Date(),
            },
          ];

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
        if (!Array.isArray(prev))
          return [
            {
              id: id,
              sender_id: userId,
              content: content,
              seen: 0,
              created_at: new Date(),
            },
          ];

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
          mg.id === message_id ? { ...mg, seen: 1 } : mg,
        );
      });
    };

    const handleAllSeen = async () => {
      setMessageList((prev) => {
        if (!prev) return [];
        return (prev ?? []).map((mg) =>
          mg.sender_id === userID.current ? { ...mg, seen: 1 } : mg,
        );
      });

      socket.emit("MessagesRead", {
        roomName: currentChannel,
        currentfriend: currentfriend,
      });
    };

    const handleAllSeenReader = async () => {
      setMessageList((prev) => {
        return (prev ?? []).map((mg) =>
          mg.sender_id !== userID.current ? { ...mg, seen: 1 } : mg,
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
      handleFriendpresence({ userId: data.userId, presence: "offline" });
    };

    const handleOnline = (data) => {
      handleFriendpresence({ userId: data.userId, presence: "online" });
    };

    const handleFriendpresence = ({ userId, presence }) => {
      setFriendList((prev) => {
        const updated = { ...prev };
        if (updated[userId]) {
          updated[userId] = {
            ...updated[userId],
            presence: presence === "online" ? true : false,
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
      username: username,
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

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const toggleFriendsbar = () => {
    setIsFriendCard(!isFriendCard);
  };

  const toggleSettingssbar = () => {
    setIsSettings(!isSettings);
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

  useEffect(() => {
    const interval = setInterval(async () => {
      const link = `${import.meta.env.VITE_PATH_SERVER}/friends/requests/requests`;

      try {
        const response = await fetch(link, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();

        if (data) {
          setRequestUsers(data);
          setReqNumb(data.length);
        }
      } catch (err) {
        console.error(err);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (requestUsers.length <= prevLen.current) {
      prevLen.current = requestUsers.length;
      return;
    }

    prevLen.current = requestUsers.length;
    const notify = async () => {
      const latest_user = requestUsers[requestUsers.length - 1];
      const isNotified = await getNoti(latest_user.id);

      if (!isNotified) {
        await setNoti(latest_user.id)
        const noti = new Notification("New Friend Request", {
          body: `${latest_user.display_name} has sent you a friend request!`,
        });

        noti.onclick = () => {
          window.focus()
          setType(1);
          setIsFriendCard(true);
        };
      }
    };
    if (Notification.permission === "granted") {
      notify();
    } else if (Notification.permission === "default") {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          notify();
        }
      });
    }
  }, [requestUsers]);

  useEffect(() => {
    userID.current = userId;
  }, [userId]);

  const settings = () => {
    setIsSettings(!isSettings);
  };

  return (
    <div className={`HomeContainer ${contentLoading ? "Loading" : ""}`}>
      <SideBar
        currentfriend={currentfriend}
        friendisTyping={friendisTyping}
        friendList={friendList}
        openConversation={openConversation}
        isOpen={isOpen}
        toggleFriendsbar={toggleFriendsbar}
        reqNumb={reqNumb}
        me={me}
        settings={settings}
        pageLoading={pageLoading}
      />
      <ChatChannel
        Typing={Typing}
        currentfriend={currentfriend}
        friendisTyping={friendisTyping}
        input={input}
        loading={loading}
        messageList={messageList}
        messagesEndRef={messagesEndRef}
        submitMessage={submitMessage}
        userId={userId}
        setInput={setInput}
        toggleSidebar={toggleSidebar}
        isOpen={isOpen}
      />
      {isFriendCard && (
        <FriendsComponent
          isFriendCard={isFriendCard}
          setIsFriendCard={setIsFriendCard}
          toggleFriendsbar={toggleFriendsbar}
          setFriendList={setFriendList}
          reqNumb={reqNumb}
          setReqNumb={setReqNumb}
          requestUsers={requestUsers}
          setRequestUsers={setRequestUsers}
          setType={setType}
          type={type}
        />
      )}
      {isSettings && (
        <Settings
          isSettings={isSettings}
          toggleSettingssbar={toggleSettingssbar}
          theme={theme}
          setTheme={setTheme}
        />
      )}
    </div>
  );
}
