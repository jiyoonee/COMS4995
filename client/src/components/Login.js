import React, { useEffect } from 'react'
import './Login.css'
import Particles from 'react-particles-js';
import particlesConfig from '../config/particlesConfig';

function Login (props) {
  const getHashParams = () => {
    var hashParams = {};
    var r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
    while (true) {
      const e = r.exec(q);
      if(!e) {
        break
      }
      hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }
  const params = getHashParams()
  useEffect(() => {
    if (params.access_token) {
      props.spotifyWebApi.setAccessToken(params.access_token)
      props.setAuth(true)
    }
  }, [params.access_token, props])
  return (
    <div className="Content">
      <div style={{ position: 'absolute'}}>
        <Particles height="100vh" width="100vw" params={particlesConfig} />
      </div>
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
