// src/app/admin/genres/page.tsx
"use client";

import { useState, useEffect } from "react";
import { GenreService } from "@/services/genreService";
import { motion } from "framer-motion";

interface Genre {
  genreId: number;
  genreName: string;
}

export default function GenresPage() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [newGenreName, setNewGenreName] = useState("");
  const [editingGenre, setEditingGenre] = useState<Genre | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  async function fetchGenres() {
    try {
      setLoading(true);
      const data = await GenreService.getGenres();
      setGenres(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching genres:", error);
      setError("Failed to load genres");
    } finally {
      setLoading(false);
    }
  }

  async function handleAddGenre(e: React.FormEvent) {
    e.preventDefault();
    if (!newGenreName.trim()) return;

    try {
      await GenreService.createGenre({ genreName: newGenreName });
      setNewGenreName("");
      fetchGenres();
    } catch (error) {
      console.error("Error adding genre:", error);
      setError("Failed to add genre");
    }
  }

  async function handleUpdateGenre(e: React.FormEvent) {
    e.preventDefault();
    if (!editingGenre || !editingGenre.genreName.trim()) return;

    try {
      await GenreService.updateGenre(editingGenre.genreId, {
        genreName: editingGenre.genreName,
      });
      setEditingGenre(null);
      fetchGenres();
    } catch (error) {
      console.error("Error updating genre:", error);
      setError("Failed to update genre");
    }
  }

  async function handleDeleteGenre(genreId: number) {
    if (!confirm("Are you sure you want to delete this genre?")) return;

    try {
      await GenreService.deleteGenre(genreId);
      fetchGenres();
    } catch (error) {
      console.error("Error deleting genre:", error);
      setError("Failed to delete genre");
    }
  }

  if (loading) return <p className="text-center">Loading genres...</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Genre Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Add new genre form */}
      <form onSubmit={handleAddGenre} className="mb-8 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Add New Genre</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={newGenreName}
            onChange={(e) => setNewGenreName(e.target.value)}
            placeholder="Genre genreName"
            className="flex-1 border rounded px-3 py-2"
            required
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Genre
          </motion.button>
        </div>
      </form>

      {/* Edit genre form */}
      {editingGenre && (
        <form onSubmit={handleUpdateGenre} className="mb-8 bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Edit Genre</h2>
          <div className="flex gap-2">
            <input
              type="text"
              value={editingGenre.genreName}
              onChange={(e) => setEditingGenre({ ...editingGenre, genreName: e.target.value })}
              placeholder="Genre genreName"
              className="flex-1 border rounded px-3 py-2"
              required
            />
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Update
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => setEditingGenre(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </motion.button>
            </div>
          </div>
        </form>
      )}

      {/* Genres list */}
      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {genres.map((genre) => (
              <motion.tr
                key={genre.genreId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {genre.genreId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {genre.genreName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => setEditingGenre(genre)}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteGenre(genre.genreId)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
