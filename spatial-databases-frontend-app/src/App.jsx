import React, { useCallback, useEffect, useRef, useState, useMemo, useContext } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Оборачиваем все маршруты в Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          {/* Можно добавить 404 */}
          <Route path="*" element={<div>404 — Страница не найдена</div>} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App;
