import { Search, UserPlus } from "lucide-react";
import { formatedDate, SanitizeInput } from "../utils/Utils";
import { useEffect, useMemo, useState } from "react";

export default function SideBar({
  friendList,
  friendisTyping,
  currentfriend,
  openConversation,
  isOpen,
  toggleFriendsbar
}) {
  const [searchInput, setSearchInput] = useState("");

  const search = useMemo(() => {
    const query = searchInput.trim().toLowerCase();
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

  return (
    <div className={`SideBar ${!isOpen ? "closed" : ""}`}>
      <div className="SearchBar">
        <div className="Title">
          <p>Messages</p>
          <UserPlus onClick={toggleFriendsbar}/>
        </div>
        <div className="Bar">
          <Search />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchInput}
            onInput={(ev) => setSearchInput(SanitizeInput(ev.target.value))}
          />
        </div>
      </div>
      <div className="FriendsList">
        {search.map(
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
                  <img
                    src={avatar ? `${avatar}` : "../../img/avatar.png"}
                    alt="Avatar"
                  />
                  <div
                    className={`activity ${presence ? "online" : "offline"}`}
                  >
                    <div className="dot"></div>
                  </div>
                </div>
                <div className="Center">
                  <h4>{display_name}</h4>
                  {friendisTyping.ongoing ? (
                    <p>{`${currentfriend.display_name} Writing ${".".repeat(friendisTyping.dots)}`}</p>
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
    </div>
  );
}
