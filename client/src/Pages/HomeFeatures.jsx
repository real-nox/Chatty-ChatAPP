import { useEffect } from "react";

export default function HomeFeatures() {
    useEffect(() => {
      document.title = "Features | Chatty - Chat App";
    }, [])

  return (
    <>
      <div className="TopFeatures">
        <p>Coming soon</p>
      </div>
    </>
  );
}
