import axios from 'axios';
import React, { useState } from 'react'
import { Navigate } from 'react-router';
import AuthFetchService from '../services/AuthFetchService';
import { useLocalState } from '../services/LocalStorageUtil';
import LoadingPage from './LoadingPage';

const PrivateRoute = ({children}) => {
  const [jwt, setJwt] = useLocalState("", "jwt");
  const [isLoading, setIsLoading] = useState(true);
  const [isValid, setIsValid] = useState(null);

  if (jwt) {
      AuthFetchService.fetch(`/api/auth/validate?token=${jwt}`, 'GET', null, jwt).then(isValid => {
      setIsValid(isValid);
      setIsLoading(false);
      return isValid === true ? children :  <Navigate to="/login" />
    });
  } else { 
    return <Navigate to="/login" />;
  }

  return isLoading ? <LoadingPage /> : isValid === true ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
