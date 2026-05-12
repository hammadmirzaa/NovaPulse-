import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import SendEvent from './pages/SendEvent';
import Health from './pages/Health';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/send" element={<SendEvent />} />
          <Route path="/health" element={<Health />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
