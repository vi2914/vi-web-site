import "./Manager.css";

import { useEffect, useState } from "react";

export default function ManagerPanel({ apiUrl, user }) {
    const [teams, setTeams] = useState([]);
    const [matches, setMatches] = useState([]);
    const [sports, setSports] = useState([]);
    const [arenas, setArenas] = useState([]);
    const [ageGroups, setAgeGroups] = useState([]);
    const [referees, setReferees] = useState([]);

    const token = localStorage.getItem("token");

    const headers = {
        "Content-Type": "application/json",
        ...(token
            ? { Authorization: `Bearer ${token}` }
            : {})
    };

    const loadAll = async () => {
        try {
            const [
                teamsData,
                matchesData,
                sportsData,
                arenasData,
                ageGroupsData,
                refereesData
            ] = await Promise.all([
                fetch(`${apiUrl}/teams`, { headers }).then(r => r.json()),
                fetch(`${apiUrl}/matches`, { headers }).then(r => r.json()),
                fetch(`${apiUrl}/sports`, { headers }).then(r => r.json()),
                fetch(`${apiUrl}/normalize/arenas`, { headers }).then(r => r.json()),
                fetch(`${apiUrl}/normalize/age-groups`, { headers }).then(r => r.json()),
                fetch(`${apiUrl}/matches/referees`, { headers }).then(r => r.json())
            ]);

            setTeams(Array.isArray(teamsData) ? teamsData : []);
            setMatches(Array.isArray(matchesData) ? matchesData : []);
            setSports(Array.isArray(sportsData) ? sportsData : []);
            setArenas(Array.isArray(arenasData) ? arenasData : []);
            setAgeGroups(Array.isArray(ageGroupsData) ? ageGroupsData : []);
            setReferees(Array.isArray(refereesData) ? refereesData : []);
        } catch (err) {
            console.error(err);
        }
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
        Home_Team_Name: "",
        Away_team_ID: "",
        Away_Team_Name: "",
        Referee_ID: "",
        Arena_ID: "",
        Sport_ID: ""
    });

    const [sportForm, setSportForm] = useState({
        Sport_name: ""
    });

    const [arenaForm, setArenaForm] = useState({
        Arena_name: "",
        Capacity: "",
        Location: "",
        Sport_IDs: []
    });

    const [ageGroupForm, setAgeGroupForm] = useState({
        Group_name: ""
    });

    /* ================= HELPERS ================= */

    const post = async (url, body) => {
        try {
            const res = await fetch(url, {
                method: "POST",
                headers,
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const data = await res.json();
                alert(data.error || data.message || "Something went wrong");
                return;
            }

            await loadAll();
        } catch (err) {
            console.error(err);
        }
    };

    const del = async (url) => {
        try {
            await fetch(url, {
                method: "DELETE",
                headers
            });

            await loadAll();
        } catch (err) {
            console.error(err);
        }
    };

    /* ================= CREATE ================= */

    const createTeam = async () => {
        await post(`${apiUrl}/teams`, teamForm);

        setTeamForm({
            Team_name: "",
            Sport_ID: "",
            Age_Group_ID: "",
            Manager_ID: ""
        });
    };

    const createMatch = async () => {
        await post(`${apiUrl}/matches`, matchForm);

        setMatchForm({
            Match_date: "",
            Match_time: "",
            Home_team_ID: "",
            Away_team_ID: "",
            Referee_ID: "",
            Arena_ID: "",
            Sport_ID: ""
        });
    };

    const createSport = async () => {
        await post(
            `${apiUrl}/sports`,
            sportForm
        );

        setSportForm({
            Sport_name: ""
        });
    };

    const createArena = async () => {
        await post(
            `${apiUrl}/normalize/arenas`,
            arenaForm
        );

        setArenaForm({
            Arena_name: "",
            Capacity: "",
            Location: "",
            Sport_IDs: []
        });
    };

    const createAgeGroup = async () => {
        await post(
            `${apiUrl}/normalize/age-groups`,
            ageGroupForm
        );

        setAgeGroupForm({
            Group_name: ""
        });
    };

    const safeFindTeam = (id) => teams.find(t => t.Team_ID === id);

    return (
        <div className="manager-layout">
            <h2>Manager Panel</h2>

            <p>
                Logged in as <b>{user.username}</b>
            </p>

            {/* ================= TEAMS ================= */}

            <section>
                <h3>Teams</h3>

                <div className="list">
                    {teams.map(team => (
                        <div
                            key={team.Team_ID}
                            className="card"
                        >
                            <b>{team.Team_name}</b>
                            <button onClick={() => del(`${apiUrl}/teams/${team.Team_ID}`)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                <h4>Create Team</h4>

                <input
                    placeholder="Team name"
                    value={teamForm.Team_name}
                    onChange={(e) =>
                        setTeamForm({
                            ...teamForm,
                            Team_name: e.target.value
                        })
                    }
                />

                <select
                    value={teamForm.Sport_ID}
                    onChange={(e) =>
                        setTeamForm({
                            ...teamForm,
                            Sport_ID: e.target.value
                        })
                    }
                >
                    <option value="">
                        Select Sport
                    </option>

                    {sports.map(sport => (
                        <option
                            key={sport.Sport_ID}
                            value={sport.Sport_ID}
                        >
                            {sport.Sport_name}
                        </option>
                    ))}
                </select>

                <select
                    value={teamForm.Age_Group_ID}
                    onChange={(e) =>
                        setTeamForm({
                            ...teamForm,
                            Age_Group_ID: e.target.value
                        })
                    }
                >
                    <option value="">
                        Select Age Group
                    </option>

                    {ageGroups.map(group => (
                        <option
                            key={group.Age_group_ID}
                            value={group.Age_group_ID}
                        >
                            {group.Group_name}
                        </option>
                    ))}
                </select>

                <button onClick={createTeam}>
                    Create Team
                </button>
            </section>

            {/* ================= MATCHES ================= */}

            <section>
                <h3>Matches</h3>

                <div className="list">
                    {matches.map(match => {

                        const referee = referees.find(
                            r =>
                                r.Referee_ID === match.Referee_ID ||
                                r.Account_ID === match.Referee_ID
                        );

                        const date = match.Match_date || "";
                        const time =
                            typeof match.Match_time === "string"
                                ? match.Match_time.slice(0, 5)
                                : match.Match_time;

                        return (
                            <div key={match.Match_ID} className="card">
                                <b>
                                    {match.Home_Team_Name ?? "Unknown"} vs{" "}
                                    {match.Away_Team_Name ?? "Unknown"}
                                </b>

                                <div>
                                    {date} {time}
                                </div>

                                <div>
                                    Referee:{" "}
                                    {referee?.Username ||
                                        referee?.username ||
                                        "Unassigned"}
                                </div>
                                <button onClick={() => del(`${apiUrl}/matches/${match.Match_ID}`)}>
                                    Delete
                                </button>
                            </div>
                        );
                    })}
                </div>

                <h4>Create Match</h4>

                <input
                    type="date"
                    value={matchForm.Match_date}
                    onChange={(e) =>
                        setMatchForm({
                            ...matchForm,
                            Match_date: e.target.value
                        })
                    }
                />

                <input
                    type="time"
                    value={matchForm.Match_time}
                    onChange={(e) =>
                        setMatchForm({
                            ...matchForm,
                            Match_time: e.target.value
                        })
                    }
                />

                <select
                    value={matchForm.Home_team_ID}
                    onChange={(e) =>
                        setMatchForm({
                            ...matchForm,
                            Home_team_ID: e.target.value
                        })
                    }
                >
                    <option value="">
                        Home Team
                    </option>

                    {teams.map(team => (
                        <option
                            key={team.Team_ID}
                            value={team.Team_ID}
                        >
                            {team.Team_name}
                        </option>
                    ))}
                </select>

                <select
                    value={matchForm.Away_team_ID}
                    onChange={(e) =>
                        setMatchForm({
                            ...matchForm,
                            Away_team_ID: e.target.value
                        })
                    }
                >
                    <option value="">
                        Away Team
                    </option>

                    {teams.map(team => (
                        <option
                            key={team.Team_ID}
                            value={team.Team_ID}
                        >
                            {team.Team_name}
                        </option>
                    ))}
                </select>

                <select
                    value={matchForm.Sport_ID}
                    onChange={(e) =>
                        setMatchForm({
                            ...matchForm,
                            Sport_ID: e.target.value
                        })
                    }
                >
                    <option value="">
                        Sport
                    </option>

                    {sports.map(sport => (
                        <option
                            key={sport.Sport_ID}
                            value={sport.Sport_ID}
                        >
                            {sport.Sport_name}
                        </option>
                    ))}
                </select>

                <select
                    value={matchForm.Arena_ID}
                    onChange={(e) =>
                        setMatchForm({
                            ...matchForm,
                            Arena_ID: e.target.value
                        })
                    }
                >
                    <option value="">
                        Arena
                    </option>

                    {arenas.map(arena => (
                        <option
                            key={arena.Arena_ID}
                            value={arena.Arena_ID}
                        >
                            {arena.Arena_name}
                        </option>
                    ))}
                </select>

                <select
                    value={matchForm.Referee_ID}
                    onChange={(e) =>
                        setMatchForm({
                            ...matchForm,
                            Referee_ID: e.target.value
                        })
                    }
                >
                    <option value="">
                        Referee
                    </option>

                    {referees.map(referee => (
                        <option
                            key={
                                referee.Referee_ID ||
                                referee.Account_ID
                            }
                            value={
                                referee.Referee_ID ||
                                referee.Account_ID
                            }
                        >
                            {referee.First_name &&
                            referee.Last_name
                                ? `${referee.First_name} ${referee.Last_name}`
                                : referee.Username ||
                                  referee.username ||
                                  "Unknown Referee"}
                        </option>
                    ))}
                </select>

                <button onClick={createMatch}>
                    Create Match
                </button>
            </section>

            {/* ================= SPORTS ================= */}

            <section>
                <h3>Sports</h3>

                <div className="list">
                    {sports.map(sport => (
                        <div
                            key={sport.Sport_ID}
                            className="card"
                        >
                            {sport.Sport_name}
                            <button onClick={() => del(`${apiUrl}/sports/${sport.Sport_ID}`)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                <h4>Create Sport</h4>

                <input
                    placeholder="Sport name"
                    value={sportForm.Sport_name}
                    onChange={(e) =>
                        setSportForm({
                            Sport_name: e.target.value
                        })
                    }
                />

                <button onClick={createSport}>
                    Create Sport
                </button>
            </section>

            {/* ================= ARENAS ================= */}

            <section>
                <h3>Arenas</h3>

                <div className="list">
                    {arenas.map(arena => (
                        <div
                            key={arena.Arena_ID}
                            className="card"
                        >
                            <b>{arena.Arena_name}</b>

                            <div>
                                {arena.Location}
                            </div>

                            <div>
                                Capacity: {arena.Capacity}
                            </div>

                            <button onClick={() => del(`${apiUrl}/normalize/arenas/${arena.Arena_ID}`)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                <h4>Create Arena</h4>

                <input
                    placeholder="Arena name"
                    value={arenaForm.Arena_name}
                    onChange={(e) =>
                        setArenaForm({
                            ...arenaForm,
                            Arena_name: e.target.value
                        })
                    }
                />

                <input
                    placeholder="Capacity"
                    value={arenaForm.Capacity}
                    onChange={(e) =>
                        setArenaForm({
                            ...arenaForm,
                            Capacity: e.target.value
                        })
                    }
                />

                <input
                    placeholder="Location"
                    value={arenaForm.Location}
                    onChange={(e) =>
                        setArenaForm({
                            ...arenaForm,
                            Location: e.target.value
                        })
                    }
                />

                <div>
                    <p>Select Sports</p>

                    {sports.map(sport => (
                        <label
                            key={sport.Sport_ID}
                            style={{
                                display: "block"
                            }}
                        >
                            <input
                                type="checkbox"
                                checked={arenaForm.Sport_IDs.includes(sport.Sport_ID)}
                                onChange={(e) => {
                                    if (e.target.checked) {
                                        setArenaForm({
                                            ...arenaForm,
                                            Sport_IDs: [
                                                ...arenaForm.Sport_IDs,
                                                sport.Sport_ID
                                            ]
                                        });
                                    } else {
                                        setArenaForm({
                                            ...arenaForm,
                                            Sport_IDs: arenaForm.Sport_IDs.filter(
                                                id => id !== sport.Sport_ID
                                            )
                                        });
                                    }
                                }}
                            />

                            {sport.Sport_name}
                        </label>
                    ))}
                </div>

                <button onClick={createArena}>
                    Create Arena
                </button>
            </section>

            {/* ================= AGE GROUPS ================= */}

            <section>
                <h3>Age Groups</h3>

                <div className="list">
                    {ageGroups.map(group => (
                        <div
                            key={group.Age_group_ID}
                            className="card"
                        >
                            {group.Group_name}
                            <button onClick={() => del(`${apiUrl}/normalize/age-groups/${group.Age_group_ID}`)}>
                                Delete
                            </button>
                        </div>
                    ))}
                </div>

                <h4>Create Age Group</h4>

                <input
                    placeholder="Group name"
                    value={ageGroupForm.Group_name}
                    onChange={(e) =>
                        setAgeGroupForm({
                            Group_name: e.target.value
                        })
                    }
                />

                <button onClick={createAgeGroup}>
                    Create Age Group
                </button>
            </section>
        </div>
    );
}