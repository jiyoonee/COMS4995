import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import './Playing.css'
import { useDataLayerValue } from '../DataLayer'
import { yes, no } from '../assets'
import ReactSlider from 'react-slider'
import styled from 'styled-components'
import './Visual.css'
import Polygon from 'react-polygon'


const StyledTrackA = styled.div`
background: ${props => props.index === 1 ? '#f9b127' : '#ddd' };
border-radius: 20px;
top: calc(50% - 7px);
height: 2px;
` 

const StyledTrackB = styled.div`
background: ${props => props.index === 1 ? '#8169cf' : '#ddd' };
border-radius: 20px;
top: calc(50% - 7px);
height: 2px;
`

const StyledTrackC = styled.div`
background: ${props => props.index === 1 ? '#e82c4f' : '#ddd' };
border-radius: 20px;
top: calc(50% - 7px);
height: 2px;
`

const StyledTrackD = styled.div`
background: ${props => props.index === 1 ? '#66bb6a' : '#ddd' };
border-radius: 20px;
top: calc(50% - 7px);
height: 2px;
`

const StyledTrackE = styled.div`
background: ${props => props.index === 1 ? '#2784c7' : '#ddd' };
border-radius: 20px;
top: calc(50% - 7px);
height: 2px;
`

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

  const [isDanceVisible, setDanceVis] = useState(false)
  const [isPopularVisible, setPopularVis] = useState(false)
  const [isAcousticVisible, setAcousticVis] = useState(false)
  const [isPositiveVisible, setPositiveVis] = useState(false)
  const [isEnergyVisible, setEnergyVis] = useState(false)

  /**
   * Fetches next recommendation using user's filters and preferences.
   * @method getNextRec
   */
  const getNextRec = () => {
    if (top_artists.length === 0 || top_tracks === 0) {
      return
    }
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
        {Object.keys(features).length !== 0 && features.constructor === Object && <div className="main">
            <div>
                <div className="featureLabel" onMouseOver={() => setDanceVis(true)} onMouseOut={() => setDanceVis(false)} style={{top: '38vh', left: '29vw'}}>Danceability</div>
                {isDanceVisible && <div id="danceLabel">{Math.round(features.danceability * 10000) / 100}</div>}

                <div className="featureLabel" onMouseOver={() => setPopularVis(true)} onMouseOut={() => setPopularVis(false)} style={{top: '38vh', left: '1vw'}}>Popularity</div>
                {isPopularVisible && <div id="popularLabel">{Math.round(features.popularity * 100) / 100}</div>}

                <div className="featureLabel" onMouseOver={() => setAcousticVis(true)} onMouseOut={() => setAcousticVis(false)} style={{top: '19vh', left: '13vw'}}>Acousticness</div>
                {isAcousticVisible && <div id="acousticLabel">{Math.round(features.acousticness * 10000) / 100}</div>}

                <div className="featureLabel" onMouseOver={() => setPositiveVis(true)} onMouseOut={() => setPositiveVis(false)} style={{top: '75vh', left: '4vw'}}>Positivity</div>
                {isPositiveVisible && <div id="positiveLabel">{Math.round(features.valence * 10000) / 100}</div>}

                <div className="featureLabel" onMouseOver={() => setEnergyVis(true)} onMouseOut={() => setEnergyVis(false)} style={{top: '75vh', left: '24vw'}}>Energy</div>
                {isEnergyVisible && <div id="energyLabel">{Math.round(features.energy * 10000) / 100}</div>}
            </div>
            <div className='container'>
                <Polygon n={5}
                    ratios={[features.acousticness, features.danceability, features.energy, features.valence, features.popularity / 100]}
                    size={450}
                    className='my-polygon-2'
                    renderPoint={(point) => {
                        return (
                            <circle fill="rgba(255, 255, 255, 0.8)" cx={point[0]} cy={point[1]} r={5} />
                        )
                }} />
                <Polygon n={5} 
                    size={450} 
                    className='my-polygon-3' 
                    renderPoint={(point) => {
                        return (
                            <line x1={point[0]} y1={point[1]} x2="225" y2="225" stroke="rgba(255, 255, 255, 0.8)"/>
                        )
                    }} />
          </div>
        </div>}
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
          <div style={{color: '#f9b127', float: 'right'}}>{acoustic[0]} - {acoustic[1]}</div>
          <div style={{color: '#f9b127', paddingBottom: '10px'}}>Acousticness</div>
          <ReactSlider 
            className="horizontal-slider"
            value={acoustic}
            renderThumb={(props, state) => <div className="thumb" id="acoustic" {...props}></div>}
            renderTrack={(props, state) => <StyledTrackA {...props} index={state.index} />}
            minDistance={5}
            onChange={val => setAcoustic(val)}
            onAfterChange={getNextRec}
          />
        </div>
        <div className="slider">
          <div style={{color: '#8169cf', float: 'right'}}>{dance[0]} - {dance[1]}</div>
          <div style={{color: '#8169cf', paddingBottom: '10px'}}>Danceability</div>
          <ReactSlider 
            className="horizontal-slider"
            value={dance}
            renderThumb={(props, state) => <div className="thumb" id="dance" {...props}></div>}
            renderTrack={(props, state) => <StyledTrackB {...props} index={state.index} />}
            minDistance={5}
            onChange={val => setDance(val)}
            onAfterChange={getNextRec}
          />
        </div>
        <div className="slider">
          <div style={{color: '#e82c4f', float: 'right'}}>{energy[0]} - {energy[1]}</div>
          <div style={{color: '#e82c4f', paddingBottom: '10px'}}>Energy</div>
          <ReactSlider 
            className="horizontal-slider"
            value={energy}
            renderThumb={(props, state) => <div className="thumb" id="energy" {...props}></div>}
            renderTrack={(props, state) => <StyledTrackC {...props} index={state.index} />}
            minDistance={5}
            onChange={val => setEnergy(val)}
            onAfterChange={getNextRec}
          />
        </div>
        <div className="slider">
          <div style={{color: '#66bb6a', float: 'right'}}>{valence[0]} - {valence[1]}</div>
          <div style={{color: '#66bb6a', paddingBottom: '10px'}}>Positivity</div>
          <ReactSlider 
            className="horizontal-slider"
            value={valence}
            renderThumb={(props, state) => <div className="thumb" id="positive" {...props}></div>}
            renderTrack={(props, state) => <StyledTrackD {...props} index={state.index} />}
            minDistance={5}
            onChange={val => setValence(val)}
            onAfterChange={getNextRec}
          />
        </div>
        <div className="slider">
          <div style={{color: '#2784c7', float: 'right'}}>{popular[0]} - {popular[1]}</div>
          <div style={{color: '#2784c7', paddingBottom: '10px'}}>Popularity</div>
          <ReactSlider 
            className="horizontal-slider"
            value={popular}
            renderThumb={(props, state) => <div className="thumb" id="popular" {...props}></div>}
            renderTrack={(props, state) => <StyledTrackE {...props} index={state.index} />}
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
