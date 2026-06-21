import { apiCall } from "../Utils/Utils";

export const accept_request = apiCall(async (user_id) => {
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

export const reject_sent = apiCall(async (user_id) => {
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

export const reject_request = apiCall(async (user_id) => {
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

export const send_friend_request = apiCall(async (user_id) => {
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

export const fetch_friend = apiCall(async (searchInput) => {
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

export const get_sent_requests = apiCall(async () => {
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

export const getFriendRequests = apiCall(async () => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/friends/requests/requests`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await response.json();
  return data;
});

export const getFriendsList = apiCall(async () => {
  const result = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/friends/list`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  if (!result.ok) throw new Error(`HTTP error: ${result.status}`);

  const data = await result.json();

  console.log(data)
  if (data.success) return data.friends;
});

export const getNoti = apiCall(async (sender_id) => {
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

export const setNoti = apiCall(async (sender_id) => {
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
