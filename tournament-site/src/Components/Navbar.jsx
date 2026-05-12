import "./Navbar.css";

import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";

function NavBar({ user, logout }) {
    const [open, setOpen] = useState(false);
    const [theme, setTheme] = useState("dark");

    const isLoggedIn = !!user;

    const isAdmin = user?.roles?.includes("admin") ?? false;
    const isManager = user?.roles?.includes("manager") ?? false;
    const isReferee = user?.roles?.includes("referee") ?? false;

    const username = user?.username ?? "guest";

    const localIP = import.meta.env.VITE_INTERNAL_IP;
    const isLocal = window.location.host === localIP;

    const closeMenu = () => setOpen(false);

    /* LOAD SAVED THEME */
    useEffect(() => {
        const saved = localStorage.getItem("theme");

        if (saved) {
            if (saved === "light") {
                document.body.classList.add("light");
                setTheme("light");
            } else {
                document.body.classList.remove("light");
                setTheme("dark");
            }
        } else {
            const systemPrefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;

            if (systemPrefersLight) {
                document.body.classList.add("light");
                setTheme("light");
            } else {
                document.body.classList.remove("light");
                setTheme("dark");
            }
        }
    }, []);

    /* TOGGLE THEME */
    const toggleTheme = () => {
        if (theme === "light") {
            document.body.classList.remove("light");
            localStorage.setItem("theme", "dark");
            setTheme("dark");
        } else {
            document.body.classList.add("light");
            localStorage.setItem("theme", "light");
            setTheme("light");
        }
    };

    return (
        <nav className="nav">
            <div className="nav-left">
                <div className="brand">Vind Tournament</div>

                <button
                    className="menu-btn"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>

                <div className={`nav-links ${open ? "open" : ""}`}>
                    <NavLink onClick={closeMenu} to="/" className="nav-item">
                        Home
                    </NavLink>

                    {isAdmin && isLocal && (
                        <NavLink onClick={closeMenu} to="/admin" className="nav-item admin">
                            Admin panel
                        </NavLink>
                    )}

                    {isManager && (
                        <NavLink onClick={closeMenu} to="/team-info" className="nav-item manager">
                            Team info
                        </NavLink>
                    )}

                    {isReferee && (
                        <NavLink onClick={closeMenu} to="/referee" className="nav-item referee">
                            Referee panel
                        </NavLink>
                    )}
                </div>
            </div>

            <div className="nav-right">
                <button
                    className="btn-gray"
                    onClick={toggleTheme}
                    title="Toggle theme"
                >
                    {theme === "light" ? "Dark" : "Light"}
                </button>

                <div className="user-pill">
                    {username}
                </div>

                {isLoggedIn ? (
                    <button className="logout-btn" onClick={logout}>
                        Logout
                    </button>
                ) : (
                    <NavLink to="/login" className="login-btn">
                        Login
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default NavBar;