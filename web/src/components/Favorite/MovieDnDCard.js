import {useRef} from 'react'
import {useDrag, useDrop} from 'react-dnd'
import {ItemTypes} from './ItemTypes'
import './MovieDnDCard.css'

export const MovieDnDCard = ({id, movieDetails, index, moveCard, onDropComplete, movies}) => {
    const ref = useRef(null)

    const [
        {handlerId},
        drop
    ] = useDrop({
                    accept: ItemTypes.MOVIE_CARD,
                    collect(monitor) {
                        return {handlerId: monitor.getHandlerId()}
                    },
                    hover(item, monitor) {
                        if (!ref.current) {
                            return
                        }
                        const dragIndex = item.index
                        const hoverIndex = index
                        if (dragIndex === hoverIndex) {
                            return
                        }

                        const hoverRect = ref.current.getBoundingClientRect()
                        const hoverMiddleY = (hoverRect.bottom - hoverRect.top) / 2
                        const clientOffset = monitor.getClientOffset()
                        const hoverClientY = clientOffset.y - hoverRect.top

                        if (dragIndex < hoverIndex && hoverClientY
                            < hoverMiddleY) {
                            return
                        }
                        if (dragIndex > hoverIndex && hoverClientY
                            > hoverMiddleY) {
                            return
                        }

                        moveCard(dragIndex, hoverIndex)
                        item.index = hoverIndex
                    },
                })

    const [
        {isDragging},
        drag
    ] = useDrag({
                    type: ItemTypes.MOVIE_CARD,
                    item: () => ({id, index}),
                    collect: monitor => ({
                        isDragging: monitor.isDragging()
                    }),
                    end: (item, monitor) => {
                        if (!monitor.didDrop()) {
                            return
                        }
                        if (onDropComplete) {
                            onDropComplete(movies);
                        }
                    },
                })

    drag(drop(ref))

    const handleImageError = (e) => {
        e.target.src = '/images/alt-img.png'
    }

    return (
        <div
            ref={ref}
            className="dndCard-draggable"
            style={{
                opacity: isDragging ? 0.2 : 1,
                transform: isDragging ? 'scale(1.25)' : 'scale(1)',
                transition: 'transform 0.15s cubic-bezier(0.4,0,0.2,1)'
            }}
            data-handler-id={handlerId}
        >
            <p className="movie-index">{index+1}</p>
            <div className="dndCard">
                <img
                    className="dndPoster"
                    src={movieDetails.poster + "100px/180"}
                    onError={handleImageError}
                    alt="Movie poster"
                />
                <div className="dndTitle">{movieDetails.title}</div>
            </div>

        </div>
    )
}