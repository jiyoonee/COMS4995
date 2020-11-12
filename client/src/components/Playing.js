import React, { useState } from 'react'
import './Playing.css'

function Playing (props) {
  const [nowPlaying, setNowPlaying] = useState({name: 'Not Checked', img: ''})
  const getNowPlaying = () => {
    props.spotifyWebApi.getMyCurrentPlaybackState()
    .then((res) => {
      setNowPlaying({name: res.item.name, img: res.item.album.images[0].url})
    })
  }
  return (
    <div className="Content">
      <div style={{textAlign: 'center', fontFamily: 'Avenir', paddingTop: '12em'}}>
        <div style={{color: 'white', paddingTop: '20px'}}>Now Playing: {nowPlaying.name}</div>
        <img src={nowPlaying.img} style={{width: '200px', padding: '20px'}} alt=''/>
        <div>
          <button onClick={getNowPlaying}>
            Get Current Playing
          </button>
        </div>
      </div>
    </div>
  )
}

export default Playing
