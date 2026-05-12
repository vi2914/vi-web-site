import "./Login.css";

import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login({ setUser, apiUrl }) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: ""
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Login failed");

            setUser({
                username: data.username,
                roles: data.roles || []
            });

            localStorage.setItem("token", data.token);

            navigate("/");

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <form onSubmit={handleSubmit} className="login-card">
                <h2 className="login-title">Login</h2>

                <input
                    name="username"
                    onChange={handleChange}
                    placeholder="Username"
                    className="login-input"
                />

                <input
                    name="password"
                    type="password"
                    onChange={handleChange}
                    placeholder="Password"
                    className="login-input"
                />

                <button
                    className="btn-blue full"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
}

export default Login;