import { useCallback } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab, Container } from "@mui/material";
import { ExpenseFormPage } from "./pages/ExpenseFormPage";
import { ExpenseListPage } from "./pages/ExpenseListPage";
import { contentContainerStyle, selectedTabStyle } from "./App.style";
import { useTranslation } from "react-i18next";
import { AllTabs, HeaderTab, TabLabel, TabPath } from "./constants/TabConstants";
import { LoginProvider, useLogin } from "./context/LoginContext";
import { Provider } from 'react-redux';
import store from './store/store';
import { useExpenseService } from "./store/slices/authSlice";
import { BaseUrl } from "./constants/UrlConstants";

function App() {
  const location = useLocation();
  const { loginComponent } = useLogin();
  const { expenseService, isAuthenticated } = useExpenseService();

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
            <Route path={TabPath[HeaderTab.AddExpense]} element={<ExpenseFormPage />} />
            <Route path={TabPath[HeaderTab.ViewExpenses]} element={<ExpenseListPage />} />
          </Routes>
        ) : (
          loginComponent(isAuthenticated)
        )}
      </Container>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Provider store={store}>
      <Router basename={BaseUrl}>
        <LoginProvider>
          <App />
        </LoginProvider>
      </Router>
    </Provider>
  );
}
