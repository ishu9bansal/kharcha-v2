// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import { AppBar, Tabs, Tab, Container } from '@mui/material';
import ExpenseFormPage from './pages/ExpenseFormPage';
import ExpenseListPage from './pages/ExpenseListPage';

function App() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Router>
      <AppBar position="static">
        <Container>
        <Tabs value={value} onChange={handleChange} centered>
            <Tab
              label="Add Expense"
              component={Link}
              to="/"
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#fff',
                  color: '#1976d2',
                  borderRadius: '8px 8px 0 0',
                },
              }}
            />
            <Tab
              label="View Expenses"
              component={Link}
              to="/expenses"
              sx={{
                '&.Mui-selected': {
                  backgroundColor: '#fff',
                  color: '#1976d2',
                  borderRadius: '8px 8px 0 0',
                },
              }}
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
