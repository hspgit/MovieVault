import update from 'immutability-helper'
import {useCallback} from 'react'
import {MovieDnDCard} from './MovieDnDCard'

const style = {width: 400}

const MovieDndContainer = ({movies, setMovies, onDropComplete}) => {
    const moveCard = useCallback((from, to) => {
        setMovies(prev =>
                      update(prev, {
                          $splice: [
                              [from, 1],
                              [to, 0, prev[from]],
                          ],
                      })
        )
    }, [setMovies])

    return (
        <div style={style}>
            {movies.map((movie, idx) => (
                <MovieDnDCard
                    key={movie._id}
                    index={idx}
                    id={movie._id}
                    movieDetails={movie}
                    moveCard={moveCard}
                    onDropComplete={onDropComplete}
                    movies={movies}
                />
            ))}
        </div>
    )
}

export default MovieDndContainer