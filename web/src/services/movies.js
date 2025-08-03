import axios from 'axios';

class MoviesDataService {
    getAll(page = 0) {
        return axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?page=${page}`
        );
    }

    getSingle(id) {
        return axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/id/${id}`
        );
    }

    find(query, by = "title", page = 0) {
        return axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies?${by}=${query}&page=${page}`
        );
    }

    createReview(data) {
        return axios.post(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, data
        );
    }

    editReview(data) {
        return axios.put(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review/`, data
        );
    }

    deleteReview(reviewId, userId) {
        return axios.delete(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/review`, {
                data: {
                    review_id: reviewId,
                    user_id: userId
                }
            }
        );
    }

    getRatings() {
        return axios.get(
            `${process.env.REACT_APP_API_BASE_URL}/api/v1/movies/ratings`
        );
    }
}

const moviesDataService = new MoviesDataService();
export default moviesDataService;