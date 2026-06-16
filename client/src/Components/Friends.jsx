import { Search, UserPlus, UsersRound, X } from "lucide-react";
import { SanitizeInput } from "../utils/Utils";
import { useState } from "react";

export default function FriendsComponent({ isFriendCard }) {
  const [searchInput, setSearchInput] = useState("");
  return (
    <div className="FriendsContainerWrapper">
      <div className={`FriendsContainer ${isFriendCard && "show"}`}>
        <div className="FriendsCard">
          <div className="HeaderCard">
            <div className="containerHeader">
              <div className="Left">
                <UsersRound />
                <p>Friends</p>
              </div>
              <div className="Right">
                <X />
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
          <div className="List">
            <div className="AddFriend">
              <div className="SearchBar">
                <div className="Bar">
                  <Search />
                  <input
                    type="text"
                    placeholder="Search conversations..."
                    value={searchInput}
                    onInput={(ev) =>
                      setSearchInput(SanitizeInput(ev.target.value))
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
