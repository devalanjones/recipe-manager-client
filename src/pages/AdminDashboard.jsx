import { useEffect, useState, useMemo, useRef, useCallback } from "react";
// Double-check this path matches your folder structure:
import Navbar from "../components/Navbar";
import { getAllUsers, toggleUserStatus, deleteUser } from "../api/adminApi";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const latestRequestId = useRef(0);

  const currentUserId = useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user")) || {};
      return user._id || user.id || null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const loadUsers = useCallback(async () => {
    const requestId = ++latestRequestId.current;
    setLoading(true);
    setError("");

    try {
      const res = await getAllUsers({
        page,
        limit: 10,
        search: debouncedSearch,
      });

      if (requestId !== latestRequestId.current) return;

      const userList = res.data?.users || [];
      const pagination = res.data?.pagination || {};

      setUsers(userList);
      setTotalPages(pagination.totalPages || 1);
      setTotalUsers(pagination.totalUsers || 0);

      if (userList.length === 0 && page > 1) {
        setPage((p) => p - 1);
      }
    } catch (err) {
      if (requestId === latestRequestId.current) {
        setError(err.response?.data?.message || "Failed to load users");
      }
    } finally {
      if (requestId === latestRequestId.current) {
        setLoading(false);
      }
    }
  }, [page, debouncedSearch]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleStatusToggle = async (userId, currentStatus) => {
    if (userId === currentUserId) {
      alert("You cannot suspend your own account.");
      return;
    }

    try {
      await toggleUserStatus(userId, !currentStatus);
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isActive: !currentStatus } : u,
        ),
      );
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (userId, username) => {
    if (userId === currentUserId) {
      alert("You cannot delete your own account.");
      return;
    }

    const confirm = window.confirm(
      `Are you sure you want to delete ${username}? This will permanently remove their recipes and account.`,
    );
    if (!confirm) return;

    try {
      await deleteUser(userId);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-6xl mx-auto my-8 p-6 bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              User Management
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Total users registered:{" "}
              <span className="font-semibold text-gray-700">{totalUsers}</span>
            </p>
          </div>

          <div className="w-full md:w-72">
            <input
              type="text"
              placeholder="Search by username or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:bg-white transition-all placeholder:text-gray-400"
            />
          </div>
        </div>

        {error && (
          <div className="my-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">
            {error}
          </div>
        )}

        <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs uppercase font-semibold text-gray-500 border-b border-gray-200">
              <tr>
                <th scope="col" className="px-6 py-3.5">
                  User
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Email
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Role
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Status
                </th>
                <th scope="col" className="px-6 py-3.5">
                  Joined
                </th>
                <th scope="col" className="px-6 py-3.5 text-center">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-green-600 border-t-transparent mr-2 align-middle"></div>
                    Loading accounts...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400">
                    No accounts found matching your query.
                  </td>
                </tr>
              ) : (
                users.map((u) => {
                  const isSelf = u._id === currentUserId;
                  const isActive = u.isActive !== false;

                  return (
                    <tr
                      key={u._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {u.username}
                        {isSelf && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
                            You
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                        {u.email}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role || "user"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                            isActive
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {isActive ? "Active" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => handleStatusToggle(u._id, isActive)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md border transition-all ${
                              isSelf
                                ? "opacity-30 cursor-not-allowed bg-gray-50 border-gray-200 text-gray-400"
                                : isActive
                                  ? "border-amber-300 text-amber-700 bg-amber-50 hover:bg-amber-100"
                                  : "border-emerald-300 text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                            }`}
                          >
                            {isActive ? "Suspend" : "Activate"}
                          </button>
                          <button
                            type="button"
                            disabled={isSelf}
                            onClick={() => handleDelete(u._id, u.username)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-md text-white transition-all ${
                              isSelf
                                ? "opacity-30 cursor-not-allowed bg-gray-400"
                                : "bg-red-600 hover:bg-red-700"
                            }`}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-5 mt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Page <span className="font-semibold text-gray-800">{page}</span> of{" "}
            <span className="font-semibold text-gray-800">
              {totalPages || 1}
            </span>
          </span>

          <div className="inline-flex gap-2">
            <button
              type="button"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Previous
            </button>
            <button
              type="button"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
              className="px-3.5 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
