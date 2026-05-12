import { useEffect, useState } from "react"

/* ---------------- View Matches ---------------- */
function ViewMatches() {

    return (
        <div className="view-matches">
            
        </div>
    )
}

/* ---------------- Main Referee Panel ---------------- */
export default function RefereePanel({ user }) {
    const isReferee = user.roles.includes("referee");

    return (
        <div className="referee-layout">
            <div className="referee-top">
                <h2>Referee Panel</h2>
                <p>Welcome <strong>{user.username}</strong></p>
            </div>
        </div>
    )
}