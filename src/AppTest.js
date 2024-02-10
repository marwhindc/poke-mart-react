import { useEffect, useState } from 'react';
import './App.css';
import LoginPage from './components/LoginPage';
import { useLocalState } from './services/LocalStorageUtil';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import PrivateRoute from './components/PrivateRoute';
import ProductPage from './components/ProductPage';
import axios from 'axios';
import React from 'react';
import { Helmet } from 'react-helmet';
import PrevPurchasePage from './components/PrevPurchasePage';
import CartPage from './components/CartPage';
import RegisterPage from './components/RegisterPage';
import LoadingPage from './components/LoadingPage';

const AppTest = () => {
  return (
    <Router>
      <Helmet>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <Routes>
        <Route path="/login" element={<LoginPage title="Mart - Login" />} />
        <Route
          path="/register"
          element={<RegisterPage title="Mart - Register" />}
        />
        <Route
          path={'/products'}
          element={
            <PrivateRoute>
              <ProductPage title="Mart - Products" />
            </PrivateRoute>
          }
        />
        <Route
          path={'/'}
          element={
            <PrivateRoute>
              <ProductPage title="Mart - Products" />
            </PrivateRoute>
          }
        />
        <Route
          path={'/purchases'}
          element={
            <PrivateRoute>
              <PrevPurchasePage title="Mart - Purchases" />
            </PrivateRoute>
          }
        />
        <Route
          path={'/cart'}
          element={
            <PrivateRoute>
              <CartPage title="Mart - Cart" />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default AppTest;
