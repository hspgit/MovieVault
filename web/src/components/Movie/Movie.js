import React, {useState, useEffect} from 'react';
import MoviesDataService from '../../services/movies';
import {Link, useParams} from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from "react-bootstrap/Button";
import moment from "moment";

import './Movie.css';

const Movie = ({user}) => {

    let params = useParams();

    const [movie, setMovie] = useState({
                                           id: null,
                                           title: "",
                                           rated: "",
                                           reviews: [],
                                       });

    useEffect(() => {
        const getMovie = (id) => {
            MoviesDataService.getSingle(id)
                .then(response => {
                    setMovie(response.data);
                })
                .catch(e => {
                    console.log(e);
                });
        };
        getMovie(params.id);
    }, [params.id]);

    const handleImageError = (e) => {
        e.target.src = '/images/alt-img.png';
    };

    const deleteReview = (reviewId, deleteIndex) => {
        MoviesDataService.deleteReview(reviewId, user.googleId)
            .then(response => {
                setMovie(prevState => {
                    const updatedReviews = [...prevState.reviews];
                    updatedReviews.splice(deleteIndex, 1);
                    return {
                        ...prevState,
                        reviews: updatedReviews
                    };
                });
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
        <div>
            <Container>
                <Row>
                    <Col>
                        <div className="poster">
                            <Image
                                className="bigPicture"
                                src={movie.poster + "100px250.jpg"}
                                onError={handleImageError}
                                alt="Movie image"
                                fluid/>
                        </div>
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header as="h5">{movie.title}</Card.Header>
                            <Card.Body>
                                <Card.Text>
                                    {movie.plot}
                                </Card.Text>
                                {user &&
                                 <Link to={"/movies/" + params.id + "/review"}>
                                     Add Review
                                 </Link>}
                            </Card.Body>
                        </Card>
                        <h2>Reviews</h2>
                        <br></br>
                        {movie.reviews.map((review, index) => {
                            return (
                                <div className="d-flex" key={index}>
                                    <div className="flex-shrink-0 reviewsText">
                                        <h5>{review.name + " reviewed on "} {moment(review.date)
                                            .format("Do MMMM YYYY")}</h5>
                                        <p className="review">{review.review}</p>
                                        {user && user.googleId === review.user_id &&
                                         <Row>
                                             <Col>
                                                 <Link to={{
                                                     pathname: "/movies/" + params.id + "/review"
                                                 }}
                                                       state={{
                                                           currentReview: review,
                                                       }}>
                                                     Edit
                                                 </Link>
                                             </Col>
                                             <Col>
                                                 <Button variant="link" onClick={() => {
                                                        deleteReview(review._id, index);
                                                 }}>
                                                     Delete
                                                 </Button>
                                             </Col>
                                         </Row>}
                                    </div>
                                </div>
                            )
                        })}
                    </Col>
                </Row>
            </Container>
        </div>
    )

}

export default Movie;