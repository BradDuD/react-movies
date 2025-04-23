import { createContext, useContext, useEffect, useState } from 'react';

const MovieContext = createContext();

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  const [favorites, setFavorites] = useState(() => {
    try {
      const storedFavs = localStorage.getItem('favorites');
      return storedFavs ? JSON.parse(storedFavs) : [];
    } catch (err) {
      console.error("Error reading favorites from localStorage:", err);
      return [];
    }
  });

  // Persist to localStorage every time favorites array changes
  useEffect(() => {
    try {
      localStorage.setItem('favorites', JSON.stringify(favorites));
    } catch (err) {
      console.error("Error saving favorites to localStorage:", err);
    }
  }, [favorites]);

  // Add movie if not already in favorites
  const addToFavorites = (movie) => {
    setFavorites((prev) => {
      const exists = prev.some((fav) => fav.id === movie.id);
      if (exists) return prev;
      return [...prev, movie];
    });
  };

  // Remove movie by id
  const removeFromFavorites = (movieId) => {
    setFavorites((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  // Check if movie is in favorites
  const isFavorite = (movieId) => {
    return favorites.some((movie) => movie.id === movieId);
  };

  const value = {
    favorites,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  };

  return (
    <MovieContext.Provider value={value}>
      {children}
    </MovieContext.Provider>
  );
};
