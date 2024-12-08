import '../styles/style.css';
import Header from './Header';
import Footer from './Footer';
import CartItem from './CartItem';
import { useEffect, useState } from 'react';
import { useLocalState } from '../services/LocalStorageUtil';
import AuthFetchService from '../services/AuthFetchService';

const CartPage = ({ title }) => {
    const [jwt, setJwt] = useLocalState('', 'jwt');
    const [isLoaded, setIsLoaded] = useState(false);

    const [user, setUser] = useState([]);
    const [activeCart, setActiveCart] = useState({});

    const fetchCartData = async () => {
        const userData = await AuthFetchService.fetch(
            '/api/users/loggedin/',
            'GET',
            null,
            jwt
        );
        setUser(userData);
        const activeCartData = await AuthFetchService.fetch(
            `api/carts/user/${userData.id}/false`,
            'GET',
            null,
            jwt
        );
        setActiveCart(activeCartData[0]);
        setIsLoaded(true);
    };

    useEffect(() => {
        if (!isLoaded) {
            if (jwt) {
                fetchCartData();
            }
        }
    }, [isLoaded, jwt]);

    const checkOut = async () => {
        try {
            setIsLoaded(false);
            let checkOutCart = activeCart;
            checkOutCart = { ...activeCart, checkedOut: true };
            await AuthFetchService.fetch(
                `/api/carts/${activeCart.id}`,
                'PUT',
                checkOutCart,
                jwt
            );
            const newCart = { userId: activeCart.userId };
            await AuthFetchService.fetch(`/api/carts`, 'POST', newCart, jwt);
        } catch (error) {
            console.log(error);
        }
    };

    document.title = title;
    return (
        <>
            <Header
                username={user.username}
                cartItemCount={activeCart.totalQuantity}
            />
            <main>
                <h2
                    className="container-title"
                    style={{
                        display:
                            activeCart.totalQuantity === 0 ? 'block' : 'none'
                    }}
                >
                    No items in your cart yet!
                </h2>
                <h2
                    className="container-title"
                    style={{
                        display:
                            activeCart.totalQuantity === 0 ? 'none' : 'block'
                    }}
                >
                    Shopping Cart
                </h2>
                <div
                    className="container"
                    style={{
                        display:
                            activeCart.totalQuantity === 0 ? 'none' : 'block'
                    }}
                >
                    <div className="shopping-cart-header">
                        <div className="product-heading">Product</div>
                        <div className="unit-price-heading">Unit Price</div>
                        <div className="quantity-heading">Quantity</div>
                        <div className="total-price-heading">Total Price</div>
                    </div>
                    <div className="cart-items">
                        {activeCart.cartItems?.map((cartItem) => (
                            <CartItem
                                cartItem={cartItem}
                                key={cartItem.id}
                                jwt={jwt}
                                setIsLoaded={setIsLoaded}
                                fetchCartData={fetchCartData}
                            />
                        ))}
                    </div>
                    <div className="shopping-cart-checkout">
                        <div className="subtotal-price-container">
                            <p>Total:</p>
                            <p className="subtotal-price">
                                <span>{`₽${parseFloat(
                                    activeCart.totalCartPrice
                                ).toFixed(2)}`}</span>
                            </p>
                        </div>
                        <div className="checkout-btn-container">
                            <button
                                className="submit-btn checkout-btn"
                                onClick={() => checkOut()}
                            >
                                CHECKOUT
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
};

export default CartPage;
