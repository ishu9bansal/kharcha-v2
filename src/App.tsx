// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Tabs, Tab, Container } from "@mui/material";
import ExpenseFormPage from "./pages/ExpenseFormPage";
import ExpenseListPage from "./pages/ExpenseListPage";
import { selectedTabStyle } from "./App.style";
import { useTranslation } from "react-i18next";
import { setUpLocales } from "./i18n";
import { AllTabs, HeaderTab, TabLabel, TabPath } from "./constants/TabConstants";

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
    setUpLocales();
  }, []);

  const { t } = useTranslation();

  return (
    <Router>
      <AppBar position="sticky">
        <Container>
          <Tabs value={value} onChange={handleChange} centered>
            {AllTabs.map((tab: HeaderTab) => (
              <Tab
                label={t(TabLabel[tab])}
                component={Link}
                to={TabPath[tab]}
                sx={selectedTabStyle}
              />
            ))}
          </Tabs>
        </Container>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path={TabPath[HeaderTab.AddExpense]} element={<ExpenseFormPage />} />
          <Route path={TabPath[HeaderTab.ViewExpenses]} element={<ExpenseListPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
