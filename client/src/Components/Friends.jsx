import { Check, Search, UserPlus, UsersRound, X } from "lucide-react";
import { SanitizeInput } from "../Utils/Utils.jsx";
import { useEffect, useRef, useState } from "react";
import socket from "../Utils/Socket.jsx";

import Avatar from "../assets/avatar.png";
import {
  accept_request,
  fetch_friend,
  get_sent_requests,
  getFriendsList,
  reject_request,
  reject_sent,
  send_friend_request,
} from "../api/Friends.api.jsx";

export default function FriendsComponent({
  isFriendCard,
  setIsFriendCard,
  toggleFriendsbar,
  setFriendList,
  setReqNumb,
  reqNumb,
  requestUsers,
  setRequestUsers,
  type,
  setType,
}) {
  const [searchInput, setSearchInput] = useState("");

  const [users, setUsers] = useState([]);
  const [sentUsers, setSentUsers] = useState([]);

  const renderBTN = (isFriend, pending, user_id) => {
    if (isFriend) return <button className="FriendBTN friends">Friends</button>;
    if (pending)
      return (
        <button className="FriendBTN pending">
          <Check /> Pending
        </button>
      );
    return (
      <button className="FriendBTN add" onClick={() => sendFriendReq(user_id)}>
        <UserPlus /> Add
      </button>
    );
  };

  const accept = async (user_id) => {
    const data = await accept_request(user_id);

    if (data.success) {
      setRequestUsers((prev) => prev.filter((u) => u.id !== user_id));

      socket.emit("friendRequestAccepted", { sender_id: user_id });

      const updatedList = await getFriendsList();
      setFriendList((prev) => ({
        ...updatedList,
        ...Object.keys(updatedList).reduce((acc, id) => {
          acc[id] = {
            ...updatedList[id],
            presence: id == user_id ? true : prev[id]?.presence,
          };
          return acc;
        }, {}),
      }));

      setReqNumb((prev) => prev - 1);
    }
  };

  const refuseSent = async (user_id) => {
    const data = await reject_sent(user_id);

    if (data.success) {
      setSentUsers((prev) => prev.filter((u) => u.id !== user_id));
    }
  };

  const refuseReq = async (user_id, type = "req") => {
    const data = await reject_request(user_id);

    if (data.success) {
      setRequestUsers((prev) => prev.filter((u) => u.id !== user_id));
      setReqNumb(sentUsers.length);
    }
  };

  const sendFriendReq = async (user_id) => {
    const data = await send_friend_request(user_id);
    if (data.success) {
      setUsers((prev) =>
        prev.map((u) => (u.id === user_id ? { ...u, pending: user_id } : u)),
      );
    }
  };

  useEffect(() => {
    if (type == 0) {
      const timeout = setTimeout(async () => {
        if (searchInput.length == 0) return setUsers([]);
        const data = await fetch_friend(searchInput)
        if (data.success) return setUsers(data.users);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [type, searchInput]);

  useEffect(() => {
    if (type == 2) {
      const timeout = setTimeout(async () => {
        const data = await get_sent_requests()
        if (data) setSentUsers(data.users);
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [type]);

  return (
    <div className="FriendsContainerWrapper">
      <div
        className={`FriendsContainer ${isFriendCard ? "show" : ""}`}
        onClick={toggleFriendsbar}
      >
        <div className="FriendsCard" onClick={(e) => e.stopPropagation()}>
          <div className="HeaderCard">
            <div className="containerHeader">
              <div className="Left">
                <UsersRound />
                <p>Friends</p>
              </div>
              <div className="Right">
                <X onClick={toggleFriendsbar} />
              </div>
            </div>
          </div>
          <div className="CenterCard">
            <div className="Options">
              <button
                className={type == 0 ? "selected" : ""}
                onClick={() => setType(0)}
              >
                Add People
              </button>
              <button
                className={`req ${type == 1 ? "selected" : ""}`}
                onClick={() => setType(1)}
              >
                Requests{" "}
                {reqNumb > 0 ? <div className="Badge">{reqNumb}</div> : ""}
              </button>
              <button
                className={type == 2 ? "selected" : ""}
                onClick={() => setType(2)}
              >
                Sent
              </button>
            </div>
          </div>
          <div className="Users">
            <div className="AddFriend">
              <div className="SearchBar">
                <div className="Bar">
                  <label htmlFor="search">
                    <Search />
                    <input
                      type="text"
                      id="search"
                      placeholder="Search conversations..."
                      value={searchInput}
                      onInput={(ev) =>
                        setSearchInput(SanitizeInput(ev.target.value))
                      }
                    />
                  </label>
                </div>
              </div>
              <div className="UsersList">
                {type == 0 &&
                  users &&
                  users.map(
                    ({
                      id,
                      display_name,
                      username,
                      isfriend,
                      pending,
                      avatar = null,
                    }) => {
                      return (
                        <div className="FriendTemplate" key={id} id={id}>
                          <div className="IconFR">
                            <img
                              src={avatar ? `${avatar}` : Avatar}
                              alt="Avatar"
                            />
                          </div>
                          <div className="Center">
                            <h4>{display_name}</h4>
                            <p>@{username}</p>
                          </div>
                          <div className="Right">
                            {renderBTN(isfriend, pending, id)}
                          </div>
                        </div>
                      );
                    },
                  )}
                {type == 1 &&
                  requestUsers &&
                  requestUsers.map(
                    ({ id, username, display_name, avatar = null }) => {
                      return (
                        <div className="FriendTemplate" key={id} id={id}>
                          <div className="IconFR">
                            <img
                              src={avatar ? `${avatar}` : Avatar}
                              alt="Avatar"
                            />
                          </div>
                          <div className="Center">
                            <h4>{display_name}</h4>
                            <p>@{username}</p>

                            <div className="Options">
                              <button
                                onClick={() => accept(id)}
                                className="accept"
                              >
                                <Check /> Accept
                              </button>
                              <button
                                onClick={() => refuseReq(id)}
                                className="refuse"
                              >
                                <X /> Decline
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    },
                  )}
                {type == 2 &&
                  sentUsers &&
                  sentUsers.map(
                    ({ id, username, display_name, avatar = null }) => {
                      return (
                        <div className="FriendTemplate" key={id} id={id}>
                          <div className="IconFR">
                            <img
                              src={avatar ? `${avatar}` : Avatar}
                              alt="Avatar"
                            />
                          </div>
                          <div className="Center">
                            <h4>{display_name}</h4>
                            <p>@{username}</p>
                          </div>
                          <div className="Right">
                            <button
                              className="refuse"
                              onClick={() => refuseSent(id)}
                            >
                              <X />
                            </button>
                          </div>
                        </div>
                      );
                    },
                  )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
