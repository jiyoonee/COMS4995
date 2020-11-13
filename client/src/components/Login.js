import React, { useEffect } from 'react'
import './Login.css'
import Particles from 'react-particles-js';
import particlesConfig from '../config/particlesConfig';

/**
 * Prompts the user for login and permissions and sets access token.
 * @param {Spotify} spotifyWebApi - Instance of Spotify Web API that holds user authentication tokens.
 * @param {function} setAuth - Function that updates the app on whether the user has been successfully authenticated.
 */
function Login (props) {

  /**
   * Obtains parameters from the hash of the URL
   * @return {Object} hashParams - An Object holding the access token of the user.
   * @method getHashParams
   */
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
