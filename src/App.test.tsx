import App from './App'
import { render, screen } from '@testing-library/react'
import React from 'react'

test('renders learn react link', () => {
  render(<App />)
  const el = screen.getByText(/Cipher text/i)
  expect(el).toBeInTheDocument()
})
