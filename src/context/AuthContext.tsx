// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { generateCodeVerifier, generateCodeChallenge } from '../utils/pkce';
import axios from 'axios';

interface AuthContextProps {
  accessToken: string | null;
  isAuthenticated: boolean;
  login: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  accessToken: null,
  isAuthenticated: false,
  login: () => {},
});

const reactAppClientId = process.env.REACT_APP_CLIENT_ID;
const reactAppClientSecret = process.env.REACT_APP_CLIENT_SECRET;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const storedCodeVerifier = sessionStorage.getItem('codeVerifier');

    if (code && storedCodeVerifier) {
      exchangeCodeForToken(code, storedCodeVerifier);
    }
  }, []);

  const exchangeCodeForToken = async (code: string, codeVerifier: string) => {
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: reactAppClientId,
        client_secret: reactAppClientSecret,
        redirect_uri: 'http://localhost:3000/auth/callback',
        grant_type: 'authorization_code',
        code_verifier: codeVerifier,
      });

      setAccessToken(response.data.access_token);
      setIsAuthenticated(true);
      sessionStorage.removeItem('codeVerifier');
      window.history.replaceState({}, document.title, "/");
    } catch (error) {
      console.error('Error exchanging code for token', error);
    }
  };

  const login = async () => {
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem('codeVerifier', codeVerifier);

    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${reactAppClientId}&redirect_uri=http://localhost:3000/auth/callback&scope=https://www.googleapis.com/auth/drive.file%20profile%20email&code_challenge=${codeChallenge}&code_challenge_method=S256`;

    window.location.href = googleAuthUrl;
  };

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
