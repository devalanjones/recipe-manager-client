import { useEffect, useState } from "react";
import { getAllUsers, toggleUserStatus, deleteUser } from "./adminApi";

function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    try {
      const res = await getAllUsers({ page, limit: 10, search });
      setUsers(res.data.users);
    } catch (err) {
      console.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, [page, search]);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await toggleUserStatus(id, !currentStatus);
      loadUsers(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This will also delete their recipes.")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete user");
    }
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search username or email..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      {/* Render user table / list here */}
    </div>
  );
}