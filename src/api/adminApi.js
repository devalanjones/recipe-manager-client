import api from "./axios";

// ================= ADMIN USER MANAGEMENT ================= //

// Fetch users with pagination and search: /admin/users?page=1&limit=10&search=john
export const getAllUsers = (params = {}) => {
  return api.get("/admin/users", { params });
};

// Toggle user status (activate / deactivate): /admin/users/:id/status
export const toggleUserStatus = (userId, isActive) => {
  return api.patch(`/admin/users/${userId}/status`, { isActive });
};

// Delete user and cascade delete their recipes: /admin/users/:id
export const deleteUser = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};