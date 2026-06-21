export const getUser = catchAsync(async () => {
  const result = await fetch(`${import.meta.env.VITE_PATH_SERVER}/auth/`, {
    method: "GET",
    credentials: "include",
  });

  const response = await result.json();

  if (response) return response;
  else return false;
});

export const getFullUser = catchAsync(async () => {
  const result = await fetch(`${import.meta.env.VITE_PATH_SERVER}/user/me`, {
    method: "GET",
    credentials: "include",
  });

  const response = await result.json();

  if (response) return response;
  else return false;
});

export const login = catchAsync(async (email, password, remember_me) => {
  const result = await fetch(`${import.meta.env.VITE_PATH_SERVER}/auth/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email,
      pwd: password,
      remember_me: remember_me,
    }),
  });

  const response = await result.json();

  if (response) return response;
  else return false;
});

export const logout = catchAsync(async () => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/auth/logout`,
    {
      method: "GET",
      credentials: "include",
    },
  );

  const data = await response.json();
  if (response) return response;
  else return false;
});

export const getTheme = catchAsync(async () => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/user/theme`,
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
});

export const setTheme = catchAsync(async (theme) => {
  const response = await fetch(
    `${import.meta.env.VITE_PATH_SERVER}/user/theme`,
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
});
