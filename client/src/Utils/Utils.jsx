export const SanitizeInput = (input) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
};

export const getUser = async () => {
  try {
    const result = await fetch(`${import.meta.env.VITE_PATH_SERVER}/auth/`, {
      method: "GET",
      credentials: "include",
    });

    const response = await result.json();

    if (response) return response;
    else return false;
  } catch (err) {
    console.error(err);
  }
};

export const getFriendsList = async () => {
  try {
    const result = await fetch(
      `${import.meta.env.VITE_PATH_SERVER}/friends/list`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!result.ok) throw new Error(`HTTP error: ${result.status}`);

    const response = await result.json();
    return response.friends;
  } catch (err) {
    console.error(err);
  }
};

export const formatedDate = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()

  const isToday = date.toDateString() === now.toDateString()

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)

  const isYesterday = date.toDateString() === yesterday.toDateString()

  if (isToday) return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

    if (isYesterday) return "Yesterday"

    return date.toLocaleDateString([], { day: "2-digit", month: "short" });
};
