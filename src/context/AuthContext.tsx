// src/context/AuthContext.tsx
import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { generateCodeVerifier, generateCodeChallenge, pkceEnabled } from '../utils/pkce';
import axios from 'axios';
import { AuthScope, BaseUrl, CallbackUrl, CodeChallengeMethodS256, GoogleAuthUrl, GoogleTokenUrl, GrantTypeAuthorizationCode, KeyCodeVerifier, QueryParamClientId, QueryParamCode, QueryParamCodeChallenge, QueryParamCodeChallengeMethod, QueryParamRedirectUri, QueryParamResponseType, QueryParamScope, ResponseTypeCode } from '../constants/UrlConstants';

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
const redirectUri = `${process.env.REACT_APP_HOST_URL}${BaseUrl}${CallbackUrl}`;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // 3. if 'code' is detected in the query params this part is executed
    // should we limit this to only look when the path is like /auth/callback ??
    const params = new URLSearchParams(window.location.search);
    const code = params.get(QueryParamCode);
    const storedCodeVerifier = sessionStorage.getItem(KeyCodeVerifier);

    if (code && storedCodeVerifier) {
      exchangeCodeForToken(code, storedCodeVerifier);
    }
  }, []);

  const exchangeCodeForToken = async (code: string, codeVerifier: string) => {
    // 4. this part finally fetches the token to complete the auth 
    try {
      const response = await axios.post(GoogleTokenUrl, {
        code,
        client_id: reactAppClientId,
        client_secret: reactAppClientSecret,
        redirect_uri: redirectUri,
        grant_type: GrantTypeAuthorizationCode,
        code_verifier: codeVerifier,
      });

      setAccessToken(response.data.access_token);
      setIsAuthenticated(true);
      sessionStorage.removeItem(KeyCodeVerifier);
      window.history.replaceState({}, document.title, "/");
    } catch (error) {
      console.error('Error exchanging code for token', error);
    }
  };

  const login = async () => {
    // 1. This initiates the request with Google
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    sessionStorage.setItem(KeyCodeVerifier, codeVerifier);

    let googleAuthUrl = `${GoogleAuthUrl}?${QueryParamResponseType}=${ResponseTypeCode}`;
    googleAuthUrl = googleAuthUrl.concat(`&${QueryParamClientId}=${reactAppClientId}`);
    googleAuthUrl = googleAuthUrl.concat(`&${QueryParamRedirectUri}=${redirectUri}`);
    googleAuthUrl = googleAuthUrl.concat(`&${QueryParamScope}=${AuthScope}`);
    googleAuthUrl = googleAuthUrl.concat(`&${QueryParamCodeChallenge}=${codeChallenge}`);
    googleAuthUrl = googleAuthUrl.concat(`&${QueryParamCodeChallengeMethod}=${CodeChallengeMethodS256}`);
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
