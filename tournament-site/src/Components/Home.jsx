import './Home.css';

import { useEffect, useMemo, useState } from 'react';

export default function MatchesPage({ apiUrl }) {
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

            if (!matchesRes.ok || !sportsRes.ok || !ageGroupsRes.ok) {
                throw new Error("Failed to fetch data");
            }

            const matchesData = await matchesRes.json();
            const sportsData = await sportsRes.json();
            const ageGroupsData = await ageGroupsRes.json();

            setMatches(matchesData);
            setSports(sportsData);
            setAgeGroups(ageGroupsData);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    const filteredMatches = useMemo(() => {
        return matches.filter((match) => {
            const sportFilter =
                !selectedSport ||
                String(match.Sport_ID) === String(selectedSport);

            const ageGroupFilter =
                !selectedAgeGroup ||
                String(match.Age_group_ID) === String(selectedAgeGroup);

            return sportFilter && ageGroupFilter;
        });
    }, [matches, selectedSport, selectedAgeGroup]);

    function formatDate(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    if (loading) {
        return <div className="state">Loading matches...</div>;
    }

    if (error) {
        return <div className="state error">{error}</div>;
    }

    return (
        <div className="matches-page">

            <h1 className="matches-title">
                Matches
            </h1>

            {/* FILTERS */}
            <div className="filters">

                <div className="filter-group">
                    <label>Sport</label>

                    <select
                        value={selectedSport}
                        onChange={(e) => setSelectedSport(e.target.value)}
                    >
                        <option value="">All Sports</option>

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

                <div className="filter-group">
                    <label>Age Group</label>

                    <select
                        value={selectedAgeGroup}
                        onChange={(e) => setSelectedAgeGroup(e.target.value)}
                    >
                        <option value="">All Age Groups</option>

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
            <div className="matches-grid">

                {filteredMatches.length === 0 && (
                    <div className="empty">
                        No matches found.
                    </div>
                )}

                {filteredMatches.map((match) => (
                    <div key={match.Match_ID} className="match-card">

                        <div className="match-title">
                            {match.Home_Team_Name} vs {match.Away_Team_Name}
                        </div>

                        <div className="match-info">

                            <div>
                                <span>Date:</span> {formatDate(match.Match_Time)}
                            </div>

                            <div>
                                <span>Sport:</span> {match.Sport_Name}
                            </div>

                            <div>
                                <span>Arena:</span> {match.Arena_Name}
                            </div>

                            <div>
                                <span>Result:</span> {match.Result || "Not played"}
                            </div>

                        </div>
                    </div>
                ))}

            </div>
        </div>
    );
}