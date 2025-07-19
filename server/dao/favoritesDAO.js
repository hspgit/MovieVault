let favoritesCollection;

export default class FavoritesDAO {
    static async injectDB(conn) {
        if (favoritesCollection) {
            return;
        }
        try {
            favoritesCollection = await conn.db(process.env.MOVIEREVIEWS_DB_NAME)
                .collection("favorites");
        } catch (e) {
            console.error(`Unable to connect to favoritesDAO: ${e}`);
        }

    }

    static async updateFavorites(userId, favorites) {
        try {
            return await favoritesCollection.updateOne(
                {_id: userId},
                {$set: {favorites: favorites}},
                {upsert: true}
            );
        } catch (e) {
            console.error(`Unable to update favorites, ${e}`);
            return { error: e.message };
        }
    }

    static async getFavorites(userId) {
        let cursor;
        try {
            cursor = await favoritesCollection.findOne({ _id: userId });
            if (!cursor) {
                return [];
            }
            return await cursor["favorites"];
        } catch (e) {
            console.error(`Unable to get favorites, ${e}`);
            throw e;
        }
    }
}