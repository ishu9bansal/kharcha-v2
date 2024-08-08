// src/App.tsx
import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { AppBar, Tabs, Tab, Container } from "@mui/material";
import ExpenseFormPage from "./pages/ExpenseFormPage";
import ExpenseListPage from "./pages/ExpenseListPage";
import { selectedTabStyle } from "./App.style";
import { useTranslation } from "react-i18next";
import { setUpLocales } from "./i18n";

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
            <Tab
              label={t("tab-label-add-expense")}
              component={Link}
              to="/"
              sx={selectedTabStyle}
            />
            <Tab
              label={t("tab-label-view-expenses")}
              component={Link}
              to="/expenses"
              sx={selectedTabStyle}
            />
          </Tabs>
        </Container>
      </AppBar>
      <Container sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<ExpenseFormPage />} />
          <Route path="/expenses" element={<ExpenseListPage />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;
