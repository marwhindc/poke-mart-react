import './App.css';
import ProductPage from './components/ProductPage';
import { BrowserRouter as Router } from 'react-router-dom';
import { Routes, Route } from 'react-router';
import { Helmet } from 'react-helmet';
import PrevPurchasePage from './components/PrevPurchasePage';
import CartPage from './components/CartPage';
import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import LoginPage from './components/LoginPage';
import { UserContext } from './components/LoginPage';

const App = () => {
  const [user, setUser] = useState({});
  const [activeCart, setActiveCart] = useState({});
  const [carts, setCarts] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const userResponse = await axios.get(
          'http://localhost:8081/api/users/1'
        );
        setUser(userResponse.data);
        const activeCartResponse = await axios.get(
          'http://localhost:8081/api/carts/user/' +
            userResponse.data.id +
            '/false'
        );
        setActiveCart(activeCartResponse.data[0]);
        const productsResponse = await axios.get(
          'http://localhost:8081/api/products'
        );
        setProducts(productsResponse.data);
        const cartsResponse = await axios.get(
          'http://localhost:8081/api/carts/user/' +
            userResponse.data.id +
            '/true'
        );
        setCarts(cartsResponse.data);
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  return (
    <Router>
      <Helmet>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      {/* <Header user={user} activeCart={activeCart} /> */}
      <Routes>
        {/* <Route path="/login" element={<LoginPage />}></Route> */}
        <Route
          path="/"
          exact
          element={
            <ProductPage
              user={user}
              products={products}
              activeCart={activeCart}
              title="Mart - Products"
            />
          }
        />
        <Route
          path="/products"
          element={
            <ProductPage
              user={user}
              products={products}
              activeCart={activeCart}
              title="Mart - Products"
            />
          }
        />
        <Route
          path="/purchases"
          element={
            <PrevPurchasePage
              user={user}
              activeCart={activeCart}
              carts={carts}
              title="Mart - Purchases"
            />
          }
        />
        <Route
          path="/cart"
          element={
            <CartPage user={user} activeCart={activeCart} title="Mart - Cart" />
          }
        />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
