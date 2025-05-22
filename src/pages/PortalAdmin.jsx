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
      getAdminToken().catch(err => {
        console.error("❌ Failed to fetch admin token", err);
      });
    }
  }, [isAdmin, getAdminToken]);  

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-sm text-gray-600 dark:text-gray-300">Checking access permissions...</p>
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
    <div className="p-4 md:p-8 flex flex-col space-y-4 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Portal Admin</h1>
        <div className="flex flex-wrap gap-2">
          <button
            className="bg-yellow-100 dark:bg-transparent dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-700 border border-yellow-300 px-3 py-2 rounded text-xs font-medium"
            onClick={() => setSelectedCommand("list")}
          >
            List Users
          </button>
          <button
            className="bg-blue-100 dark:bg-transparent dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-700 border border-blue-300 px-3 py-2 rounded text-xs font-medium"
            onClick={() => setSelectedCommand("invite")}
          >
            Invite User
          </button>
          <button
            className="bg-red-100 dark:bg-transparent dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-700 border border-red-300 px-3 py-2 rounded text-xs font-medium"
            onClick={() => setSelectedCommand("delete")}
          >
            Delete User
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2">
        <Link to="/" className="text-blue-600 hover:underline text-sm">← Back to Trips</Link>
        <button
          className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 px-3 py-2 rounded text-sm text-gray-800 dark:text-gray-200"
          onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
        >
          Log out
        </button>
      </div>

      {selectedCommand && (
        <div className="flex-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4 md:p-6 overflow-x-auto">
          {selectedCommand === "list" && (
            <>
              <h2 className="text-xl font-semibold mb-4">User List</h2>
              <div className="overflow-x-auto">
                <ListUsers key={refreshKey} />
              </div>
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
