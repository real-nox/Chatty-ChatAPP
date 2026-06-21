export const accept_request = catchAsync(async (user_id) => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/friends/requests/${user_id}/accept`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ user_id: user_id }),
      headers: { "Content-Type": "application/json" },
    },
  );

  const data = await response.json();
  return data;
});

export const reject_sent = catchAsync(async (user_id) => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/friends/requests/${user_id}/decline/request`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ user_id: user_id }),
      headers: { "Content-Type": "application/json" },
    },
  );

  const data = await response.json();
  return data;
});

export const reject_request = catchAsync(async (user_id) => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/friends/requests/${user_id}/decline/sent`,
    {
      method: "PATCH",
      credentials: "include",
      body: JSON.stringify({ user_id: user_id }),
      headers: { "Content-Type": "application/json" },
    },
  );

  const data = await response.json();
  return data;
});

export const send_friend_request = catchAsync(async (user_id) => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/friends/requests/send`,
    {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({ user_id: user_id }),
      headers: { "Content-Type": "application/json" },
    },
  );

  const data = await response.json();
  return data;
});

export const fetch_friend = catchAsync(async (searchInput) => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/friends/fetch?search=${searchInput}`,
    {
      method: "POST",
      credentials: "include",
    },
  );
  const data = await response.json();
  return data;
});

export const get_sent_requests = catchAsync(async () => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/friends/requests/sent`,
    {
      method: "GET",
      credentials: "include",
    },
  );
  const data = await response.json();
  return data;
});

export const getFriendRequests = catchAsync(async () => {
  const response = await fetch(
    `import.meta.env.VITE_PATH_SERVER}/friends/requests/requests`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const response = await result.json();
  return response;
});

export const getFriendsList = catchAsync(async () => {
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
});

export const getNoti = catchAsync(async (sender_id) => {
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

  if (data) return data;
});

export const setNoti = catchAsync(async (sender_id) => {
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

  if (data) return data;
});
