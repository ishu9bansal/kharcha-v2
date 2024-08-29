// src/App.tsx
import { useCallback, useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab, Container } from "@mui/material";
import { ExpenseFormPage } from "./pages/ExpenseFormPage";
import { ExpenseListPage } from "./pages/ExpenseListPage";
import { contentContainerStyle, selectedTabStyle } from "./App.style";
import { useTranslation } from "react-i18next";
import { AllTabs, HeaderTab, TabLabel, TabPath } from "./constants/TabConstants";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { GoogleSheetsService } from "./services/GoogleSheetsService";
import { IExpenseService } from "./services/IExpenseService";
import { pkceEnabled } from "./utils/pkce";
import { LocalStorageService } from "./services/LocalStorageService";

function App() {
  const location = useLocation();
  const [ expenseService, setExpenseService ] = useState<IExpenseService | null>(null);
  const { accessToken, isAuthenticated, login } = useAuth();
  
  const expenseServiceInstantiator = (pkceEnabled: boolean, isAuthenticated: boolean, accessToken: string | null): IExpenseService | null => {
    if (!pkceEnabled) {
      return LocalStorageService.getInstance();
    }
    if (isAuthenticated && accessToken) {
      return GoogleSheetsService.getInstance(accessToken);
    }
    return null;
  }

  useEffect(() => {
    setExpenseService(expenseServiceInstantiator(pkceEnabled, isAuthenticated, accessToken));
  }, [setExpenseService, isAuthenticated, accessToken]);

  const getActiveTab = useCallback(() => {
    return AllTabs.findIndex((tab: HeaderTab) => TabPath[tab] === location.pathname);
  }, [location]);

  const { t } = useTranslation();

  return (
    <>
      <AppBar position="sticky">
        <Container>
          <Tabs value={getActiveTab()} centered>
            {AllTabs.map((tab: HeaderTab) => (
              <Tab
                key={tab}
                label={t(TabLabel[tab])}
                component={Link}
                to={TabPath[tab]}
                sx={selectedTabStyle}
              />
            ))}
          </Tabs>
        </Container>
      </AppBar>
      <Container sx={contentContainerStyle}>
        {expenseService ? (
          <Routes>
            <Route path={TabPath[HeaderTab.AddExpense]} element={<ExpenseFormPage expenseService={expenseService} />} />
            <Route path={TabPath[HeaderTab.ViewExpenses]} element={<ExpenseListPage expenseService={expenseService} />} />
          </Routes>
        ) : (
          <button onClick={login}>Login with Google</button>
        )}
      </Container>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router basename="/kharcha-v2">
      <AuthProvider>
        <App />
      </AuthProvider>
    </Router>
  );
}


/**
 * Modifications made to the code and next steps
 * 
 * ChatGPT code:
 *  pkce integration
 *  AuthContext
 *  GooggleSheetsService
 *  googleSheetsHelper
 *  auth context modifications in App.tsx
 * 
 * Modifications:
 *  Addition of client_secret in AuthContext
 *  Dont export the local service injected Pages by default
 *  Modify GoogleSheetsService to not use useAuth method, and set accessToken in instance
 *  Delete unnecessary UserSheetManager file
 *  change target in tsconfig file
 *  pick client id and secret from env variables or default in code
 * 
 * Next steps:
 *  Google drive get and create methods are out of scope of the current token
 *  Improve login experience
 *  Masking client id and secret
 *  local and sheet hybrid
 * 
 * Bug fixes:
 *  access token expiry handling
 *  expense serialize - deserialize
 *  create new sheet with the column names
 *  
 */