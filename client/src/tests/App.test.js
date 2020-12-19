import React from 'react'
import ReactDOM from 'react-dom'
import { render, screen } from '@testing-library/react'
import App from '../App'
import Playing from '../components/Playing'
import 'jest-canvas-mock'

test('app renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
})

test('renders login text on access w/o authentication', () => {
  render(<App />);
  expect(screen.getByText('Welcome to Visualize-Spotify!')).toBeInTheDocument();
})
/*
test('renders playing.js', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Playing />, div);
})
*/