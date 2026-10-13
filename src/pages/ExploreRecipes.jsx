import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getExploreRecipes } from "../api/recipeApi"; // Adjust relative path to your API file

function ExploreRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search & Pagination states
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Debounce search query by 350ms to prevent spamming requests
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);

    return () => clearTimeout(timer);
  }, [search]);

  // Fetch all public recipes
  useEffect(() => {
    const fetchExploreRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        // In ExploreRecipes.jsx before calling getExploreRecipes:
        const params = { page, limit: 9 };
        if (debouncedSearch) {
          params.search = debouncedSearch;
        }

        const res = await getExploreRecipes(params);

        setRecipes(res.data?.data || []);
        setTotalPages(res.data?.totalPages || 1);
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load community recipes",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExploreRecipes();
  }, [debouncedSearch, page]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Top Header & Search Bar */}
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Explore Recipes
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Discover unique recipes created and shared by the community.
            </p>
          </div>

          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="Search recipes, ingredients, cuisines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 shadow-sm transition focus:border-green-600 focus:outline-none focus:ring-2 focus:ring-green-600/20"
            />
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="my-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Content Body */}
        {loading ? (
          <div className="flex justify-center py-24">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-600 border-t-transparent"></div>
          </div>
        ) : recipes.length === 0 ? (
          <div className="py-24 text-center text-gray-500">
            <p className="text-xl font-medium">No recipes found</p>
            <p className="mt-1 text-sm">
              Try adjusting your search terms or clearing filters.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((item) => (
              <div
                key={item._id}
                className="flex flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
              >
                {/* Recipe Thumbnail */}
                <div className="relative h-48 w-full bg-gray-100">
                  {item.imgUrl ? (
                    <img
                      src={item.imgUrl}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-4xl text-gray-300">
                      🍲
                    </div>
                  )}

                  {item.cuisine && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-semibold text-gray-700 shadow-sm backdrop-blur-sm">
                      {item.cuisine}
                    </span>
                  )}
                </div>

                {/* Card Details */}
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-1">
                    {item.description || "No description provided."}
                  </p>

                  {/* Author and Date Information */}
                  <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3 text-xs text-gray-500">
                    <span className="font-medium text-gray-700">
                      👨‍🍳 {item.userId?.username || "Community Chef"}
                    </span>
                    <span>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  {/* View Details Button */}
                  <Link
                    to={`/recipes/${item._id}`}
                    className="mt-4 inline-block w-full rounded-lg bg-green-600 py-2 text-center text-sm font-semibold text-white transition hover:bg-green-700"
                  >
                    View Recipe
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination Section */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-between border-t border-gray-200 pt-4">
            <span className="text-sm text-gray-600">
              Page <span className="font-semibold text-gray-900">{page}</span>{" "}
              of{" "}
              <span className="font-semibold text-gray-900">{totalPages}</span>
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-md border border-gray-300 bg-white px-3.5 py-1.5 text-xs font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default ExploreRecipes;
