import supertest from 'supertest';
import {expect} from "chai";
import app from '../index.js'

const requestWithSupertest = supertest(app);

describe('Testing GET /movies endpoint', function () {
    it('responds with a valid HTTP status code and number of movies',
       async function () {
           const DEFAULT_MOVIES_PER_PAGE = 20;
           const response = await requestWithSupertest.get('/api/v1/movies');

           expect(response.status).to.equal(200);
           expect(response.body.movies.length).to.equal(DEFAULT_MOVIES_PER_PAGE);
       });
});

describe('Testing GET /movies endpoint with movie ID', function () {
    it('responds with a valid HTTP status code and returns a single movie',
       async function () {
           const testId = '573a1390f29313caabcd4135';
           const response = await requestWithSupertest.get('/api/v1/movies/id/' + testId);

           expect(response.status).to.equal(200);
           expect(response.body).to.be.an('object');
           expect(response.body._id).to.equal(testId);
       });
});

describe('Testing GET /movies endpoint with ratings', function () {
    it('responds with a valid HTTP status code and returns ratings',
       async function () {
           const response = await requestWithSupertest.get('/api/v1/movies/ratings');

           expect(response.status).to.equal(200);
           expect(response.body).to.be.an('array');
           expect(response.body.length).to.be.greaterThan(0);
       });
});

describe('Testing POST /reviews endpoint', function () {
    it('responds with a success status when posting a review',
       async function () {
           const response = await requestWithSupertest.post('/api/v1/movies/review')
               .send({
                         movie_id: '573a1390f29313caabcd4135',
                         review: 'Great movie!',
                         name: 'Test User',
                         user_id: '1234'
                     });

           expect(response.status).to.equal(200);
           expect(response.body.status).to.equal('success');
       });
});

describe('Testing PUT /reviews endpoint', function () {
    it('responds with a success status when updating a review',
       async function () {
           const response = await requestWithSupertest.post('/api/v1/movies/review')
               .send({
                         movie_id: '573a1390f29313caabcd4135',
                         review: 'Great movie!',
                         name: 'Test User',
                         user_id: '1234'
                     });

           const reviewId = response.body.response.insertedId;
           const updateResponse = await requestWithSupertest.put('/api/v1/movies/review')
               .send({
                         review_id: reviewId,
                         review: 'Updated review text',
                         name: 'Test User',
                         user_id: '1234'
                     });

           expect(updateResponse.status).to.equal(200);
           expect(updateResponse.body.status).to.equal('success');
       });
});

describe('Testing PUT /reviews endpoint invalid userID does not match', function () {
    it('responds with a failure status when updating a review with a user ID that does not match',
       async function () {
           const response = await requestWithSupertest.post('/api/v1/movies/review')
               .send({
                         movie_id: '573a1390f29313caabcd4135',
                         review: 'Great movie!',
                         name: 'Test User',
                         user_id: '1234'
                     });

           const reviewId = response.body.response.insertedId;
           const updateResponse = await requestWithSupertest.put('/api/v1/movies/review')
               .send({
                         review_id: reviewId,
                         review: 'Updated review text',
                         name: 'Test User',
                         user_id: 'not_matching_user_id'
                     });

           expect(updateResponse.status).to.equal(500);
           expect(updateResponse.body.error).to.include('Unable to update review');
       });
});

describe('Testing PUT /reviews endpoint invalid', function () {
    it('responds with a failure status when updating a review with invalid data',
       async function () {

           const updateResponse = await requestWithSupertest.put('/api/v1/movies/review')
               .send({
                         review_id: 'invalid_id',
                         review: 'Updated review text',
                         name: 'Test User',
                         user_id: '1234'
                     });

           expect(updateResponse.status).to.equal(500);
           expect(updateResponse.body.error).to.include('Unable to update review');
       });
});

describe('Testing DELETE /reviews endpoint', function () {
    it('responds with a success status when deleting a review',
       async function () {
           const response = await requestWithSupertest.post('/api/v1/movies/review')
               .send({
                         movie_id: '573a1390f29313caabcd5501',
                         review: 'Great movie!',
                         name: 'Test User',
                         user_id: '1234'
                     });

           const reviewId = response.body.response.insertedId;
           const deleteResponse = await requestWithSupertest.delete('/api/v1/movies/review')
               .send({
                         review_id: reviewId,
                         user_id: '1234'
                     });

           expect(deleteResponse.status).to.equal(200);
           expect(deleteResponse.body.status).to.equal('success');
       });
});

describe('Testing DELETE /reviews endpoint invalid', function () {
    it('responds with a failure status when deleting a review with invalid data',
       async function () {
           const deleteResponse = await requestWithSupertest.delete('/api/v1/movies/review')
               .send({
                         review_id: 'invalid_id',
                         user_id: '1234'
                     });

           expect(deleteResponse.status).to.equal(500);
           expect(deleteResponse.body.error).to.include('Unable to delete review');
       });
});