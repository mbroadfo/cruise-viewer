import React, { useEffect, useState } from "react";
import { useAccessToken } from "../lib/admin-api";

export default function ListUsersWrapper() {
  const { getCachedAccessToken } = useAccessToken();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = await getCachedAccessToken();

        const res = await fetch("https://jwkw1ft2g7.execute-api.us-west-2.amazonaws.com/admin-api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await res.json();
        setUsers(data.data.users || []);
      } catch (err) {
        setError(`❌ Failed to load users: ${err.message}`);
      }
    };

    fetchUsers();
  }, [getCachedAccessToken]);

  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return <ListUsers users={users} />;
}

function ListUsers({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">User ID</th>
            <th className="px-4 py-2 text-left">Verified</th>
            <th className="px-4 py-2 text-left">Login Count</th>
            <th className="px-4 py-2 text-left">Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{`${u.given_name || ""} ${u.family_name || ""}`.trim()}</td>
              <td className="px-4 py-2">{u.app_metadata?.role || ""}</td>
              <td className="px-4 py-2 font-mono text-xs break-all">{u.user_id}</td>
              <td className="px-4 py-2">{u.email_verified ? "Yes" : "No"}</td>
              <td className="px-4 py-2">{u.logins_count ?? "-"}</td>
              <td className="px-4 py-2 whitespace-nowrap">{u.last_login ? new Date(u.last_login).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
