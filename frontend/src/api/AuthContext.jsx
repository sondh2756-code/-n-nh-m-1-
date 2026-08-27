import { createContext, useContext, useEffect, useState } from "react";
import { authApi, usersApi, setAccessToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Khi app khoi dong, thu goi /auth/refresh de xem con phien dang nhap khong
  // (accessToken chi luu trong bo nho, mat khi F5, nhung refreshToken nam trong cookie)
  useEffect(() => {
    (async () => {
      try {
        const data = await authApi.refresh();
        setAccessToken(data.accessToken);
        const me = await usersApi.getMe();
        setUser(me);
      } catch (err) {
        // Chua dang nhap hoac refreshToken het han - binh thuong, coi nhu guest
        setAccessToken(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function signin(username, password) {
    const data = await authApi.signin({ username, password });
    setAccessToken(data.accessToken);
    const me = await usersApi.getMe();
    setUser(me);
    return me;
  }

  async function signup(payload) {
    return authApi.signup(payload);
  }

  async function signout() {
    await authApi.signout();
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, signout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth phải dùng bên trong AuthProvider");
  return ctx;
}
