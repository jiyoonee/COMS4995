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

      spotify.getMe().then((user) => { 
        dispatch({
          type: 'SET_USER',
          user: user 
        })
      }) 
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
