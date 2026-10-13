import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Register from "../pages/Register";
import RecipeList from "../pages/RecipeList";
import AddRecipe from "../pages/AddRecipe";
import EditRecipe from "../pages/EditRecipe";
import RecipeDetails from "../pages/RecipeDetails";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ExploreRecipes from "../pages/ExploreRecipes"; // Community recipes page

import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* ================= Public Routes ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Optional fallback for unauthorized access */}
        <Route
          path="/unauthorized"
          element={
            <div style={{ textAlign: "center", padding: "3rem" }}>
              <h2>403 - Forbidden</h2>
              <p>
                You do not have administrative permissions to view this page.
              </p>
            </div>
          }
        />

        {/* ================= Standard Protected Routes ================= */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Community / Explore Feed */}
        <Route
          path="/explore"
          element={
            <ProtectedRoute>
              <ExploreRecipes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipes"
          element={
            <ProtectedRoute>
              <RecipeList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipes/add"
          element={
            <ProtectedRoute>
              <AddRecipe />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipes/:id"
          element={
            <ProtectedRoute>
              <RecipeDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/recipes/edit/:id"
          element={
            <ProtectedRoute>
              <EditRecipe />
            </ProtectedRoute>
          }
        />

        {/* ================= Admin Only Routes ================= */}
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Catch-all 404 route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
