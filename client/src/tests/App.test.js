import React from 'react'
import ReactDOM from 'react-dom'
import { render, screen } from '@testing-library/react'
import App from '../App'
import Playing from '../components/Playing'
import { DataLayer } from '../DataLayer'
import reducer, { initialState } from '../reducer'
import 'jest-canvas-mock'

test('tests if app renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
})

test('tests rendering of login text on access w/o authentication', () => {
  render(<App />);
  expect(screen.getByText('Welcome to Visualize-Spotify!')).toBeInTheDocument();
})

test('test rendering of Context Layer API', () => {
  render(
    <DataLayer initialState={initialState} reducer={reducer} >
      <App />
    </DataLayer>
  )
  expect(screen.getByText("Welcome to Visualize-Spotify!")).toBeInTheDocument();
})

test('test rendering of playing.js', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Playing />, div);
})

describe('test reducer structure', () => {
  it('test SET_USER action', () => {
    const action = {type: 'SET_USER', user: 'Julie Song'}
    expect(reducer({}, action)).toEqual({'user': 'Julie Song'})
  })

  it('test SET_TOKEN action', () => {
    const action = {type: 'SET_TOKEN', token: '1234'}
    expect(reducer({}, action)).toEqual({'token': '1234'})
  })

  it('test SET_TOP_TRACKS action', () => {
    const action = {type: 'SET_TOP_TRACKS', top_tracks: ['1', '2', '3']}
    expect(reducer({}, action)).toEqual({'top_tracks': ['1', '2', '3']})
  })

  it('test SET_TOP_ARTISTS action', () => {
    const action = {type: 'SET_TOP_ARTISTS', top_artists: ['1', '2', '3']}
    expect(reducer({}, action)).toEqual({'top_artists': ['1', '2', '3']})
  })

  it('test default action', () => {
    const action = {type: ''}
    expect(reducer({}, action)).toEqual({})
  })
})

test('test if token is obtained', () => {
  global.window = Object.create(window);
  Object.defineProperty(window, 'location', {
    value: {
      hash: '#access_token=BQCuytiJflPy-ZatwEOFh5U1hO3g0zSUNAPXvVLgqOod_-B01jt6zcuvi4elPpEBTn3rOqujfWd7X-kDASkD-ZCgNRgZNQrtJOsEDypjotkxIY3Sy95xmKGVyJLNrcuQ7y3WJNUumqWnjYBY6TtHWQ0x6PyRjXcTPob8vNzaJXQqTaKYtDEZF24H9g_2i5bGp9H-fQGNDJ88GcqxyQ&token_type=Bearer&expires_in=3600'
    }
  });
  expect(window.location.hash).toEqual('#access_token=BQCuytiJflPy-ZatwEOFh5U1hO3g0zSUNAPXvVLgqOod_-B01jt6zcuvi4elPpEBTn3rOqujfWd7X-kDASkD-ZCgNRgZNQrtJOsEDypjotkxIY3Sy95xmKGVyJLNrcuQ7y3WJNUumqWnjYBY6TtHWQ0x6PyRjXcTPob8vNzaJXQqTaKYtDEZF24H9g_2i5bGp9H-fQGNDJ88GcqxyQ&token_type=Bearer&expires_in=3600');

  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
})