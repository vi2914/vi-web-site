import './App.css'

import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import NavBar from './Components/Navbar'
import AdminPanel from './Components/admin';
import ManagerPanel from './Components/Manager';
import RefereePanel from './Components/Referee';
import Login from './Components/login';

function RequireAuth({ user, children }) {
    if (!user) return <Navigate to="/login" replace />;
    return children;
}

function RequireRole({ user, roles, children }) {
    const ok = roles.some(r => user.roles.includes(r));
    if (!ok) return <Navigate to="/" replace />;
    return children;
}

function RequireLocal({ children }) {
    const localIP = import.meta.env.VITE_INTERNAL_IP;
    const isLocal = window.location.host === localIP;

    if (!isLocal) return <Navigate to="/" replace />;
    return children;
} 

function App() {
    const ApiIp =window.location.host === import.meta.env.VITE_INTERNAL_IP ? import.meta.env.VITE_INTERNAL_API_IP : import.meta.env.VITE_EXTERNAL_API_IP;

    const [user, setUser] = useState(null);
    const [apiUrl, setApiUrl] = useState(`http://${ApiIp}/api/v1`);

    const logout = async () => {
        try {
          localStorage.removeItem("token");
        } catch (err) {
            console.error("Logout failed:", err);
        } finally {
            setUser(null);
            <Navigate to="/" replace />
        }
    };

    return (
        <BrowserRouter>
            <div className="app-layout">
                <NavBar user={user} logout={logout} />

                <main className="app-content">
                    <Routes>
                        <Route path="/*" element={<Navigate to="/" />} />
                        <Route path="/admin" element={
                            <RequireAuth user={user}>
                                <RequireRole user={user} roles={["admin"]} >
                                    <RequireLocal>
                                        <AdminPanel user={user} apiUrl={apiUrl} />
                                    </RequireLocal>
                                </RequireRole>
                            </RequireAuth>}
                        />

                        <Route path="/login" element={<Login setUser={setUser} apiUrl={apiUrl} />} />

                        <Route path="/manager" element={
                            <RequireAuth user={user}>
                                <RequireRole user={user} roles={["manager", "admin"]} >
                                    <ManagerPanel user={user} apiUrl={apiUrl} />
                                </RequireRole>
                            </RequireAuth>} 
                        />

                        <Route path="/referee" element={
                            <RequireAuth user={user}>
                                <RequireRole user={user} roles={["referee", "admin"]} >
                                    <RefereePanel user={user} apiUrl={apiUrl} />
                                </RequireRole>
                            </RequireAuth>} 
                        />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}

export default App