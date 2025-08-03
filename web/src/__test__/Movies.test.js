import {render, waitFor, screen} from '@testing-library/react';
import {MemoryRouter, Route, Routes} from 'react-router-dom';

import mockServer from "../__mocks__/mockServer";
import Movie from '../components/Movie/Movie';

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

test('should request correct url', async () => {
    const MOVIE_ID = "573a1390f29313caabcd4135";
    const MOVIE_TITLE = "Mock Movie Title";

    render(
        <MemoryRouter initialEntries={[`/movies/${MOVIE_ID}`]}>
            <Routes>
                <Route path="/movies/:id" element={
                    <Movie/>}/>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => screen.getByText(MOVIE_TITLE));
    const titleElement = screen.getByText(MOVIE_TITLE);
    expect(titleElement).toBeInTheDocument();
});

test('should show correct number of reviews', async () => {
    const MOVIE_ID = "573a1390f29313caabcd4135";
    const REVIEW_COUNT = 2;

    render(
        <MemoryRouter initialEntries={[`/movies/${MOVIE_ID}`]}>
            <Routes>
                <Route path="/movies/:id" element={
                    <Movie/>}/>
            </Routes>
        </MemoryRouter>
    );

    await waitFor(() => screen.getAllByText(/Test User/i));
    const reviewElements = screen.getAllByText(/Test User/i);
    expect(reviewElements.length).toBe(REVIEW_COUNT);
})