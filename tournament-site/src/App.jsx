import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NavBar from './Components/Navbar'
import AdminPanel from './Components/admin';

function App() {

  
  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/*" element={<Navigate to="/" />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App