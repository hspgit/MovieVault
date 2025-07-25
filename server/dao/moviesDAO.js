import mongodb from "mongodb";

const ObjectId = mongodb.ObjectId;

let movies;

export default class MoviesDAO {

    static async injectDB(conn) {
        if (movies) {
            return;
        }
        try {
            movies = await conn.db(
                process.env.MOVIEREVIEWS_DB_NAME)
                .collection("movies");
        } catch (e) {
            console.error(`Unable to connect to moviesDAO: ${e}`);
        }
    }

    static async getMovies({
                               filters = null,
                               page = 0,
                               moviesPerPage = 20
                           } = {}) { // empty object as default value
        let query = {};
        if (filters) {
            if ("title" in filters) {
                query = {$text: {$search: filters["title"]}};
            } else if ("rated" in filters) {
                query = {rated: {$eq: filters["rated"]}};
            }
        }

        let cursor;

        try {
            cursor = await movies.find(query)
                .limit(moviesPerPage)
                .skip(moviesPerPage * page);
            const moviesList = await cursor.toArray();
            const totalNumMovies = await movies.countDocuments(query);
            return {moviesList, totalNumMovies};
        } catch (e) {
            console.error(`Unable to issue find command, ${e}`);
            return {moviesList: [], totalNumMovies: 0};
        }
    }

    static async getRatings() {
        let ratings = [];
        try {
            ratings = await movies.distinct("rated");
            return ratings;
        } catch (e) {
            console.error(`Unable to get ratings, ${e}`);
            return ratings;
        }
    }

    static async getSingleMovieById(id) {
        try {
            return await movies.aggregate([
                                              {
                                                  $match: {
                                                      _id: new ObjectId(id),
                                                  }
                                              },
                                              {
                                                  $lookup: {
                                                      from: "reviews",
                                                      localField: '_id',
                                                      foreignField: 'movie_id',
                                                      as: 'reviews'
                                                  }
                                              }
                                          ]).next();
        } catch (e) {
            console.error(`Unable to get movie by id, ${e}`);
            throw e;
        }
    }

}