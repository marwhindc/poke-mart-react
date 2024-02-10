import "../styles/style.css";
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState } from 'react';
import { useLocalState } from "../services/LocalStorageUtil";
import AuthFetchService from "../services/AuthFetchService";

const PrevPurchasePage = ({title}) => {
    const [jwt, setJwt] = useLocalState("", "jwt")
    
    const [user, setUser] = useState([]);
    const [activeCart, setActiveCart] = useState({});
    const [carts, setCarts] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        const userData = await AuthFetchService.fetch('/api/users/loggedin/', 'GET', null, jwt);
        setUser(userData);
        const activeCartData = await AuthFetchService.fetch('/api/carts/user/'+ userData.id + '/false', 'GET', null, jwt);
        setActiveCart(activeCartData[0]);
        const cartsData = await AuthFetchService.fetch('/api/carts/user/'+ userData.id + '/true', 'GET', null, jwt);
        setCarts(cartsData);
      }
      if (jwt) {
        fetchData();
      }
      }, []);

    document.title = title;
    return (
        <>
        <Header user={user} activeCart={activeCart}/>
        <main>
            <div className="container">
                <h2 className="container-title">Previous Purchases</h2>
                <div className="co-cart-list">
                    {carts.map((cart, index) => (
                        <div key={index} className="co-cart-container">
                            {cart.cartItems.map((cartItem, idx) => (
                                <div key={idx} className="co-cart-item">
                                    <div className="co-cart-item-product">
                                        <img src={cartItem.product.imageUrl} height="30" width="30" alt='product'/>
                                        <p>{cartItem.product.name}</p>
                                    </div>
                                    <p>{`x ${cartItem.quantity}`}</p>
                                    <p>{`₽${parseFloat(cartItem.totalPrice).toFixed(2)}`}</p>
                                </div>
                            ))}
                            <p className="co-cart-total">{`Order Total: ₽${parseFloat(cart.totalCartPrice).toFixed(2)}`}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
        <Footer/>
        </>
    );
}

export default PrevPurchasePage;