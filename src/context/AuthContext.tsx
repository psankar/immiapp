import axios, { AxiosInstance, AxiosStatic } from "axios";
import React, { createContext, useState } from "react";
import BASE_URL from "../config";

export interface AuthContextType {
  isLoggedIn: boolean;
  authToken: string;
  login: (_authToken: string, _refreshToken: string) => void;
  logout: () => void;
}

export var saxios: AxiosInstance = axios.create({});

export var AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  authToken: "",
  login: (_authToken: string, _refreshToken: string) => {},
  logout: () => {},
});

type AuthContextProviderProps = {
  children: React.ReactNode;
};

export const AuthProvider = ({ children }: AuthContextProviderProps) => {
  var [isLoggedIn, setIsLoggedIn] = useState(false);
  var [authToken, setAuthToken] = useState("");

  const login = (authToken: string, refreshToken: string) => {
    localStorage.setItem("refreshToken", refreshToken);
    setAuthToken(authToken);

    saxios = axios.create({
      baseURL: BASE_URL,
    });

    var reqInterceptor = saxios.interceptors.request.use(
      (config) => {
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
            const { data } = await axios.get(`${BASE_URL}/refresh-token`, {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            });

            const newAuthToken = data.auth_token;
            setAuthToken(newAuthToken);

            // remove the old request interceptor
            saxios.interceptors.request.eject(reqInterceptor);

            // add a new request interceptor with the new auth_token
            reqInterceptor = saxios.interceptors.request.use(
              (config) => {
                config.headers.Authorization = `Bearer ${newAuthToken}`;
                return config;
              },
              (error) => {
                return Promise.reject(error);
              }
            );

            // retry the original request
            return saxios(error.response.request);
          } catch (err) {
            // handle 4xx/5xx response for refresh-token call
            console.error("auth_token could not be refreshed", err);
            logout();
            throw error;
          }
        }

        return Promise.reject(error);
      }
    );

    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("refreshToken");
    setAuthToken("");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, authToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
