import React, { useState } from "react";
import { getManagementToken } from "../lib/token-utils";
import { getCachedAccessToken } from "../lib/admin-api";

export default function DeleteUser() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleDelete = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const [apiToken, mgmtToken] = await Promise.all([
        getCachedAccessToken(),
        getManagementToken()
      ]);

      const res = await fetch("https://jwkw1ft2g7.execute-api.us-west-2.amazonaws.com/admin-api/users", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
          "X-Management-Token": mgmtToken,
        },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Unknown error");

      setStatus("✅ User deleted successfully");
      setEmail("");
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
