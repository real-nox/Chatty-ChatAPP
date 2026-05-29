export const SanitizeInput = (input) => {
  const div = document.createElement("div");
  div.appendChild(document.createTextNode(input));
  return div.innerHTML;
};

export const getUser = async () => {
  try {
    console.log("here")
    const result = await fetch(`${import.meta.env.VITE_PATH_SERVER}/auth/`, {
      method: "GET",
      credentials: "include",
    });

    const response = await result.json();

    if (response) return true;
    else return false;
  } catch (err) {
    console.error(err);
  }
};
