import React, { useState } from "react";
import { useAccessToken } from "../hooks/useAccessToken";
import { config } from "./config.js";

export default function InviteUser({ onUserInvited }) {
  const { getAdminToken } = useAccessToken();

  const [email, setEmail] = useState("");
  const [givenName, setGivenName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  const handleInvite = async (e) => {
    e.preventDefault();
    setStatus(null);
    setError(null);

    try {
      const apiToken = await getAdminToken();

      const response = await fetch(`${config.apiBaseUrl}/admin-api/user/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({
          email,
          given_name: givenName,
          family_name: familyName,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Unknown error");

      setStatus("✅ User invited successfully");
      setTimeout(() => {
        onUserInvited?.();  // Refresh list after delay
      }, 1000);
      
    } catch (err) {
      setError(`❌ Invite failed: ${err.message}`);
    }
  };

  return (
    <form onSubmit={handleInvite} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input type="email" className="w-full border px-3 py-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input type="text" className="w-full border px-3 py-2 rounded" value={givenName} onChange={(e) => setGivenName(e.target.value)} />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <input type="text" className="w-full border px-3 py-2 rounded" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
      </div>
      <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Invite</button>

      {status && <p className="text-green-600 text-sm">{status}</p>}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
