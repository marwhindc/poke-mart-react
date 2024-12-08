import '../styles/style.css';
import logo from '../resources/pokemart-logo.png';
import shoppingCart from '../resources/shopping-cart-icon.png';

const Header = ({ username, cartItemCount }) => {
    const logout = () => {
        localStorage.removeItem('jwt');
        window.location.href = 'login';
    };

    return (
        <header>
            <div className="header-left">
                <a href="/products">
                    <input
                        type="image"
                        src={logo}
                        alt="logo"
                        width="290"
                        height="106"
                    />
                </a>
            </div>
            <div className="header-right">
                <p className="loggedin-user">
                    Hi, <span>{username}</span>!
                </p>
                <a href="/purchases">Purchases</a>
                <div className="shopping-cart-icon-container">
                    <a href="/cart">
                        <input
                            type="image"
                            alt="shopping cart"
                            src={shoppingCart}
                        />
                    </a>
                    <div className="shopping-cart-badge">{cartItemCount}</div>
                </div>
                <a href="#" onClick={logout}>
                    Logout
                </a>
            </div>
        </header>
    );
};

export default Header;
