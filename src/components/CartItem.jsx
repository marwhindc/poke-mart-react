import minusSign from '../resources/minus.png';
import plusSign from '../resources/plus.png';
import AuthFetchService from '../services/AuthFetchService';

import { useState } from 'react';

const CartItem = ({ cartItem, key, jwt, setIsLoaded, fetchCartData }) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const addItem = async (cartItemId) => {
        if (isUpdating) return;
        try {
            setIsLoaded(false);
            setIsUpdating(true);
            let existingCartItem = await AuthFetchService.fetch(
                `/api/cart-items/${cartItemId}`,
                'GET',
                null,
                jwt
            );
            existingCartItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1
            };
            await AuthFetchService.fetch(
                `/api/cart-items/${cartItemId}`,
                'PUT',
                existingCartItem,
                jwt
            );
            fetchCartData();
        } catch (error) {
            console.log(error);
        } finally {
            setIsUpdating(false);
            setIsLoaded(true);
        }
    };

    const removeItem = async (cartItemId) => {
        if (isUpdating) return;
        try {
            setIsLoaded(false);
            setIsUpdating(true);
            let existingCartItem = await AuthFetchService.fetch(
                `/api/cart-items/${cartItemId}`,
                'GET',
                null,
                jwt
            );
            existingCartItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity - 1
            };
            if (existingCartItem.quantity === 0) {
                await AuthFetchService.fetch(
                    `/api/cart-items/${cartItemId}`,
                    'DELETE',
                    null,
                    jwt
                );
            } else {
                await AuthFetchService.fetch(
                    `/api/cart-items/${cartItemId}`,
                    'PUT',
                    existingCartItem,
                    jwt
                );
            }
            fetchCartData();
        } catch (error) {
            console.log(error);
        } finally {
            setIsUpdating(false);
            setIsLoaded(true);
        }
    };

    return (
        <div key={key} className="cart-item-card">
            <div className="cart-item-product">
                <img
                    className="cart-item-product-img"
                    src={cartItem.product.imageUrl}
                    alt="product"
                    height="30"
                    width="30"
                />
                <p className="cart-item-product-name">
                    {cartItem.product.name}
                </p>
            </div>
            <p className="cart-item-price">{`₽${parseFloat(
                cartItem.product.price
            ).toFixed(2)}`}</p>
            <div className="cart-item-quantity">
                <input
                    type="image"
                    src={minusSign}
                    alt="minus"
                    className="quantity-button"
                    onClick={() => removeItem(cartItem.id)}
                    height="16"
                    width="16"
                    disabled={isUpdating}
                />
                <p>{cartItem.quantity}</p>
                <input
                    type="image"
                    src={plusSign}
                    alt="plus"
                    className="quantity-button"
                    onClick={() => addItem(cartItem.id)}
                    height="16"
                    width="16"
                    disabled={isUpdating}
                />
            </div>
            <p className="cart-item-total-price">{`₽${parseFloat(
                cartItem.totalPrice
            ).toFixed(2)}`}</p>
        </div>
    );
};

export default CartItem;
