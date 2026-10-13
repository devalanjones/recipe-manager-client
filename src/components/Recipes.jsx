import { useEffect, useState } from "react";
import { getExploreRecipes } from "../api/recipeApi";

export default function RecipeExplorer() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    
    const [search, setSearch] = useState("pasta");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    
    useEffect(() => {
        // Flag to discard results if the component unmounts or inputs change rapidly
        let isSubscribed = true;
        
        const fetchExplore = async () => {
            setLoading(true);
            setError("");
            
            try {
                // In ExploreRecipes.jsx before calling getExploreRecipes:
                const params = { page, limit: 9 };
                if (debouncedSearch) {
                    params.search = debouncedSearch;
                }
                const res = await getExploreRecipes(params);
                
                
                if (isSubscribed) {
                    // Extracts the recipe list populated with author details from userId
                    setRecipes(res.data?.data || []);
                    setTotalPages(res.data?.totalPages || 1);
                }
            } catch (err) {
                if (isSubscribed) {
                    setError(
                        err.response?.data?.message || "Failed to load community recipes",
                    );
                }
            } finally {
                if (isSubscribed) {
                    setLoading(false);
                }
            }
        };
        
        fetchExplore();
        
        return () => {
            isSubscribed = false;
        };
    }, [search, page]);
    
    return (
        <div className="p-6 max-w-6xl mx-auto">
      {/* Search Input */}
      <input
        type="text"
        value={search}
        onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // Reset to page 1 on new query
        }}
        placeholder="Search recipes..."
        className="w-full max-w-sm mb-6 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-600 outline-none"
        />

      {/* Error state */}
      {error && (
          <div className="p-3 mb-4 bg-red-50 text-red-700 text-sm rounded">
          {error}
        </div>
      )}

      {/* Loading & Grid */}
      {loading ? (
          <p className="text-gray-500">Loading recipes...</p>
        ) : recipes.length === 0 ? (
            <p className="text-gray-500">No recipes found for "{search}".</p>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
              <div
              key={recipe._id}
              className="border rounded-xl p-4 bg-white shadow-sm flex flex-col justify-between"
              >
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {recipe.title}
                </h3>
                <p className="text-sm text-gray-600 line-clamp-2 mt-1">
                  {recipe.description}
                </p>
              </div>

              {/* Author information from Mongoose populate */}
              <div className="mt-4 pt-3 border-t text-xs text-gray-500 flex justify-between">
                <span>By: {recipe.userId?.username || "Unknown Chef"}</span>
                <span>{recipe.cuisine || "General"}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
