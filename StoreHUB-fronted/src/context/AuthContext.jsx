import React, { createContext, useState, useContext, useEffect } from "react";
import apiClient from "../utils/apiClient";
import { getAuthToken, removeAuthToken, setAuthToken } from "../utils/auth";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authToken, setAuthTokenState] = useState(getAuthToken());

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!authToken) {
        setIsLoading(false);
        return;
      }

      try {
        const { data } = await apiClient.get("/users/me");
        setUser(data);
      } catch (error) {
        console.error("Error fetching user details:", error.message);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [authToken]);

  const login = async (credentials) => {
    try {
      const { data } = await apiClient.post("/login", credentials);
      setAuthToken(data.token);
      setAuthTokenState(data.token);
      return data;
    } catch (error) {
      console.error("Login error:", error.message);
      throw new Error("Invalid login credentials");
    }
  };

  const logout = () => {
    removeAuthToken();
    setAuthTokenState(null);
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {!isLoading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
