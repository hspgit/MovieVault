import {useState, useEffect, useCallback} from "react";
import {GoogleOAuthProvider} from "@react-oauth/google";
import {Routes, Route, Link} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css"
import Container from "react-bootstrap/Container";
import {Navbar, Nav} from "react-bootstrap";

import MovieList from "./components/Movie/MoviesList";
import Movie from "./components/Movie/Movie";
import Login from "./components/Authentication/Login";
import Logout from "./components/Authentication/Logout";
import AddReview from "./components/Review/AddReview";
import FavoritesDataService from "./services/favorites";

import './App.css';
import FavoriteList from "./components/Favorite/FavoriteList";

const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

function App() {

    const [user, setUser] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [shouldSaveFavorites, setShouldSaveFavorites] = useState(false);

    const fetchFavorites = useCallback(async () => {
        FavoritesDataService.getFavoriteForUser(user.googleId)
            .then(response => {
                setFavorites(response.data ? response.data : []);
            })
            .catch(e => {
                console.error("Failed to load favorites:", e);
            });
    }, [user]);

    const saveFavorites = useCallback(async () => {
        if (shouldSaveFavorites) {
            FavoritesDataService.updateFavorites(user.googleId, favorites)
                .then(response => {
                })
                .catch(e => {
                    console.error("Error updating favorites:", e);
                });
        }
    }, [favorites, user, shouldSaveFavorites]);

    useEffect(() => {
        if (user && shouldSaveFavorites) {
            saveFavorites().then(_ => _);
            setShouldSaveFavorites(false);
        }
    }, [user, favorites, saveFavorites, shouldSaveFavorites]);

    useEffect(() => {
        if (user) {
            fetchFavorites().then(_ => _);
        }
    }, [user, fetchFavorites]);

    const addFavorites = (movieId) => {
        setShouldSaveFavorites(true);
        setFavorites([...favorites, movieId]);
    }
    const deleteFavorites = (movieId) => {
        setShouldSaveFavorites(true);
        setFavorites(favorites.filter(id => id !== movieId));
    }

    useEffect(() => {
        let loginData = JSON.parse(localStorage.getItem("login"));
        if (loginData) {
            let loginExp = loginData.exp;
            let now = Date.now() / 1000;
            if (loginExp > now) {
                setUser(loginData);
            } else {
                localStorage.setItem("login", null);
            }
        }
    }, []);

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <div className="App">
                <Navbar bg="primary" expand="lg" sticky="top" variant="dark">
                    <Container className="container-fluid">
                        <Navbar.Brand href="/">
                            <img src="/images/movies-logo.png" alt="Movies Logo"
                                 className="moviesLogo"/>
                            MOVIE VAULT
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                        <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="ml-auto">
                                <Nav.Link as={Link} to="/movies">Movies</Nav.Link>
                            </Nav>
                            <Nav className="ml-auto">
                                {user && (
                                    <Nav.Link as={Link} to={`/favorites`}>
                                        Favorites
                                    </Nav.Link>
                                )}
                            </Nav>
                        </Navbar.Collapse>
                        {user ? (
                            <Logout setUser={setUser} clientId={clientId}/>
                        ) : (
                             <Login setUser={setUser}/>
                         )}
                    </Container>
                </Navbar>
                <Routes>
                    <Route path="/" element={
                        <MovieList
                            user={user}
                            addFavorites={addFavorites}
                            deleteFavorites={deleteFavorites}
                            favorites={favorites}
                        />}
                    />
                    <Route path="/movies" element={
                        <MovieList
                            user={user}
                            addFavorites={addFavorites}
                            deleteFavorites={deleteFavorites}
                            favorites={favorites}
                        />}
                    />
                    <Route path="/favorites" element={
                        <FavoriteList
                            user={user}
                            favorites={favorites}
                            setFavorites={setFavorites}
                        />}
                    />
                    <Route path="/movies/:id" element={
                        <Movie user={user}/>}
                    />
                    <Route path="/movies/:id/review" element={
                        <AddReview user={user}/>
                    }/>
                </Routes>
            </div>
        </GoogleOAuthProvider>
    );
}

export default App;