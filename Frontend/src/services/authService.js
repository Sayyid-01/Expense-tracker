
export const signup = async (data) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};

export const login = async (data) => {
  const response = await fetch(`${import.meta.env.VITE_BACKEND_API}/users/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return await response.json();
};