import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);

  return (
    <AuthContext.Provider value={{ sessionId, setSessionId }}>
      {children}
    </AuthContext.Provider>
  );
};
