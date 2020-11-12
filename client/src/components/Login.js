import React, { useEffect } from 'react'
import './Login.css'

function Login (props) {
  useEffect(() => {
    if (params.access_token) {
      props.spotifyWebApi.setAccessToken(params.access_token)
      props.setAuth(true)
    }
  }, [])
  const getHashParams = () => {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while ( e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  const params = getHashParams()
  return (
    <div className="Content">
      <div className="Intro-Text">
        Welcome to Visualize-Spotify!
        <div style={{ fontSize: "20px", fontWeight: "300" }}>Login to start</div>
      </div>
      <div className="Login-Button">
        <a href="http://localhost:8888/login">
          <button id="auth-button">LOGIN WITH SPOTIFY</button>
        </a>
      </div>
    </div>
  )
}

export default Login
