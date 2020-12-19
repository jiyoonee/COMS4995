import React from 'react'
import './Login.css'
import Particles from 'react-particles-js';
import particlesConfig from '../config/particlesConfig';
import { loginUrl } from '../spotify';

/**
 * Prompts the user for login and permissions and sets access token.
 * @param {module} spotify - Instance of Spotify Web API that holds user authentication tokens.
 * @param {function} setToken - Function that updates the user token on successful authentication.
 */
function Login (props) {
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
        <a href={loginUrl}>
          <button id="auth-button">LOGIN WITH SPOTIFY</button>
        </a>
      </div>
    </div>
  )
}

export default Login
