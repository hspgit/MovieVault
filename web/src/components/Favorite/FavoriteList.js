import React, {useState, useEffect, useCallback, useRef} from 'react';
import {DndProvider} from 'react-dnd';
import {HTML5Backend} from 'react-dnd-html5-backend';
import FavoritesDataService from "../../services/favorites";
import MovieDndContainer from './MovieDndContainer';
import './FavoriteList.css'

const FavoriteList = ({user, favorites, setFavorites}) => {
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const currentMovieIdsRef = useRef([]);

    // Fetch favorite movies when user and favorites are available
    const fetchFavoriteMovies = useCallback(() => {
        FavoritesDataService.getFavoriteMovieDetails(favorites)
            .subscribe({
                           next: (movies) => {
                               const orderedMovies = favorites.map(
                                   id => movies.find(m => m._id === id));
                               setFavoriteMovies(orderedMovies);
                               currentMovieIdsRef.current = orderedMovies.map(movie => movie._id);
                               setLoading(false);
                           },
                           error: (e) => {
                               console.error("Failed to load favorites:", e);
                               setError("Failed to load favorite movies");
                               setLoading(false);
                           }
                       });
    }, [favorites]);

    useEffect(() => {
        if (user && favorites && favorites.length > 0) {
            const favoritesChanged = favorites.length !== currentMovieIdsRef.current.length ||
                                     !favorites.every(
                                         id => currentMovieIdsRef.current.includes(id));

            if (currentMovieIdsRef.current.length === 0 || favoritesChanged) {
                setLoading(true);
                fetchFavoriteMovies();
            }
        }
    }, [user, favorites, fetchFavoriteMovies]);

    // Callback to handle drop completion
    const handleDropComplete = (newMovieOrder) => {
        const movieIds = newMovieOrder.map(movie => movie._id);
        FavoritesDataService.updateFavorites(user._id, movieIds)
            .then(() => {
                setFavorites(movieIds);
            })
            .catch((error) => {
                console.error("Error updating favorite movies order:", error);
                setError("Failed to update favorite movies order");
            });
    };

    if (!user) {
        return <p>Please log in to view your favorite movies.</p>;
    }

    if (loading) {
        return <p>Loading favorite movies...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    if (!favorites || favorites.length === 0) {
        return <p>No favorite movies found.</p>;
    }

    return (
        <div className="favorite-list-container">
            <div className="favorite-list-info">
                <h2>Favorite Movies</h2>
                <p>Drag your favorites to rank them</p>
            </div>
            <div className="favorite-list">
                {favoriteMovies.length > 0 ? (
                    <DndProvider backend={HTML5Backend}>
                        <MovieDndContainer
                            movies={favoriteMovies}
                            setMovies={setFavoriteMovies}
                            onDropComplete={handleDropComplete}
                        />
                    </DndProvider>
                ) : (
                     <p>No favorite movies found.</p>
                 )}
            </div>

        </div>
    );
}

export default FavoriteList;