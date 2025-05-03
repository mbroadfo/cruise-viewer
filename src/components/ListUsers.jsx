import React, { useEffect, useState, useCallback } from "react";
import { useAccessToken } from "../lib/admin-api";

function UsersTable({ users }) {
  return (
    <table>
      <thead>
        <tr><th>Email</th><th>Name</th></tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.user_id}>
            <td>{user.email}</td>
            <td>{user.given_name} {user.family_name}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ListUsers() {
  const { getCachedAccessToken, forceReLogin } = useAccessToken();
  const memorizedGetToken = useCallback(() => getCachedAccessToken(), [getCachedAccessToken]);

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
        console.log("Using token:", apiToken.slice(0, 20), "...");

        const response = await fetch(
          "https://zf5sdrd108.execute-api.us-west-2.amazonaws.com/prod/admin-api/users",
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
        console.log("Users received:", data);
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
