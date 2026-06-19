import { LogOut, Search, Settings, UserPlus } from "lucide-react";
import { formatedDate, SanitizeInput } from "../utils/Utils.jsx";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from "../assets/avatar.png";
import "../css/SideBar.css";

export default function SideBar({
  friendList,
  friendisTyping,
  currentfriend,
  openConversation,
  isOpen,
  toggleFriendsbar,
  reqNumb,
  me,
  settings,
  pageLoading,
}) {
  const [searchInput, setSearchInput] = useState("");
  const [isActive, setIsActive] = useState(false);

  const navigate = useNavigate();

  const search = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
    if (!friendList) return;
    const filtered = Object.entries(friendList).filter((friend) => {
      return (
        !searchInput ||
        friend[1]["username"].includes(searchInput) ||
        friend[1]["display_name"].includes(searchInput)
      );
    });

    filtered.sort(([, a], [, b]) => {
      return new Date(b.created_at) - new Date(a.created_at);
    });
    return filtered;
  }, [searchInput, friendList]);

  const logout = async () => {
    const link = `${import.meta.env.VITE_PATH_SERVER}/auth/logout`;

    try {
      const response = await fetch(link, {
        method: "GET",
        credentials: "include",
      });

      console.log(response);
      const data = await response.json();

      if (data) {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={`SideBar ${!isOpen ? "closed" : ""}`}>
      <div className="SearchBar">
        <div className="Title">
          <p>Messages</p>
          <div className="sidebarFriend">
            <UserPlus onClick={toggleFriendsbar} />
            {reqNumb > 0 ? <div className="Badge">{reqNumb}</div> : ""}
          </div>
        </div>
        <div className="Bar">
          <label htmlFor="conv">
            <Search />
            <input
              type="text"
              id="conv"
              placeholder="Search conversations..."
              value={searchInput}
              onInput={(ev) => setSearchInput(SanitizeInput(ev.target.value))}
            />
          </label>
        </div>
      </div>
      <div className="FriendsList">
        {pageLoading
          ? [...Array(Math.floor(Math.random()) + 5)].map((_, i) => (
              <button key={i} className="FriendTemplate Loading">
                <div className="Icon"></div>
                <div className="Center">
                  <div className="dis1"></div>
                  <div className="dis1"></div>
                </div>
              </button>
            ))
          : search &&
            search.map(
              ([
                id,
                {
                  created_at,
                  display_name,
                  last_message,
                  seen,
                  sender_id,
                  unseen_count,
                  username,
                  avatar = null,
                  presence = false,
                },
              ]) => {
                return (
                  <button
                    className={`FriendTemplate ${currentfriend.id == id ? "selectedBTN" : ""}`}
                    key={id}
                    id={id}
                    onClick={() =>
                      openConversation({
                        id: id,
                        username: username,
                        display_name: display_name,
                      })
                    }
                  >
                    <div className="Icon">
                      <img src={avatar ? `${avatar}` : Avatar} alt="Avatar" />
                      <div
                        className={`activity ${presence ? "online" : "offline"}`}
                      >
                        <div className="dot"></div>
                      </div>
                    </div>
                    <div className="Center">
                      <h4>{display_name}</h4>
                      {friendisTyping[id]?.ongoing ? (
                        <p>{`${display_name} Writing ${".".repeat(friendisTyping[id]?.dots)}`}</p>
                      ) : (
                        <p>{last_message}</p>
                      )}
                    </div>
                    <div className="Right">
                      <p>{formatedDate(created_at)}</p>
                      {unseen_count > 0 && (
                        <div className="Badge">{unseen_count}</div>
                      )}
                    </div>
                  </button>
                );
              },
            )}
      </div>
      <div className="OwnBar">
        <div className={`Options ${isActive ? "active" : ""}`}>
          <div className="Settings">
            <button onClick={settings}>
              <Settings /> Settings
            </button>
            <button className="logout" onClick={logout}>
              <LogOut /> Logout
            </button>
          </div>
        </div>
        <button
          onClick={() => setIsActive(!isActive)}
          className="FriendTemplate"
          key={me.id}
          id={me.id}
        >
          <div className="Icon">
            <img src={me.avatar ? `${me.avatar}` : Avatar} alt="Avatar" />
            <div className={`activity ${me.presence ? "online" : "offline"}`}>
              <div className="dot"></div>
            </div>
          </div>
          <div className="Center">
            <h4>{me.display_name}</h4>
            <h5>@{me.username}</h5>
          </div>
        </button>
      </div>
    </div>
  );
}
