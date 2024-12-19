// Set the SameSite and Secure attributes based on the environment
export const SameSite = process.env.NODE_ENV === 'production' ? 'None' : 'Lax';
export const secure = process.env.NODE_ENV === 'production';

// Set the authentication token
export const setAuthToken = (token) => {
  const secureAttribute = secure ? ' Secure;' : '';
  document.cookie = `Authorization=${token}; Path=/; Max-Age=${60 * 60 * 24 * 30}; SameSite=${SameSite};${secureAttribute}`;
  localStorage.setItem("token", token);
  console.log("Set Cookie:", document.cookie);
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
