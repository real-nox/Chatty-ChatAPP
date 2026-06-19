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

export const getFullUser = async () => {
  try {
    const result = await fetch(`${import.meta.env.VITE_PATH_SERVER}/auth/me`, {
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
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isYesterday) return "Yesterday";

  return date.toLocaleDateString([], { day: "2-digit", month: "short" });
};

export const formatedDateMsg = (timestamp) => {
  const date = new Date(timestamp);
  const now = new Date();

  const isToday = date.toDateString() === now.toDateString();

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const isYesterday = date.toDateString() === yesterday.toDateString();

  if (isToday)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  if (isYesterday)
    return (
      "Yesterday | " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );

  return date.toLocaleDateString([], { day: "2-digit", month: "short" });
};

export const getTheme = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PATH_SERVER}/auth/theme`,
      {
        credentials: "include",
        method: "GET",
      },
    );

    const data = await response.json();

    if (data.success) {
      if (data.theme === "dark") return "Dark";
      else return "Light";
    }
  } catch (err) {
    console.error(err);
  }
};

export const setTheme = async (theme) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PATH_SERVER}/auth/theme`,
      {
        credentials: "include",
        method: "PATCH",
        body: JSON.stringify({ theme: theme.toLowerCase() }),
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();

    if (data.success) {
      if (data.theme === "dark") return "Dark";
      else return "Light";
    }
  } catch (err) {
    console.error(err);
  }
};

export const getNoti = async (sender_id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PATH_SERVER}/friends/requests/notification`,
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ sender_id: sender_id }),
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();

    if (data)
      return data
  } catch (err) {
    console.error(err);
  }
};

export const setNoti = async (sender_id) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_PATH_SERVER}/friends/requests/notification/edit`,
      {
        credentials: "include",
        method: "POST",
        body: JSON.stringify({ sender_id: sender_id }),
        headers: { "Content-Type": "application/json" },
      },
    );

    const data = await response.json();

    if (data)
      return data
  } catch (err) {
    console.error(err);
  }
};