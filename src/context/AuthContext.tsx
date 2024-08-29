// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { generateCodeVerifier, generateCodeChallenge, pkceEnabled } from '../utils/pkce';
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

const reactAppClientId = pkceEnabled ? process.env.REACT_APP_CLIENT_ID : undefined;
const reactAppClientSecret = pkceEnabled ? process.env.REACT_APP_CLIENT_SECRET : undefined;
const redirectUri = 'http://localhost:3000/kharcha-v2/auth/callback';
const authScope = 'https://www.googleapis.com/auth/drive.file%20profile%20email';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // 3. if 'code' is detected in the query params this part is executed
    // should we limit this to only look when the path is like /auth/callback ??
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const storedCodeVerifier = sessionStorage.getItem('codeVerifier');

    if (code && storedCodeVerifier) {
      exchangeCodeForToken(code, storedCodeVerifier);
    }
  }, []);

  const exchangeCodeForToken = async (code: string, codeVerifier: string) => {
    // 4. this part finally fetches the token to complete the auth 
    try {
      const response = await axios.post('https://oauth2.googleapis.com/token', {
        code,
        client_id: reactAppClientId,
        client_secret: reactAppClientSecret,
        redirect_uri: redirectUri,
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
    // 1. This initiates the request with Google
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem('codeVerifier', codeVerifier);

    let googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code`;
    googleAuthUrl = googleAuthUrl.concat(`&client_id=${reactAppClientId}`);
    googleAuthUrl = googleAuthUrl.concat(`&redirect_uri=${redirectUri}`);
    googleAuthUrl = googleAuthUrl.concat(`&scope=${authScope}`);
    googleAuthUrl = googleAuthUrl.concat(`&code_challenge=${codeChallenge}`);
    googleAuthUrl = googleAuthUrl.concat(`&code_challenge_method=S256`);
    window.location.href = googleAuthUrl;
    // 2. Google redirects the user on the redirect uri, with the code in the params
  };

  return (
    <AuthContext.Provider value={{ accessToken, isAuthenticated, login }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
