import mongodb from "mongodb";
const ObjectId = mongodb.ObjectId;

let reviews;

export default class ReviewsDAO {

    static async injectDB(conn) {
        if (reviews) {
            return;
        }
        try {
            reviews = await conn.db(
                process.env.MOVIEREVIEWS_DB_NAME)
                .collection("reviews");
        } catch (e) {
            console.error(`Unable to connect to reviewsDAO: ${e}`);
        }
    }

    static async addReview(movieId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                review: review,
                movie_id: new ObjectId(movieId)
            };
            return await reviews.insertOne(reviewDoc);
        } catch (e) {
            console.error(`Unable to post review: ${e}`);
            return { error: e };
        }
    }

    static async updateReview(reviewId, user, review, date) {
        try {
           const _id = new ObjectId(reviewId);
           const filter = { _id: _id, user_id: user._id, name: user.name };
            const updateResponse = await reviews.updateOne(
                filter,
                { $set: { review: review, date: date } },
            );

            if (updateResponse.modifiedCount === 0) {
                throw new Error("Could not find review to update");
            }

            return updateResponse;
        } catch (e) {
            console.error(`Unable to update review: ${e}`);
            return { error: e };
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const _id = new ObjectId(reviewId);
            const filter = { _id: _id, user_id: userId };
            const deleteResponse = await reviews.deleteOne(filter);

            if (deleteResponse.deletedCount === 0) {
                throw new Error("Could not find review to delete");
            }

            return deleteResponse;

        } catch (e) {
            console.error(`Unable to delete review: ${e}`);
            return { error: e };
        }
    }
}