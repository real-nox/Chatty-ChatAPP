import { Check, Search, UserPlus, UsersRound, X } from "lucide-react";
import { getFriendsList, SanitizeInput } from "../utils/Utils";
import { useEffect, useState } from "react";

export default function FriendsComponent({
  isFriendCard,
  toggleFriendsbar,
  setFriendList,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [type, setType] = useState(0);

  const [users, setUsers] = useState([]);
  const [requestUsers, setRequestUsers] = useState([]);
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
    try {
      const link = `${import.meta.env.VITE_PATH_SERVER}/friends/requests/${user_id}/accept`;

      const response = await fetch(link, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ user_id: user_id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setRequestUsers((prev) => prev.filter((u) => u.id !== user_id));

        const updatedList = await getFriendsList();
        setFriendList((prev) => ({
          ...updatedList,
          ...Object.keys(updatedList).reduce((acc, id) => {
            acc[id] = {
              ...updatedList[id],
              presence: prev[id]?.presence ?? updatedList[id].presence,
            };
            return acc;
          }, {}),
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const refuse = async (user_id) => {
    try {
      const link = `${import.meta.env.VITE_PATH_SERVER}/friends/requests/${user_id}/decline`;

      const response = await fetch(link, {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ user_id: user_id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setRequestUsers((prev) => prev.filter((u) => u.id !== user_id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendFriendReq = async (user_id) => {
    try {
      const link = `${import.meta.env.VITE_PATH_SERVER}/friends/requests/send`;

      const response = await fetch(link, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ user_id: user_id }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await response.json();

      if (data.success) {
        setUsers((prev) => 
          prev.map(u => u.id === user_id ? { ...u, pending: user_id} : u)
      );
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (type == 0) {
      const timeout = setTimeout(async () => {
        if (searchInput.length == 0) return setUsers([]);
        const link = `${import.meta.env.VITE_PATH_SERVER}/friends/fetch`;

        try {
          const response = await fetch(`${link}?search=${searchInput}`, {
            method: "POST",
            credentials: "include",
          });
          const data = await response.json();

          if (data.success) return setUsers(data.users);
        } catch (err) {
          console.error(err);
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [type, searchInput]);

  useEffect(() => {
    if (type == 1) {
      const timeout = setTimeout(async () => {
        const link = `${import.meta.env.VITE_PATH_SERVER}/friends/requests/requests`;

        try {
          const response = await fetch(link, {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();

          if (data) setRequestUsers(data);
        } catch (err) {
          console.error(err);
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [type, requestUsers]);

  useEffect(() => {
    if (type == 2) {
      const timeout = setTimeout(async () => {
        const link = `${import.meta.env.VITE_PATH_SERVER}/friends/requests/sent`;

        try {
          const response = await fetch(link, {
            method: "GET",
            credentials: "include",
          });
          const data = await response.json();

          if (data) setSentUsers(data.users);
        } catch (err) {
          console.error(err);
        }
      }, 300);

      return () => clearTimeout(timeout);
    }
  }, [type, sentUsers]);

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
                className={type == 1 ? "selected" : ""}
                onClick={() => setType(1)}
              >
                Requests
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
                  <Search />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchInput}
                    onChange={(ev) =>
                      setSearchInput(SanitizeInput(ev.target.value))
                    }
                  />
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
                          <div className="Icon">
                            <img
                              src={
                                avatar ? `${avatar}` : "../../img/avatar.png"
                              }
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
                          <div className="Icon">
                            <img
                              src={
                                avatar ? `${avatar}` : "../../img/avatar.png"
                              }
                              alt="Avatar"
                            />
                          </div>
                          <div className="Center">
                            <h4>{display_name}</h4>
                            <p>@{username}</p>
                          </div>
                          <div className="Right">
                            <button
                              onClick={() => accept(id)}
                              className="accept"
                            >
                              <Check /> Accept
                            </button>
                            <button
                              onClick={() => refuse(id)}
                              className="refuse"
                            >
                              <X /> Decline
                            </button>
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
                          <div className="Icon">
                            <img
                              src={
                                avatar ? `${avatar}` : "../../img/avatar.png"
                              }
                              alt="Avatar"
                            />
                          </div>
                          <div className="Center">
                            <h4>{display_name}</h4>
                            <p>@{username}</p>
                          </div>
                          <div className="Right">
                            <button className="refuse">
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
