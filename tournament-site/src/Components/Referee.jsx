import "./Referee.css";

import { useEffect, useState } from "react";

export default function RefereePage({ apiUrl, user }) {
    const [refereeId, setRefereeId] = useState(null);
    const [matches, setMatches] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [inputs, setInputs] = useState({});

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    // 1. GET UUID FROM USERNAME
    const fetchRefereeId = async () => {
        try {
            const res = await fetch(
                `${apiUrl}/accounts/username/${user.username}`,
                { headers }
            );

            if (!res.ok) {
                throw new Error("Failed to get referee id");
            }

            const data = await res.json();

            // expects: { uuid: "..." } or { Referee_ID: "..." }
            const id = data.uuid || data.Referee_ID;

            if (!id) throw new Error("No referee id found");

            setRefereeId(id);
            return id;
        } catch (err) {
            setError(err.message);
            return null;
        }
    };

    // 2. GET MATCHES
    const loadMatches = async (id) => {
        try {
            setLoading(true);

            const res = await fetch(
                `${apiUrl}/matches/referee/${id}`,
                { headers }
            );

            if (!res.ok) {
                throw new Error("Failed to load matches");
            }

            const data = await res.json();
            setMatches(Array.isArray(data) ? data : []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            const id = await fetchRefereeId();
            if (id) await loadMatches(id);
        };

        init();
    }, [user.username]);

    const updateResult = async (matchId) => {
    try {
        const result = inputs[matchId];

        if (!result || !result.includes("-")) return;

        const [home, away] = result.split("-");

        const homeScore = Number(home);
        const awayScore = Number(away);

        if (Number.isNaN(homeScore) || Number.isNaN(awayScore)) return;

        await fetch(`${apiUrl}/matches/${matchId}/result`, {
            method: "POST",
            headers,
            body: JSON.stringify({
                homeScore,
                awayScore
            })
        });

        if (refereeId) {
            await loadMatches(refereeId);
        }
    } catch (err) {
        console.error(err);
    }
};

    if (loading) {
        return <div className="ref-page">Loading matches...</div>;
    }

    if (error) {
        return <div className="ref-page error">{error}</div>;
    }

    return (
        <div className="ref-page">

            <h1>⚖️ Referee Panel</h1>

            <div className="ref-grid">

                {matches.length === 0 && (
                    <div className="empty">
                        No assigned matches.
                    </div>
                )}

                {matches.map((m) => (
                    <div key={m.Match_ID} className="ref-card">

                        <div className="teams">
                            {m.Home_Team_Name} vs {m.Away_Team_Name}
                        </div>

                        <div className="meta">
                            🏟 {m.Arena_Name}
                        </div>

                        <div className="meta">
                            ⚽ {m.Sport_Name}
                        </div>

                        <div className="meta">
                            📅 {new Date(m.Match_Time).toLocaleString()}
                        </div>

                        <div className="result">
                            Result: <b>{m.Result ?? "Not set"}</b>
                        </div>

                        <div className="actions">

    <input
        value={inputs[m.Match_ID] ?? m.Result ?? ""}
        onChange={(e) =>
            setInputs({
                ...inputs,
                [m.Match_ID]: e.target.value
            })
        }
        placeholder="e.g. 2-1"
    />

    <button
        onClick={() => updateResult(m.Match_ID)}
    >
        Update
    </button>

</div>

                    </div>
                ))}

            </div>
        </div>
    );
}