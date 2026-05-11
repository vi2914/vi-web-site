import { useEffect, useState } from "react";

/* ---------------- CREATE USER ---------------- */
function AdminCreateUser({ isAdmin }) {
    const [form, setForm] = useState({
        username: "",
        password: "",
        email: "",
        roles: ""
    });

    if (!isAdmin) return null;

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            username: form.username,
            password: form.password,
            email: form.email,
            roles: form.roles
                .split(",")
                .map(r => r.trim())
                .filter(Boolean)
        };

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.message);

            alert("User created");

            setForm({
                username: "",
                password: "",
                email: "",
                roles: ""
            });

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="card admin-card">
            <h3>➕ Create User</h3>

            <form onSubmit={handleSubmit} className="admin-form">
                <input name="username" value={form.username} onChange={handleChange} placeholder="Username" />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" />
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Password" />
                <input name="roles" value={form.roles} onChange={handleChange} placeholder="Roles (comma separated)" />

                <button className="btn-green full">
                    Create User
                </button>
            </form>
        </div>
    );
}

/* ---------------- USERS PANEL ---------------- */
function AdminUserPanel({ isAdmin }) {
    const [users, setUsers] = useState([]);
    const [selected, setSelected] = useState([]);

    if (!isAdmin) return null;

    const token = localStorage.getItem("token");

    const fetchUsers = async () => {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/users`, {
            headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
        });

        const data = await res.json();
        setUsers(data.users || data);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleSelect = (uuid) => {
        setSelected((prev) =>
            prev.includes(uuid)
                ? prev.filter((id) => id !== uuid)
                : [...prev, uuid]
        );
    };

    const deleteSelected = async () => {
        const token = localStorage.getItem("token");

        await Promise.all(
            selected.map((uuid) =>
                fetch(`${import.meta.env.VITE_API_URL}/auth/user/${uuid}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) }
                })
            )
        );

        setSelected([]);
        fetchUsers();
    };

    return (
        <div className="card admin-card">
            <div className="admin-header">
                <h3>👥 Users</h3>

                <button
                    onClick={deleteSelected}
                    className="btn-red"
                    disabled={!selected.length}
                >
                    Delete Selected
                </button>
            </div>

            <div className="user-grid">
                {users.map((u) => (
                    <div key={u.uuid} className="user-card">
                        <label className="user-card-top">
                            <input
                                type="checkbox"
                                checked={selected.includes(u.uuid)}
                                disabled={u.username === "admin"}
                                onChange={() => toggleSelect(u.uuid)}
                            />

                            <div className="user-title">
                                {u.username}
                            </div>
                        </label>

                        <div className="user-email">{u.email}</div>

                        <div className="user-roles">
                            {u.roles?.map((r, i) => (
                                <span key={i} className="badge">{r}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ---------------- MAIN PANEL ---------------- */
export default function AdminPanel({ user }) {
    const isAdmin = user.roles.includes("admin");

    return (
        <div className="admin-layout">
            <div className="admin-top">
                <h2>🛠 Admin Dashboard</h2>
                <p>Logged in as <b>{user.username}</b></p>
            </div>

            <div className="admin-grid">
                <AdminCreateUser isAdmin={isAdmin} />
                <AdminUserPanel isAdmin={isAdmin} />
            </div>
        </div>
    );
}