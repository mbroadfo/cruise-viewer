import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link } from "react-router-dom";

export default function PortalAdmin() {
  const { user, isAuthenticated, logout, getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();
  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const role = user && user["https://cruise-viewer.app/roles"]?.role;
  const isAdmin = isAuthenticated && role === "admin";

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const listUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = await getAccessTokenSilently();
      const res = await fetch("https://zf5sdrd108.execute-api.us-west-2.amazonaws.com/prod/admin-api/users", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
  
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
  
      const result = await res.json();
      setUsers(result.data.users);  // << correct
    } catch (err) {
      console.error("List users failed:", err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };  

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex justify-center items-center min-h-screen bg-gray-50">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Portal Admin</h1>

        <div className="space-y-3 text-center">
          <button className="w-full bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded" onClick={() => alert("Invite logic coming soon")}>Invite User</button>
          <button className="w-full bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded" onClick={listUsers}>List Users</button>
          <button className="w-full bg-red-100 hover:bg-red-200 px-4 py-2 rounded" onClick={() => alert("Delete logic coming soon")}>Delete User</button>
        </div>

        {loading && <p className="text-sm text-gray-500 text-center">Loading users...</p>}
        {error && <p className="text-sm text-red-500 text-center">{error}</p>}

        {users && (
          <div className="mt-4 text-left space-y-2 max-h-64 overflow-y-auto border-t pt-4 text-sm">
            {users.map((u) => (
              <div key={u.user_id} className="border-b pb-2">
                <div><strong>Email:</strong> {u.email}</div>
                <div><strong>Name:</strong> {u.name || "(no name)"}</div>
                <div><strong>Role:</strong> {u.app_metadata?.role || "(none)"}</div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-gray-100 space-y-2 text-center">
          <Link to="/" className="inline-block text-blue-600 hover:underline text-sm">
            ← Back to Trips
          </Link>
          <br />
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm text-gray-800"
            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
