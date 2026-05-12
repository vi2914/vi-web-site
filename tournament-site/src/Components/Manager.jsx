import { useEffect, useState } from "react";

export default function ManagerPanel({ apiUrl, user }) {
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [sports, setSports] = useState([]);
    const [arenas, setArenas] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {})
    };

    const loadAll = async () => {
        const [t, m, s, a, ag] = await Promise.all([
            fetch(`${apiUrl}/teams`, { headers }).then(r => r.json()),
            fetch(`${apiUrl}/matches`, { headers }).then(r => r.json()),
            fetch(`${apiUrl}/sports`, { headers }).then(r => r.json()),
            fetch(`${apiUrl}/normalize/arenas`, { headers }).then(r => r.json()),
            fetch(`${apiUrl}/normalize/age-groups`, { headers }).then(r => r.json())
        ]);

        setTeams(t);
        setMatches(m);
        setSports(s);
        setArenas(a);
        setAgeGroups(ag);
    };

    useEffect(() => {
        loadAll();
    }, []);

    /* ================= FORMS ================= */

    const [teamForm, setTeamForm] = useState({
        Team_name: "",
        Sport_ID: "",
        Age_Group_ID: "",
        Manager_ID: ""
    });

    const [matchForm, setMatchForm] = useState({
        Match_date: "",
        Match_time: "",
        Home_team_ID: "",
        Away_team_ID: "",
        Referee_ID: "",
        Arena_ID: "",
        Sport_ID: ""
    });

    const [sportForm, setSportForm] = useState({ Sport_name: "" });
    const [arenaForm, setArenaForm] = useState({
        Arena_name: "",
        Capacity: "",
        Location: ""
    });
    const [ageGroupForm, setAgeGroupForm] = useState({ Group_name: "" });

    const post = async (url, body) => {
        await fetch(url, {
            method: "POST",
            headers,
            body: JSON.stringify(body)
        });
        loadAll();
    };

    /* ================= CREATE ================= */

    const createTeam = () => post(`${apiUrl}/teams`, teamForm);

    const createMatch = () => post(`${apiUrl}/matches`, matchForm);

    const createSport = () => {
        post(`${apiUrl}/sports`, sportForm);
        setSportForm({ Sport_name: "" });
    };

    const createArena = () => {
        post(`${apiUrl}/normalize/arenas`, arenaForm);
        setArenaForm({ Arena_name: "", Capacity: "", Location: "" });
    };

    const createAgeGroup = () => {
        post(`${apiUrl}/normalize/age-groups`, ageGroupForm);
        setAgeGroupForm({ Group_name: "" });
    };

    return (
        <div className="manager-layout">
            <h2>🏆 Manager Panel</h2>
            <p>Logged in as <b>{user.username}</b></p>

            {/* ================= TEAMS ================= */}
            <section>
                <h3>Teams</h3>

                {teams.map(t => (
                    <div key={t.Team_ID}>
                        {t.Team_name}
                    </div>
                ))}

                <h4>Create Team</h4>

                <input
                    placeholder="Team name"
                    value={teamForm.Team_name}
                    onChange={e => setTeamForm({ ...teamForm, Team_name: e.target.value })}
                />

                <select
                    value={teamForm.Sport_ID}
                    onChange={e => setTeamForm({ ...teamForm, Sport_ID: e.target.value })}
                >
                    <option value="">Select Sport</option>
                    {sports.map(s => (
                        <option key={s.Sport_ID} value={s.Sport_ID}>
                            {s.Sport_name}
                        </option>
                    ))}
                </select>

                <select
                    value={teamForm.Age_Group_ID}
                    onChange={e => setTeamForm({ ...teamForm, Age_Group_ID: e.target.value })}
                >
                    <option value="">Select Age Group</option>
                    {ageGroups.map(a => (
                        <option key={a.Age_group_ID} value={a.Age_group_ID}>
                            {a.Group_name}
                        </option>
                    ))}
                </select>

                <button onClick={createTeam}>Create Team</button>
            </section>

            {/* ================= MATCHES ================= */}
            <section>
                <h3>Matches</h3>

                {matches.map(m => (
                    <div key={m.Match_ID}>
                        {m.Match_date} - {m.Match_time}
                    </div>
                ))}

                <h4>Create Match</h4>

                <input
                    type="date"
                    value={matchForm.Match_date}
                    onChange={e => setMatchForm({ ...matchForm, Match_date: e.target.value })}
                />

                <input
                    type="time"
                    value={matchForm.Match_time}
                    onChange={e => setMatchForm({ ...matchForm, Match_time: e.target.value })}
                />

                <select
                    value={matchForm.Home_team_ID}
                    onChange={e => setMatchForm({ ...matchForm, Home_team_ID: e.target.value })}
                >
                    <option value="">Home Team</option>
                    {teams.map(t => (
                        <option key={t.Team_ID} value={t.Team_ID}>
                            {t.Team_name}
                        </option>
                    ))}
                </select>

                <select
                    value={matchForm.Away_team_ID}
                    onChange={e => setMatchForm({ ...matchForm, Away_team_ID: e.target.value })}
                >
                    <option value="">Away Team</option>
                    {teams.map(t => (
                        <option key={t.Team_ID} value={t.Team_ID}>
                            {t.Team_name}
                        </option>
                    ))}
                </select>

                <select
                    value={matchForm.Sport_ID}
                    onChange={e => setMatchForm({ ...matchForm, Sport_ID: e.target.value })}
                >
                    <option value="">Sport</option>
                    {sports.map(s => (
                        <option key={s.Sport_ID} value={s.Sport_ID}>
                            {s.Sport_name}
                        </option>
                    ))}
                </select>

                <select
                    value={matchForm.Arena_ID}
                    onChange={e => setMatchForm({ ...matchForm, Arena_ID: e.target.value })}
                >
                    <option value="">Arena</option>
                    {arenas.map(a => (
                        <option key={a.Arena_ID} value={a.Arena_ID}>
                            {a.Arena_name}
                        </option>
                    ))}
                </select>

                <button onClick={createMatch}>Create Match</button>
            </section>

            {/* ================= SPORTS ================= */}
            <section>
                <h3>Sports</h3>

                {sports.map(s => (
                    <div key={s.Sport_ID}>{s.Sport_name}</div>
                ))}

                <h4>Create Sport</h4>
                <input
                    placeholder="Sport name"
                    value={sportForm.Sport_name}
                    onChange={e => setSportForm({ Sport_name: e.target.value })}
                />
                <button onClick={createSport}>Create Sport</button>
            </section>

            {/* ================= ARENAS ================= */}
            <section>
                <h3>Arenas</h3>

                {arenas.map(a => (
                    <div key={a.Arena_ID}>
                        {a.Arena_name} ({a.Location})
                    </div>
                ))}

                <h4>Create Arena</h4>

                <input
                    placeholder="Arena name"
                    value={arenaForm.Arena_name}
                    onChange={e => setArenaForm({ ...arenaForm, Arena_name: e.target.value })}
                />

                <input
                    placeholder="Capacity"
                    value={arenaForm.Capacity}
                    onChange={e => setArenaForm({ ...arenaForm, Capacity: e.target.value })}
                />

                <input
                    placeholder="Location"
                    value={arenaForm.Location}
                    onChange={e => setArenaForm({ ...arenaForm, Location: e.target.value })}
                />

                <button onClick={createArena}>Create Arena</button>
            </section>

            {/* ================= AGE GROUPS ================= */}
            <section>
                <h3>Age Groups</h3>

                {ageGroups.map(a => (
                    <div key={a.Age_group_ID}>{a.Group_name}</div>
                ))}

                <h4>Create Age Group</h4>

                <input
                    placeholder="Group name"
                    value={ageGroupForm.Group_name}
                    onChange={e => setAgeGroupForm({ Group_name: e.target.value })}
                />

                <button onClick={createAgeGroup}>Create Age Group</button>
            </section>
        </div>
    );
}