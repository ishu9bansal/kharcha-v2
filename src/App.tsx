// src/App.tsx
import React, { useCallback, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from "react-router-dom";
import { AppBar, Tabs, Tab, Container } from "@mui/material";
import ExpenseFormPage from "./pages/ExpenseFormPage";
import ExpenseListPage from "./pages/ExpenseListPage";
import { contentContainerStyle, selectedTabStyle } from "./App.style";
import { useTranslation } from "react-i18next";
import { setUpLocales } from "./i18n";
import { AllTabs, HeaderTab, TabLabel, TabPath } from "./constants/TabConstants";

function App() {
  const location = useLocation();

  // Determine the active tab based on the current path
  const getActiveTab = useCallback(() => {
    return AllTabs.findIndex((tab: HeaderTab) => TabPath[tab] === location.pathname);
  }, [location]);

  useEffect(() => {
    setUpLocales();
  }, []);

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
        <Routes>
          <Route path={TabPath[HeaderTab.AddExpense]} element={<ExpenseFormPage />} />
          <Route path={TabPath[HeaderTab.ViewExpenses]} element={<ExpenseListPage />} />
        </Routes>
      </Container>
    </>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
