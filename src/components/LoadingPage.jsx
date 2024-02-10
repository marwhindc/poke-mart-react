import React from 'react'
import '../styles/loading.css';

const LoadingPage = () => {
  document.title = "Loading...";
  return (
    <div className="loading-container" style={{backgroundColor: "#ECF0F3"}}>
      <div className="loading"></div>
    </div>
  )
}

export default LoadingPage