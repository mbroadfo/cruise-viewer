import React, { useEffect, useState } from "react";
import { useAccessToken } from "../lib/admin-api";


export default function ListUsers() {
  const { getCachedAccessToken } = useAccessToken(); // ✅ moved here

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiToken = await getCachedAccessToken();
        console.log("Access token:", apiToken);

        const response = await fetch(
          "https://jwkw1ft2g7.execute-api.us-west-2.amazonaws.com/prod/admin-api/users",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${apiToken}`,
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
  }, [getCachedAccessToken]); // good practice to include hook return in deps

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-red-600 text-sm">{error}</p>;

  return <ListUsers users={users} />;
}
