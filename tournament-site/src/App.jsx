import './App.css'

import { useEffect, useMemo, useState } from 'react'
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

function MatchesPage({ apiUrl }) {
    const [matches, setMatches] = useState([]);
    const [sports, setSports] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);

    const [selectedSport, setSelectedSport] = useState("");
    const [selectedAgeGroup, setSelectedAgeGroup] = useState("");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            setLoading(true);

            const [matchesRes, sportsRes, ageGroupsRes] =
                await Promise.all([
                    fetch(`${apiUrl}/matches`),
                    fetch(`${apiUrl}/sports`),
                    fetch(`${apiUrl}/normalize/age-groups`)
                ]);

            if (
                !matchesRes.ok ||
                !sportsRes.ok ||
                !ageGroupsRes.ok
            ) {
                console.log("Response statuses:", {
                    matchesStatus: matchesRes.status,
                    sportsStatus: sportsRes.status,
                    ageGroupsStatus: ageGroupsRes.status
                });
                console.log("Failed responses:", {
                    matchesRes,
                    sportsRes,
                    ageGroupsRes
                });
                throw new Error("Failed to fetch data");
            }

            const matchesData = await matchesRes.json();
            const sportsData = await sportsRes.json();
            const ageGroupsData = await ageGroupsRes.json();

            setMatches(matchesData);
            setSports(sportsData);
            setAgeGroups(ageGroupsData);

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredMatches = useMemo(() => {
        return matches.filter((match) => {

            const sportFilter =
                !selectedSport ||
                match.Sport_ID === selectedSport;

            const ageGroupFilter =
                !selectedAgeGroup ||
                match.Age_group_ID === selectedAgeGroup;

            return sportFilter && ageGroupFilter;
        });
    }, [matches, selectedSport, selectedAgeGroup]);

    function formatDate(timestamp) {
        return new Date(Number(timestamp)).toLocaleString();
    }

    if (loading) {
        return (
            <div className="p-6 text-xl">
                Loading matches...
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">

            <h1 className="text-4xl font-bold mb-8">
                Matches
            </h1>

            {/* FILTERS */}
            <div className="flex flex-wrap gap-6 mb-8">

                {/* SPORT FILTER */}
                <div>
                    <label className="block mb-2 font-semibold">
                        Sport
                    </label>

                    <select
                        value={selectedSport}
                        onChange={(e) =>
                            setSelectedSport(e.target.value)
                        }
                        className="border rounded px-4 py-2"
                    >
                        <option value="">
                            All Sports
                        </option>

                        {sports.map((sport) => (
                            <option
                                key={sport.Sport_ID}
                                value={sport.Sport_ID}
                            >
                                {sport.Sport_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* AGE GROUP FILTER */}
                <div>
                    <label className="block mb-2 font-semibold">
                        Age Group
                    </label>

                    <select
                        value={selectedAgeGroup}
                        onChange={(e) =>
                            setSelectedAgeGroup(e.target.value)
                        }
                        className="border rounded px-4 py-2"
                    >
                        <option value="">
                            All Age Groups
                        </option>

                        {ageGroups.map((group) => (
                            <option
                                key={group.Age_group_ID}
                                value={group.Age_group_ID}
                            >
                                {group.Group_name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* MATCHES */}
            <div className="grid gap-5">

                {filteredMatches.length === 0 && (
                    <div className="text-gray-500">
                        No matches found.
                    </div>
                )}

                {filteredMatches.map((match) => (
                    <div
                        key={match.Match_ID}
                        className="border rounded-xl p-5 shadow-sm"
                    >
                        <h2 className="text-2xl font-semibold mb-3">
                            {match.Home_team_ID} vs{" "}
                            {match.Away_team_ID}
                        </h2>

                        <div className="space-y-1">

                            <p>
                                <span className="font-semibold">
                                    Date:
                                </span>{" "}
                                {formatDate(match.Match_Time)}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Sport:
                                </span>{" "}
                                {match.Sport_ID}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Arena:
                                </span>{" "}
                                {match.Arena_ID}
                            </p>

                            <p>
                                <span className="font-semibold">
                                    Result:
                                </span>{" "}
                                {match.Result || "Not played"}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
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

                        <Route path="/" element={<MatchesPage apiUrl={apiUrl} />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    )
}

export default App