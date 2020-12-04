import React, { useState, useEffect } from 'react'
import './Playing.css'
import { useDataLayerValue } from '../DataLayer'
import { yes, no } from '../assets'

/**
 * Displays the current recommendation based on users' top songs and artists.
 * @param {Spotify} spotify - Instance of Spotify Web API that holds user authentication tokens.
 */
function Playing (props) {
  const [ current, setCurrent ] = useState({name: '', img: '', artists: [], uri: '', id: ''})
  const [ { user, token }, dispatch ] = useDataLayerValue()

  /**
   * Fetches next recommendation using user's filters and preferences.
   * @method getNextRec
   */
  const getNextRec = () => {
    props.spotify.getMyTopTracks()
      .then(top => {
        return top.items.slice(0,5).map(item => item.id)
      })
      .then((id) => {
        props.spotify.getRecommendations({seed_tracks: id}).then((recs) => {
          console.log(recs)
          setCurrent({
            name: recs.tracks[0].name, 
            img: recs.tracks[0].album.images[0].url, 
            artists: recs.tracks[0].artists, 
            uri: recs.tracks[0].uri,
            id: recs.tracks[0].id})
          playSong(recs.tracks[0].uri)
        })
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
    console.log(current.id)
    props.spotify.addToMySavedTracks({ids: [current.id]})
    getNextRec()
  }

  useEffect(() => {
    getNextRec()
  }, [])

  /**
   * Formats an array of artist names 
   * @method formatArtists
   */
  const formatArtists = () => {
    return current.artists.map(artist => artist.name).join(', ')
  }

  return (
    <div className="Container">
      <div className="header">
        <div id="userInfo">
          {user && <img style={{width: "50px", borderRadius: "50%", marginRight: "10px"}} src={user.images[0].url} alt='' />}
          <b>{user && user.display_name}</b>
        </div>
      </div>
      <div id="c1">
        Visualization of current track 
      </div>
      <div id="c2">
        <div style={{textAlign: 'center', fontFamily: 'Avenir', paddingTop: '5em', color: 'white'}}>
          <div style={{fontSize: "30px"}}>{current.name}</div>
          <div style={{fontSize: "15px", paddingTop: '10px'}}>{formatArtists()}</div>
          <img src={current.img} style={{width: '280px', padding: '30px'}} alt=''/>
          <div className="buttons">
            <img style={{width: '80px', cursor: 'pointer'}} src={no} onClick={getNextRec} alt='' />
            <img style={{width: '80px', cursor: 'pointer'}} src={yes} onClick={handleYes} alt='' />
          </div>
        </div>
      </div>
      <div id="c3">
        Filters
      </div>
    </div>
  )
}

export default Playing
