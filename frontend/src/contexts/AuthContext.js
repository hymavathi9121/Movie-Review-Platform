import React, { createContext, useState, useEffect } from "react";
import API from "../api/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
      API.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  const register = async (username, email, password) => {
    const res = await API.post("/auth/register", { username, email, password });
    const { user, token } = res.data;
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    const { user, token } = res.data;
    setUser(user);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete API.defaults.headers.common["Authorization"];
  };

  return (
    <AuthContext.Provider value={{ user, token, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
