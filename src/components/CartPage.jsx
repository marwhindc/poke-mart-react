import "../styles/style.css";
import minusSign from "../resources/minus.png";
import plusSign from "../resources/plus.png";
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { useLocalState } from "../services/LocalStorageUtil";
import AuthFetchService from "../services/AuthFetchService";

const CartPage = ({title}) => {
  const [jwt, setJwt] = useLocalState("", "jwt");
  const [isLoaded, setIsLoaded] = useState(false);

  const [user, setUser] = useState([]);
  const [activeCart, setActiveCart] = useState({});

  useEffect(() => {
    if (!isLoaded) {
      const fetchData = async () => {
        const userData = await AuthFetchService.fetch('/api/users/loggedin/', 'GET', null, jwt);
        setUser(userData);
        const activeCartData = await AuthFetchService.fetch(`api/carts/user/${userData.id}/false`, 'GET', null, jwt);
        setActiveCart(activeCartData[0]);
        setIsLoaded(true);
      }
      if (jwt) {
        fetchData();
      }
    }
  }, [activeCart, isLoaded]);

  const addItem = async (cartItemId) => {
    try {
      setIsLoaded(false);
      let existingCartItem = await AuthFetchService.fetch(`/api/cart-items/${cartItemId}`, 'GET', null, jwt);
      existingCartItem = {...existingCartItem, quantity: existingCartItem.quantity + 1};
      await AuthFetchService.fetch(`/api/cart-items/${cartItemId}`, 'PUT', existingCartItem, jwt);
    } catch (error) {
      console.log(error);
    }
  }

  const removeItem = async (cartItemId) => {
    try {
      setIsLoaded(false);
      let existingCartItem = await AuthFetchService.fetch(`/api/cart-items/${cartItemId}`, 'GET', null, jwt);
      existingCartItem = {...existingCartItem, quantity: existingCartItem.quantity - 1};
      if (existingCartItem.quantity == 0) {
        await AuthFetchService.fetch(`/api/cart-items/${cartItemId}`,'DELETE', null, jwt);
      } else {
        await AuthFetchService.fetch(`/api/cart-items/${cartItemId}`, 'PUT', existingCartItem, jwt);
      }
    } catch (error) {
      console.log(error);
    }
  }

  const checkOut = async () => {
    try {
      setIsLoaded(false);
      let checkOutCart = activeCart;
      checkOutCart = {...activeCart, checkedOut: true};
      await AuthFetchService.fetch(`/api/carts/${activeCart.id}`,'PUT', checkOutCart, jwt);
      const newCart = {userId: activeCart.userId};
      await AuthFetchService.fetch(`/api/carts`, 'POST', newCart, jwt);
    } catch (error) {
      console.log(error);
    }
  }

  document.title = title;
    return (
      <>
        <Header user={user} activeCart={activeCart}/>
        <main>
            <h2 className="container-title" style={{display: (activeCart.totalQuantity === 0) ? "block" : "none"}}>
        No items in your cart yet!
            </h2>
            <h2 className="container-title" style={{display: (activeCart.totalQuantity === 0) ? "none" : "block"}}>
        Shopping Cart
            </h2>
            <div className="container" style={{display: (activeCart.totalQuantity === 0) ? "none" : "block"}}>
              <div className="shopping-cart-header">
                <div className="product-heading">Product</div>
                <div className="unit-price-heading">Unit Price</div>
                <div className="quantity-heading">Quantity</div>
                <div className="total-price-heading">Total Price</div>
              </div>
              <div className="cart-items">
                {activeCart.cartItems?.map((cartItem, index) => (
                  <div key={index} className="cart-item-card">
                    <div className="cart-item-product">
                      <img className="cart-item-product-img" src={cartItem.product.imageUrl} alt='product' height="30" width="30" />
                      <p className="cart-item-product-name">{cartItem.product.name}</p>
                    </div>
                    <p className="cart-item-price">{`₽${parseFloat(cartItem.product.price).toFixed(2)}`}</p>
                    <div className="cart-item-quantity">
                      <input type="image" src={minusSign} alt='minus' onClick={() => removeItem(cartItem.id)} height="16" width="16" />
                      <p>{cartItem.quantity}</p>
                      <input type="image" src={plusSign} alt='plus' onClick={() => addItem(cartItem.id)} height="16" width="16" />
                    </div>
                    <p className="cart-item-total-price">{`₽${parseFloat(cartItem.totalPrice).toFixed(2)}`}</p>
                  </div>
                ))}
              </div>
              <div className="shopping-cart-checkout">
                <div className="subtotal-price-container">
                  <p>Total:</p>
                  <p className="subtotal-price">
                    <span>{`₽${parseFloat(activeCart.totalCartPrice).toFixed(2)}`}</span>
                  </p>
                </div>
                <div className="checkout-btn-container">
                  <button className="submit-btn checkout-btn" onClick={() => checkOut()}>
                    CHECKOUT
                  </button>
                </div>
              </div>
            </div>
    </main>
        <Footer/>
      </>
    );
}

export default CartPage;