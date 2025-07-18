import FavoritesDao from '../dao/favoritesDAO.js';

export default class FavoritesController {
    static async apiUpdateFavorites(req, res, next) {
        try {
            const FavoritesResponse = await FavoritesDao.updateFavorites(
                req.body._id,
                req.body.favorites
            );

            let { error } = FavoritesResponse;

            if (error) {
                res.status(500).json({ error });
            }

            res.json({ status: "success" });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }

    static async apiGetFavorites(req, res, next) {
        try {
            let id = req.params.userId;
            let favorites = await FavoritesDao.getFavorites(id);
            if (!favorites) {
                res.status(404).json({ error: "No favorites found for this user" });
                return;
            }
            res.json(favorites);
        } catch (e) {
            console.error(`API, ${e}`);
            res.status(500).json({ error: e });
        }

    }
}