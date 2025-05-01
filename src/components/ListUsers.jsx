import React, { useEffect, useState } from "react";
import ListUsers from "./ListUsers";
import { getManagementToken } from "../lib/token-utils";
import { getCachedAccessToken } from "../lib/admin-api";

export default function ListUsersContainer() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const [apiToken, mgmtToken] = await Promise.all([
          getCachedAccessToken(),
          getManagementToken(),
        ]);

        const response = await fetch(
          "https://jwkw1ft2g7.execute-api.us-west-2.amazonaws.com/admin-api/users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiToken}`,
              "X-Management-Token": mgmtToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(`❌ Failed to load users: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return <ListUsers users={users} />;
}
