import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useLocalState } from '../services/LocalStorageUtil';
import '../styles/login.css';
import logo from "../resources/pokemart-logo.png";

const LoginPage = ({title}) => {
    const [jwt, setJwt] = useLocalState("", "jwt");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (event) => {
      if (error) {
        event.target.classList.remove("error");
      }
      if (event.target.name === 'username') {
          setUsername(event.target.value);
      } else if (event.target.name === 'password') {
          setPassword(event.target.value);
      }
    }

    const login = () => {
      setIsLoading(true);
      const reqBody = {
        username: username,
        password: password
      };
      axios.post('api/auth/login', reqBody, {
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((response) => 
       {
        if (response.status === 200) {
            return Promise.all([response.data, response.headers]);
        } else {
           
            return Promise.reject("Invalid login attempt");
        }
      }).then(([body, headers]) => {
        setJwt(headers.get("authorization"));
        setError("");
        setIsLoading(false);
        window.location.href = "products";
      }).catch((message) => {
        setError("Incorrect username or password");
        setIsLoading(false);
      });
    }

    document.title = title;
    return (
        <>
          <form>
            <img src={logo} width="290" height="106" />
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={username} onChange={handleChange} />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={handleChange} />
            <br />
            <input type="submit" value="Login" className={`btn btn-success ${isLoading ? "disabled" : ""}`} disabled={isLoading} onClick={(e) => {
              e.preventDefault();
              login();
            }} />
            <div className="error">{error}</div>
            <br/>
            <div>No account yet? <a href='/register'>Register</a></div>
          </form>
        </>

    )
}

export default LoginPage;