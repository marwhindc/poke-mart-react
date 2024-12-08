import '../styles/style.css';
import axios from 'axios';
import Header from './Header';
import Footer from './Footer';
import { useEffect, useState, useCallback } from 'react';
import { useLocalState } from '../services/LocalStorageUtil';
import AuthFetchService from '../services/AuthFetchService';
import Toast from '../components/Toast';

const ProductPage = ({ title }) => {
    const [jwt, setJwt] = useLocalState('', 'jwt');
    const [isLoaded, setIsLoaded] = useState(false);

    const [user, setUser] = useState([]);
    const [activeCart, setActiveCart] = useState({});
    const [products, setProducts] = useState([]);

    // const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (!isLoaded) {
            const fetchData = async () => {
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
                const productsData = await AuthFetchService.fetch(
                    '/api/products/',
                    'GET',
                    null,
                    jwt
                );
                setProducts(productsData);
                setIsLoaded(true);
            };
            if (jwt) {
                fetchData();
            }
        }
    }, [activeCart, isLoaded]);

    const addToCart = async (productId) => {
        try {
            setIsLoaded(false);
            const existingCartItem = await AuthFetchService.fetch(
                `/api/cart-items/cart/${activeCart.id}/product/${productId}`,
                'GET',
                null,
                jwt
            );
            if (existingCartItem) {
                const updatedCartItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + 1
                };
                await AuthFetchService.fetch(
                    `/api/cart-items/${existingCartItem.id}`,
                    'PUT',
                    updatedCartItem,
                    jwt
                );
            } else {
                const product = await AuthFetchService.fetch(
                    `/api/products/${productId}`,
                    'GET',
                    null,
                    jwt
                );
                const newCartItem = {
                    cartId: activeCart.id,
                    quantity: 1,
                    product: product
                };
                await AuthFetchService.fetch(
                    '/api/cart-items',
                    'POST',
                    newCartItem,
                    jwt
                );
            }
            //   setShowToast(true);
            //   setTimeout(() => {
            //       setShowToast(false);
            //   }, 3000);
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
                <div className="container">
                    <h2 className="container-title">Featured Items</h2>
                    <div className="product-items">
                        {products.map((product, index) => (
                            <div key={index} className="product-item-card">
                                <img
                                    className="product-icon"
                                    src={product.imageUrl}
                                    height="63"
                                    width="63"
                                    alt="product"
                                />
                                <p className="product-name">{product.name}</p>
                                <p className="product-price">{`₽${parseFloat(
                                    product.price
                                ).toFixed(2)}`}</p>
                                <button
                                    className="submit-btn"
                                    onClick={() => addToCart(product.id)}
                                >
                                    ADD TO CART
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
            {/* {showToast && <Toast message="Item added to cart" />} */}
            <Footer />
        </>
    );
};

export default ProductPage;
