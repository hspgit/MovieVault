import { render, screen} from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import mockServer from '../__mocks__/mockServer';

beforeAll(() => mockServer.listen());
afterEach(() => mockServer.resetHandlers());
afterAll(() => mockServer.close());

import App from '../App';
import {act} from "react-dom/test-utils";

test('renders top-level application text', () => {
    const APP_TEXT = 'MOVIE TIME';
    // act(() => {
    //     render(
    //         <MemoryRouter>
    //             <App />
    //         </MemoryRouter>
    //     );
    // });
    render(
        <MemoryRouter>
            <App />
        </MemoryRouter>
    );
    const textElement = screen.getByText(APP_TEXT);
    expect(textElement).toBeInTheDocument();
    // expect(1).toBe(1); // Dummy assertion to avoid empty test
});