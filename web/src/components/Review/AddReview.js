import React, { useState, useEffect } from 'react';
import MoviesDataService from "../../services/movies";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";

const AddReview = ({ user }) => {
    const navigate = useNavigate();
    const params = useParams();
    const location = useLocation();

    const [review, setReview] = useState("");
    const [editing, setEditing] = useState(false);
    const [reviewId, setReviewId] = useState("");

    useEffect(() => {
        if (location.state && location.state.currentReview) {
            setEditing(true);
            setReview(location.state.currentReview.review);
            setReviewId(location.state.currentReview._id);
        }
    }, [location]);

    const onChangeReview = (e) => {
        setReview(e.target.value);
    };

    const saveReview = () => {
        const data = {
            review: review,
            name: user.name,
            user_id: user.googleId,
            movie_id: params.id,
        };

        if (editing) {
            data.review_id = reviewId;
            MoviesDataService.editReview(data)
                .then(response => {
                    navigate(`/movies/${params.id}`);
                })
                .catch(e => {
                    console.log(e);
                });
        } else {
            MoviesDataService.createReview(data)
                .then(response => {
                    navigate(`/movies/${params.id}`);
                })
                .catch(e => {
                    console.log(e);
                });
        }
    };

    return (
        <Container className="main-container">
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>{editing ? "Edit" : "Create"} Review</Form.Label>
                    <Form.Control
                        as="textarea"
                        type="text"
                        required
                        value={review}
                        onChange={onChangeReview}
                    />
                </Form.Group>
                <Button variant="primary" onClick={saveReview}>
                    Submit
                </Button>
            </Form>
        </Container>
    );
};

export default AddReview;