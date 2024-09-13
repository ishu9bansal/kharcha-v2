import React, { createContext, useEffect, ReactNode, useContext } from 'react';
import { generateCodeVerifier, generateCodeChallenge, pkceEnabled } from '../utils/pkce';
import axios from 'axios';
import { AuthScope, BaseUrl, CallbackUrl, CodeChallengeMethodS256, GoogleAuthUrl, GoogleTokenUrl, GrantTypeAuthorizationCode, KeyCodeVerifier, QueryParamClientId, QueryParamCode, QueryParamCodeChallenge, QueryParamCodeChallengeMethod, QueryParamRedirectUri, QueryParamResponseType, QueryParamScope, RelativeAddExpense, ResponseTypeCode } from '../constants/UrlConstants';
import { authError, setAccessToken } from '../store/slices/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HeaderTab, TabPath } from '../constants/TabConstants';

interface LoginContextProps {
  loginComponent: (isAuthenticated: boolean) => ReactNode;
}

const LoginContext = createContext<LoginContextProps>({
  loginComponent: () => (<></>),
});

const reactAppClientId = pkceEnabled ? process.env.REACT_APP_CLIENT_ID : undefined;
const reactAppClientSecret = pkceEnabled ? process.env.REACT_APP_CLIENT_SECRET : undefined;
const redirectUri = `${process.env.REACT_APP_HOST_URL}${BaseUrl}${CallbackUrl}`;

export const LoginProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    // 3. if 'code' is detected in the query params this part is executed
    // should we limit this to only look when the path is like /auth/callback ??
    const params = new URLSearchParams(window.location.search);
    const code = params.get(QueryParamCode);
    const storedCodeVerifier = sessionStorage.getItem(KeyCodeVerifier);

    if (code && storedCodeVerifier) {
      exchangeCodeForToken(code, storedCodeVerifier)
      .then((token: string) => dispatch(setAccessToken(token)))
      .catch((error: string | null) => dispatch(authError(error)));
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

      sessionStorage.removeItem(KeyCodeVerifier);
      window.history.replaceState({}, document.title, `${BaseUrl}${RelativeAddExpense}`);
      navigate(TabPath[HeaderTab.ViewExpenses]);
      return response.data.access_token;
    } catch (error) {
      const errorString = `Error exchanging code for token`;
      console.error(errorString, error);
      throw errorString;
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

  const loginComponent = (isAuthenticated: boolean) => (
    isAuthenticated ? (
      <>Loading...</>
    ) : (
      <button onClick={login}>Login with Google</button>
    )
  );

  return (
    <LoginContext.Provider value={{ loginComponent }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
