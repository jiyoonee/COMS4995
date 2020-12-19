import React, { useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { Login, Playing } from './components'
import './App.css'
import Spotify from 'spotify-web-api-js'
import { useDataLayerValue } from './DataLayer'
import { getHashParams } from './spotify'

const spotify = new Spotify(); 

/**
 * Handles routes to different pages based on whether the user has been authenticated and initializes the Spotify Web API instance.
 */
function App () {

  const [{ token }, dispatch] = useDataLayerValue()

  /**
   * Saves user info to web application's context API.
   * @param {string} token - user's access token.
   * @method set_user
   */
  const set_user = () => {
    spotify.getMe().then((user) => {
      dispatch({
        type: 'SET_USER',
        user: user 
      })
    })  
  }

  /**
   * Saves top tracks info to web application's context API.
   * @param {string} token - user's access token.
   * @method set_top_tracks
   */
  const set_top_tracks = () => {
    spotify.getMyTopTracks().then(top => {
      dispatch({
        type: 'SET_TOP_TRACKS',
        top_tracks: top.items.slice(0,2).map(item => item.id)
      })
    })
  }

  /**
   * Saves top artists info to web application's context API.
   * @param {string} token - user's access token.
   * @method set_top_artists
   */
  const set_top_artists = () => {
    spotify.getMyTopArtists().then(top => {
      dispatch({
        type: 'SET_TOP_ARTISTS',
        top_artists: top.items.slice(0,3).map(item => item.id)
      })
    })
  }
  
  useEffect(() => {
    const hash = getHashParams()
    window.location.hash = ""
    const _token = hash.access_token 

    if (_token) {
      dispatch({
        type: 'SET_TOKEN',
        token: _token
      })
      spotify.setAccessToken(_token)
      set_user()
      set_top_tracks()
      set_top_artists()
    }
  })

  return (
    <Router>
      <Switch>
        <Route exact path='/'>
          {token ? <Redirect to='/playing' /> : <Login spotify={spotify} />}
        </Route>
        <Route exact path='/playing'>
          <Playing spotify={spotify} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
