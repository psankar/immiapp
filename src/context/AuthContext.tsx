import axios, { AxiosInstance, AxiosStatic } from "axios";
import React, { createContext, useState } from "react";
import BASE_URL from "../config";

export interface AuthContextType {
  isLoggedIn: boolean;
  login: (_authToken: string, _refreshToken: string) => void;
  logout: () => void;
  refreshAuthToken: () => void;
}

export var saxios: AxiosInstance = axios.create({});

export var AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: (_authToken: string, _refreshToken: string) => {},
  logout: () => {},
  refreshAuthToken: () => {},
});

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthContextProviderProps) => {
  var [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (authToken: string, refreshToken: string) => {
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("authToken", authToken);

    saxios = axios.create({
      baseURL: BASE_URL,
    });

    saxios.interceptors.request.use(
      (config) => {
        authToken = localStorage.getItem("authToken") || "";
        config.headers.Authorization = `Bearer ${authToken}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    saxios.interceptors.response.use(
      function (response) {
        // 2xx response - So nothing to handle
        return response;
      },

      async function (error) {
        // 452 status code is for expired auth_token
        if (error.response?.status === 452) {
          try {
            await refreshAuthToken();

            // retry the original request that got 452
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${localStorage.getItem(
              "authToken"
            )}`;
            return saxios(originalRequest);
          } catch (err) {
            // handle 4xx/5xx response for refresh-token call
            console.error("auth_token could not be refreshed", err);
            logout();
            throw error;
          }
        } else if (error.response?.status === 401) {
          logout();
          throw error;
        }

        return Promise.reject(error);
      }
    );

    setIsLoggedIn(true);
  };

  const refreshAuthToken = async () => {
    const { data } = await axios.post(`${BASE_URL}/refresh-token`, {
      refresh_token: localStorage.getItem("refreshToken"),
    });

    const newAuthToken = data.auth_token;
    localStorage.setItem("authToken", newAuthToken);
  };

  const logout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  const authToken = localStorage.getItem("authToken");
  const refreshToken = localStorage.getItem("refreshToken");
  if (authToken && refreshToken && !isLoggedIn) {
    login(authToken, refreshToken);
  }

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, refreshAuthToken, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
