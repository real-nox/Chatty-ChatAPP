import { Search, UserPlus, UsersRound, X } from "lucide-react";
import { SanitizeInput } from "../utils/Utils";
import { useEffect, useState } from "react";

export default function FriendsComponent({ isFriendCard, toggleFriendsbar }) {
  const [searchInput, setSearchInput] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (searchInput.length == 0) return setUsers([]);
      const link = `${import.meta.env.VITE_PATH_SERVER}/friends/fetch`;

      if (searchInput.length == 0) return setUsers("");
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
  }, [searchInput]);

  return (
    <div className="FriendsContainerWrapper">
      {console.log(users, searchInput.length)}
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
              <div className="Buttons">
                <button>Add People</button>
                <button>Requests</button>
                <button>Sent</button>
              </div>
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
                {users &&
                  users.map(({ id, display_name, username, avatar = null }) => {
                    return (
                      <button className="FriendTemplate" key={id} id={id}>
                        <div className="Icon">
                          <img
                            src={avatar ? `${avatar}` : "../../img/avatar.png"}
                            alt="Avatar"
                          />
                        </div>
                        <div className="Center">
                          <h4>{display_name}</h4>
                          <p>@{username}</p>
                        </div>
                        <div className="Right"></div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
