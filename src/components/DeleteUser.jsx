import React, { useState } from "react";
import { useAccessToken } from "../hooks/useAccessToken";
import { config } from "./config.js";

export default function DeleteUser({ onUserDeleted }) {
  const { getAdminToken } = useAccessToken();

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const apiToken = await getAdminToken();

      const response = await fetch(`${config.apiBaseUrl}/admin-api/user/favorites`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unknown error");

      setStatus("✅ User deleted successfully");
      setTimeout(() => {
        onUserDeleted?.();  // Refresh list after delay
      }, 1000);
      
    } catch (err) {
      setError(`❌ Delete failed: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleDelete} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          className="w-full border px-3 py-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
        Delete
      </button>

      {status && <p className="text-green-600 text-sm">{status}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
