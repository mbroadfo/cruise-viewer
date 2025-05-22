import React, { useState, useCallback } from "react";
import { useAccessToken } from "../hooks/useAccessToken";
import { config } from "../config.js";

export default function DeleteUser({ onUserDeleted }) {
  const { getAdminToken } = useAccessToken();
  const memorizedGetToken = useCallback(() => getAdminToken(), [getAdminToken]);

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const apiToken = await memorizedGetToken();
      if (!apiToken) throw new Error("No token available");
      
      console.log("BEARER token:", apiToken);
      
      // Step 1: Lookup user
      const lookupRes = await fetch(`${config.apiBaseUrl}/admin-api/users`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      });

      if (!lookupRes.ok) {
        const errorText = await lookupRes.text();
        throw new Error(`Lookup failed: ${lookupRes.status} ${errorText}`);
      }

      const lookupJson = await lookupRes.json();
      const user = lookupJson.data.users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase()
      );

      if (!user) throw new Error("No user found with that email");

      console.log("User ID:", encodeURIComponent(user.user_id));

      // Step 2: DELETE user by ID
      const deleteRes = await fetch(
        `${config.apiBaseUrl}/admin-api/users/${encodeURIComponent(user.user_id)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!deleteRes.ok) {
        const errorText = await deleteRes.text();
        throw new Error(`Delete failed: ${deleteRes.status} ${errorText}`);
      }

      setStatus("✅ User deleted successfully");
      setTimeout(() => onUserDeleted?.(), 1000);

    } catch (err) {
      console.error("Delete failed:", err);
      setError(`❌ ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleDelete} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
      >
        Delete
      </button>

      <p className="text-green-600 dark:text-green-400 text-sm">{status}</p>
      <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
    </form>
  );
}
