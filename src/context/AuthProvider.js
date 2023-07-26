import React, { createContext, useState } from "react";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(
    JSON.parse(sessionStorage.getItem("auth"))
      ? JSON.parse(sessionStorage.getItem("auth"))
      :  JSON.parse(localStorage.getItem("auth"))
      ? JSON.parse(localStorage.getItem("auth"))
      : {}
  );

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
