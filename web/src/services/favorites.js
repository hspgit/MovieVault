import axios from 'axios';
import MovieDataService from './movies';
import {forkJoin, from} from "rxjs";
import {map} from "rxjs/operators";

class FavoritesDataService {
    getFavoriteForUser(userId) {
        return axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites/${userId}`
        );
    }

    updateFavorites(userId, favorites) {
        return axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/favorites`, {
                _id: userId,
                favorites: favorites
            });
    }

    getFavoriteMovieDetails(movieIds) {
        const requests = movieIds.map(id => MovieDataService.getSingle(id));
        return from(forkJoin(requests)).pipe(
            map(responses => responses.map(response => response.data))
        );
    }
}

export default new FavoritesDataService();