import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useLocalState } from '../services/LocalStorageUtil';
import '../styles/login.css';
import logo from "../resources/pokemart-logo.png";

const RegisterPage = ({title}) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

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
      } else if (event.target.name === 'firstname') {
        setFirstName(event.target.value);
      } else if (event.target.name === 'lastname') {
        setLastName(event.target.value);
      }
    }

    const register = () => {
      setIsLoading(true);
      const reqBody = {
        username: username,
        password: password,
        firstName: firstName,
        lastName: lastName
      };
      axios.post('api/auth/register', reqBody, {
        headers: {
          'Content-Type': 'application/json'
        },
      }).then((response) => 
       {
        if (response.status === 200) {
            setError("");
            setIsLoading(false);
            window.location.href = "login";
        }
      }).catch((message) => {
        setError("Incorrect details entered")
        setIsLoading(false);
      });
    }

    document.title = title;
    return (
        <>
          <form>
            <img src={logo} width="290" height="106" />
            <label htmlFor="firstname">First Name:</label>
            <input type="text" id="firstname" name="firstname" value={firstName} onChange={handleChange} />
            <br />
            <label htmlFor="lastname">Last Name:</label>
            <input type="text" id="lastname" name="lastname" value={lastName} onChange={handleChange} />
            <br />
            <label htmlFor="username">Username:</label>
            <input type="text" id="username" name="username" value={username} onChange={handleChange} />
            <br />
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" name="password" value={password} onChange={handleChange} />
            <br />
            <div className="error">{error}</div>
            <br />
            <input type="submit" value="Register" className={`btn btn-success ${isLoading ? "disabled" : ""}`} disabled={isLoading} onClick={(e) => {
              e.preventDefault();
              register();
            }} />
            <br/>
            <br/>
            <div>Back to <a href='/login'>Login</a></div>
          </form>
        </>

    )
}

export default RegisterPage;