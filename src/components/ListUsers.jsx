import React from "react";

export default function ListUsers({ users }) {
  if (!users || users.length === 0) {
    return <p className="text-sm text-gray-500 text-center">No users found.</p>;
  }

  return (
    <div className="mt-4 text-left space-y-2 max-h-64 overflow-y-auto border-t pt-4 text-sm">
      {users.map((u) => (
        <div key={u.user_id} className="border-b pb-2">
          <div><strong>Email:</strong> {u.email}</div>
          <div><strong>Name:</strong> {u.name || "(no name)"}</div>
          <div><strong>Role:</strong> {u.app_metadata?.role || "(none)"}</div>
        </div>
      ))}
    </div>
  );
}
