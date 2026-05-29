import { Search } from "lucide-react";

export default function SideBar() {
  return (
    <div className="SideBar">
      <div className="Title">
        <h1>Messages</h1>
      </div>
      <div className="SearchBar">
        <div className="Bar">
          <Search />
          <input type="text" placeholder="Search conversations..." />
        </div>
      </div>
    </div>
  );
}
