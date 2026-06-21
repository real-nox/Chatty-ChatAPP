export const SanitizeInput = (input) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
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

export const apiCall = (fct) => async(...arg) => {
  try {
    return await fct(...arg);
  } catch (err) {
    console.error(err)
    return { success: false, error: "Something went wrong. Please try again." };
  }
}