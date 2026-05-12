import { useEffect, useState } from "react"

/* ---------------- Manage Players ---------------- */
function ManagePlayers() {

    return (
        <div className="manage-players">
            
        </div>
    )
}

/* ---------------- Manage Team ---------------- */
function ManageTeam() {

    return (
        <div className="manage-team">

        </div>
    )
}

/* ---------------- Main Manager Panel ---------------- */
export default function ManagerPanel({ user }) {
    const isManager = user.roles.includes("manager");

    return (
        <div className="manager-layout">
            <div className="manager-top">
                <h2>Manager Panel</h2>
                <p>Welcome <strong>{user.username}</strong></p>
            </div>
        </div>
    )
}