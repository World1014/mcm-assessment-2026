export type ShowTime = {
    id: number,
    showtime: string,
    adult_available: number,
    children_available: number,
    adult_price: number,
    children_price: number
};

export type Movie = {
    id: number,
    title: string,
    showtimesCollection?: any,
    showtimes: ShowTime[]
};

export type Theater = {
    id: number,
    name: string,
    moviesCollection?: any,
    movies: Movie[]
};