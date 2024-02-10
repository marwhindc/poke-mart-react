import React, { useState } from "react";
import '../styles/toast.css';

const Toast = (props) => {
    const [show, setShow] = useState(false);

    const handleClick = () => {
        setShow(false);
    };

    if (show) {
        setTimeout(() => {
            setShow(false);
        }, 3000);
    }

    return (
        <div className={`toast ${show ? "show" : ""}`}>
            <div className="toast-container">
                {props.message}
                <button onClick={handleClick} className="btn btn-clear"></button>
            </div>
        </div>
    );
}

export default Toast;