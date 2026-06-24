import React from 'react'
import { NavLink } from 'react-router-dom'

export default function Sidebar(){
  return (
    <aside className="sidebar">
      <h1>Evolution Predictor</h1>
      <nav className="nav">
        <NavLink to="/">Overview</NavLink>
        <NavLink to="/analysis">Repository Analysis</NavLink>
      </nav>
    </aside>
  )
}
