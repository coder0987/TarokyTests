// src/app/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { authController } from "../engine/AuthEngine";
import { Account } from "@/types";

type IContextType = {
  account: Account;
  isAuthenticated: boolean;
};

const INITIAL_STATE: IContextType = {
  account: authController.account,
  isAuthenticated: authController.isAuthenticated
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const updateHandler = () => forceRender((x) => x + 1);
    const unsub = authController.subscribe(updateHandler);

    return () => {
      unsub();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        account: authController.account,
        isAuthenticated: authController.isAuthenticated
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useUserContext = () => useContext(AuthContext);
