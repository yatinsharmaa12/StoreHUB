export const setAuthToken = (token) => {
  document.cookie = `Authorization=${token}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=None;`;
  localStorage.setItem("token", token);
  console.log(document.cookie);
};

export const getAuthToken = () => {
  const cookieToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("Authorization="))
    ?.split("=")[1];

  return cookieToken || localStorage.getItem("token");
};

export const removeAuthToken = () => {
  document.cookie = "Authorization=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT";
  localStorage.removeItem("token");
};
