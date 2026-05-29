import { useEffect } from "react";
import "../css/Home.css";
import SideBar from "../Components/SideBar";

export default function Home() {

  useEffect(() => {
    document.title = "Home | Chatty - Chat App";
    document.documentElement.setAttribute('data-theme', "Light")
  }, [])


  return <div className="HomeContainer">
    <SideBar />
  </div>;
}
