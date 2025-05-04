import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate, Link } from "react-router-dom";
import ListUsers from "../components/ListUsers";
import InviteUser from "../components/InviteUser";
import DeleteUser from "../components/DeleteUser";
import { useAccessToken } from "../hooks/useAccessToken";

export default function PortalAdmin() {
  const {
    user,
    isAuthenticated,
    isLoading,
    logout,
  } = useAuth0();
  const { getAdminToken } = useAccessToken();
  const navigate = useNavigate();
  const [selectedCommand, setSelectedCommand] = useState("list");
  const [refreshKey, setRefreshKey] = useState(0);

  const role = user && user["https://cruise-viewer.app/roles"]?.role;
  const isAdmin = isAuthenticated && role === "admin";

  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      navigate("/");
    }
  }, [isAuthenticated, isAdmin, navigate, isLoading]);  

  useEffect(() => {
    if (isAdmin) {
      getAdminToken().then(token => {
        console.log("✅ Admin token fetched", token.slice(0, 30) + "...");
      }).catch(err => {
        console.error("❌ Failed to fetch admin token", err);
      });
    }
  }, [isAdmin, getAdminToken]);

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-600">Checking access permissions...</p>
      </div>
    );
  }

  if (!isAuthenticated || !isAdmin) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-xl font-semibold">Access Denied</h1>
        <p>You do not have permission to view this page.</p>
      </div>
    );
  }

  return (
    <div className="p-8 flex min-h-screen bg-gray-50 space-x-6">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 w-64 space-y-4">
        <h1 className="text-2xl font-bold text-center">Portal Admin</h1>

        <div className="flex flex-col space-y-3 pt-6">
          <button
            className="bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded"
            onClick={() => setSelectedCommand("list")}
          >
            List Users
          </button>
          <button
            className="bg-blue-100 hover:bg-blue-200 px-4 py-2 rounded"
            onClick={() => setSelectedCommand("invite")}
          >
            Invite User
          </button>
          <button
            className="bg-red-100 hover:bg-red-200 px-4 py-2 rounded"
            onClick={() => setSelectedCommand("delete")}
          >
            Delete User
          </button>
        </div>

        <div className="pt-6 border-t border-gray-100 text-center space-y-2">
          <Link
            to="/"
            className="inline-block text-blue-600 hover:underline text-sm"
          >
            ← Back to Trips
          </Link>
          <br />
          <button
            className="w-full bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded text-sm text-gray-800"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
          >
            Log out
          </button>
        </div>
      </div>

      {selectedCommand && (
        <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-6">
          {selectedCommand === "list" && (
            <>
              <h2 className="text-xl font-semibold mb-4">User List</h2>
              <ListUsers key={refreshKey} />
            </>
          )}
          {selectedCommand === "invite" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Invite a New User</h2>
              <InviteUser onUserInvited={() => {
                setRefreshKey(prev => prev + 1);
                setSelectedCommand("list");
              }} />
            </>
          )}
          {selectedCommand === "delete" && (
            <>
              <h2 className="text-xl font-semibold mb-4">Delete a User</h2>
              <DeleteUser onUserDeleted={() => {
                setRefreshKey(prev => prev + 1);
                setSelectedCommand("list");
              }} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
