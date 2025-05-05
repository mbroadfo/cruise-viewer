import React, { useEffect, useState, useCallback } from "react";
import { useAccessToken } from "../hooks/useAccessToken";
import { config } from "./config.js";

function UsersTable({ users }) {
  return (
    <table className="min-w-full border-collapse border border-gray-300 mt-4 text-sm">
      <thead className="bg-gray-100">
        <tr>
          <th className="border px-4 py-2 text-left">Email</th>
          <th className="border px-4 py-2 text-left">Name</th>
          <th className="border px-4 py-2 text-left">User ID</th>
          <th className="border px-4 py-2 text-left">Logins</th>
          <th className="border px-4 py-2 text-left">Last Login</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.user_id} className="hover:bg-gray-50">
            <td className="border px-4 py-2">{user.email}</td>
            <td className="border px-4 py-2">
              {user.given_name} {user.family_name}
            </td>
            <td className="border px-4 py-2">{user.user_id}</td>
            <td className="border px-4 py-2">{user.logins_count ?? "—"}</td>
            <td className="border px-4 py-2">
              {user.last_login ? new Date(user.last_login).toLocaleString() : "Never"}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}


export default function ListUsers() {
  const { getAdminToken, forceReLogin } = useAccessToken(); 
  const memorizedGetToken = useCallback(() => getAdminToken(), [getAdminToken]);


  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiToken = await memorizedGetToken();
        if (!apiToken) throw new Error("No token available");

        const response = await fetch(`${config.apiBaseUrl}/admin-api/user/favorites`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("Fetch failed:", response.status, errorText);
          throw new Error(`Failed to fetch users: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        setUsers(data.data.users);  // <-- Adjust based on actual structure
      } catch (err) {
        console.error("User fetch failed:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [memorizedGetToken]);

  if (loading) return <p>Loading users...</p>;

  if (error?.includes("login_required") || error?.includes("consent_required")) {
    return (
      <div>
        <p className="text-red-600 text-sm">⚠️ Login required to access admin panel.</p>
        <button onClick={forceReLogin} className="text-blue-600 underline">
          Click here to log in again
        </button>
      </div>
    );
  }

  if (error) return <p className="text-red-600 text-sm">❌ {error}</p>;

  return <UsersTable users={users} />;
}
