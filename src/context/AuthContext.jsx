import { createContext, useCallback, useContext, useEffect, useState } from "react";
import {
  getCurrentUser as fetchCurrentUser,
  logoutUser,
} from "../services/authService";
import { initSocket } from "../utils/socketClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    try {
      return window.sessionStorage.getItem("access_token");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken || null);
    try {
      if (authToken) {
        window.sessionStorage.setItem("access_token", authToken);
      } else {
        window.sessionStorage.removeItem("access_token");
      }
    } catch {
      // ignore session storage failures
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
      setToken(null);
      try {
        window.sessionStorage.removeItem("access_token");
      } catch {
        // ignore storage errors
      }
    }
  };

  const getCurrentUser = useCallback(async () => {
    try {
      const { data } = await fetchCurrentUser();
      setUser(data);
      return data;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    (async () => {
      const data = await getCurrentUser();
      if (data) {
        try {
          const storedToken = token || window.sessionStorage.getItem("access_token");
          initSocket(data._id || data.id || data.userId, storedToken);
        } catch (err) {
          console.error("Socket init failed", err);
        }
      }
    })();
  }, [getCurrentUser, token]);

  useEffect(() => {
    if (!user) return;

    try {
      const storedToken = token || window.sessionStorage.getItem("access_token");
      initSocket(user._id || user.id || user.userId, storedToken);
    } catch (err) {
      console.error("Socket init failed", err);
    }
  }, [user, token]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setLoading(false);
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);

    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
    };
  }, []);

  const clearUser = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
        clearUser,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
