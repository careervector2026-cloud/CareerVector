import React from 'react'
import { Routes,Route } from 'react-router-dom'
import Index from "../pages/Index"
const MainRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<Index></Index>}></Route>
    </Routes>
  )
}
export default MainRouter