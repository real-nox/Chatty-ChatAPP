import { useEffect } from "react";

export default function HomeAbout() {
  useEffect(() => {
    document.title = "About | Chatty - Chat App";
  }, []);

  return (
    <>
      <div className="TopHome">
        <div className="Elements">
          <h1>About Chatty</h1>
          <p>
            We're on a mission to connect the world through seamless, secure,
            and delightful communication.
          </p>
        </div>
      </div>
      <div className="MeetTeam">
        <h1>Meet Our Team</h1>
      </div>
    </>
  );
}
