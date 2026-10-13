import api from "./axios";

// Get user's own recipes
export const getRecipes = () => api.get("/recipes");

// Get all recipes from all users (Explore feed with optional search & pagination)
export const getExploreRecipes = (params) =>
  api.get("/recipes/explore", { params });

// Create a new recipe with image upload
export const createRecipes = (data) =>
  api.post("/recipes", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Get a single recipe by ID
export const getRecipe = (id) => api.get(`/recipes/${id}`);

// Update a recipe with image upload
export const updateRecipe = (id, data) =>
  api.put(`/recipes/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete a recipe
export const deleteRecipe = (id) => api.delete(`/recipes/${id}`);
