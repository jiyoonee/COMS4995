import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './Playing.css'
import { useDataLayerValue } from '../DataLayer'
import { yes, no } from '../assets'
import ReactSlider from 'react-slider'
import Visual from './Visual'

/**
 * Displays the current recommendation based on users' top songs and artists.
 * @param {Spotify} spotify - Instance of Spotify Web API that holds user authentication tokens.
 */
function Playing (props) {
  const [ current, setCurrent ] = useState({name: '', img: '', artists: [], uri: '', id: ''})
  const [ features, setFeatures ] = useState({})
  const [ { user, token, top_artists, top_tracks }, dispatch ] = useDataLayerValue()
  const history = useHistory()

  const [ acoustic, setAcoustic ] = useState([0, 100])
  const [ dance, setDance ] = useState([0, 100])
  const [ energy, setEnergy ] = useState([0, 100])
  const [ valence, setValence ] = useState([0, 100])
  const [ popular, setPopular ] = useState([0, 100])

  /**
   * Fetches next recommendation using user's filters and preferences.
   * @method getNextRec
   */
  const getNextRec = () => {
    props.spotify.getRecommendations({
        seed_artists: top_artists,
        seed_tracks: top_tracks,
        limit: 1,
        min_acousticness: acoustic[0] / 100,
        max_acousticness: acoustic[1] / 100,
        min_danceability: dance[0] / 100, 
        max_danceability: dance[1] / 100,
        min_energy: energy[0] / 100,
        max_energy: energy[1] / 100,
        min_valence: valence[0] / 100, 
        max_valence: valence[1] / 100,
        min_popularity: popular[0], 
        max_popularity: popular[1]
      }).then((recs) => {
        if (recs.tracks.length === 0) {
          alert('No recommendations for your preferences! Try expanding your search options.')
          resetOptions()
          return
        } else {
          console.log(recs)
          setCurrent({
            name: recs.tracks[0].name, 
            img: recs.tracks[0].album.images[0].url, 
            artists: recs.tracks[0].artists, 
            uri: recs.tracks[0].uri,
            id: recs.tracks[0].id})
          playSong(recs.tracks[0].uri)

        props.spotify.getAudioFeaturesForTrack(recs.tracks[0].id).then((ft) => {
          props.spotify.getTrack(recs.tracks[0].id).then(info => {
            setFeatures({...ft, popularity: info.popularity})
          })
        })
      }
    })
  }

  /**
   * Sends a request to the Spotify API to play a specific song.
   * @param {string} uri - the URI of the song to be played.
   * @method playSong
   */
  const playSong = (uri) => {
    const requests_options = {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ uris: [uri] })
    }
    fetch('https://api.spotify.com/v1/me/player/play', requests_options)
      .catch(err => console.log(err))
  }

  /**
   * Handles action on click of the "Like" button, which adds the song to the user's Liked Songs and provides the next recommendation.
   * @method handleYes
   */
  const handleYes = () => {
    props.spotify.addToMySavedTracks({ids: [current.id]})
    getNextRec()
  }

  useEffect(() => {
    getNextRec()
  }, [top_artists, top_artists])

  /**
   * Formats an array of artist names 
   * @method formatArtists
   */
  const formatArtists = () => {
    return current.artists.map(artist => artist.name).join(', ')
  }

  /**
   * Logs user out, removing the access token.
   * @method logOut
   */
  const logOut = () => {
    dispatch({
      type: 'SET_TOKEN',
      token: null
    })
    props.spotify.setAccessToken(null)
    history.push('/')
  }

  /**
   * Resets all filters to default (min 0, max 100).
   * @method resetOptions
   */
  const resetOptions = () => {
    setAcoustic([0,100])
    setDance([0,100])
    setEnergy([0,100])
    setValence([0,100])
    setPopular([0,100])
  }

  return (
    <div className="Container">
      <div className="header">
        <div id="userInfo" style={{cursor: "pointer"}} onClick={logOut}>
          {user && <img style={{width: "50px", borderRadius: "50%", marginRight: "10px"}} src={user.images[0].url} alt='' />}
          <b>{user && user.display_name}</b>
        </div>
      </div>
      <div id="c1" style={{color: 'white', paddingTop: '12em'}}>
        <Visual {...features} />
      </div>
      <div id="c2">
        <div style={{textAlign: 'center', fontFamily: 'Avenir', paddingTop: '2em', color: 'white'}}>
          <div style={{fontSize: "30px"}}>{current.name}</div>
          <div style={{fontSize: "15px", paddingTop: '10px', paddingBottom: '4em'}}>{formatArtists()}</div>
          <div className="imageContainer" style={{backgroundImage: "url(" + current.img + ")"}} ></div>
          <div className="buttons">
            <img style={{width: '80px', cursor: 'pointer'}} src={no} onClick={getNextRec} alt='' />
            <img style={{width: '80px', cursor: 'pointer'}} src={yes} onClick={handleYes} alt='' />
          </div>
        </div>
      </div>
      <div id="c3" style={{paddingTop: "12em"}}>
        <div className="slider">
          <div style={{color: '#f9b127', float: 'right', paddingRight: '34px'}}>{acoustic[0]} - {acoustic[1]}</div>
          <div style={{color: '#f9b127', paddingLeft: '34px', paddingBottom: '10px'}}>Acousticness</div>
          <ReactSlider 
            className="horizontal-slider"
            value={acoustic}
            renderThumb={(props, state) => <div className="thumb" style={{ backgroundColor: "#f9b127 !important"}} {...props}></div>}
            renderTrack={(props, state) => <div className="track" style={{ background: "#f9b127 !important" }} {...props} index={state.index} />}
            minDistance={5}
            onChange={val => setAcoustic(val)}
            onAfterChange={getNextRec}
          />
        </div>
        <div className="slider">
          <div style={{color: '#8169cf', float: 'right', paddingRight: '34px'}}>{dance[0]} - {dance[1]}</div>
          <div style={{color: '#8169cf', paddingLeft: '34px', paddingBottom: '10px'}}>Danceability</div>
          <ReactSlider 
            className="horizontal-slider"
            value={dance}
            renderThumb={(props, state) => <div className="thumb" {...props}></div>}
            renderTrack={(props, state) => <div className="track" {...props} index={state.index} />}
            minDistance={5}
            onChange={val => setDance(val)}
            onAfterChange={getNextRec}
          />
        </div>
        <div className="slider">
          <div style={{color: '#e82c4f', float: 'right', paddingRight: '34px'}}>{energy[0]} - {energy[1]}</div>
          <div style={{color: '#e82c4f', paddingLeft: '34px', paddingBottom: '10px'}}>Energy</div>
          <ReactSlider 
            className="horizontal-slider"
            value={energy}
            renderThumb={(props, state) => <div className="thumb" {...props}></div>}
            renderTrack={(props, state) => <div className="track" {...props} index={state.index} />}
            minDistance={5}
            onChange={val => setEnergy(val)}
            onAfterChange={getNextRec}
          />
        </div>
        <div className="slider">
          <div style={{color: '#66bb6a', float: 'right', paddingRight: '34px'}}>{valence[0]} - {valence[1]}</div>
          <div style={{color: '#66bb6a', paddingLeft: '34px', paddingBottom: '10px'}}>Positivity</div>
          <ReactSlider 
            className="horizontal-slider"
            value={valence}
            renderThumb={(props, state) => <div className="thumb" {...props}></div>}
            renderTrack={(props, state) => <div className="track" {...props} index={state.index} />}
            minDistance={5}
            onChange={val => setValence(val)}
            onAfterChange={getNextRec}
          />
        </div>
        <div className="slider">
          <div style={{color: '#2784c7', float: 'right', paddingRight: '34px'}}>{popular[0]} - {popular[1]}</div>
          <div style={{color: '#2784c7', paddingLeft: '34px', paddingBottom: '10px'}}>Popularity</div>
          <ReactSlider 
            className="horizontal-slider"
            value={popular}
            renderThumb={(props, state) => <div className="thumb" {...props}></div>}
            renderTrack={(props, state) => <div className="track" {...props} index={state.index} />}
            minDistance={5}
            onChange={val => setPopular(val)}
            onAfterChange={getNextRec}
          />
        </div>
        <button id="reset" onClick={() => {resetOptions(); getNextRec(); }} >Reset</button>
      </div>
    </div>
  )
}

export default Playing
