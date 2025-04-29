import React from "react";

export default function ListUsers({ users }) {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full border-collapse text-sm">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Role</th>
            <th className="px-4 py-2 text-left">User ID</th>
            <th className="px-4 py-2 text-left">Verified</th>
            <th className="px-4 py-2 text-left">Login Count</th>
            <th className="px-4 py-2 text-left">Last Login</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.user_id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{u.email}</td>
              <td className="px-4 py-2">{`${u.given_name || ""} ${u.family_name || ""}`.trim()}</td>
              <td className="px-4 py-2">{u.app_metadata?.role || ""}</td>
              <td className="px-4 py-2 font-mono text-xs break-all">{u.user_id}</td>
              <td className="px-4 py-2">{u.email_verified ? "Yes" : "No"}</td>
              <td className="px-4 py-2">{u.logins_count ?? "-"}</td>
              <td className="px-4 py-2 whitespace-nowrap">{u.last_login ? new Date(u.last_login).toLocaleString() : "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
