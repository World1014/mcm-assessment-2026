export type ShowTime = {
    id: number;
    showtime: string;
    adult_available: number;
    children_available: number;
    adult_price: number;
    children_price: number;
};

export type Movie = {
    id: number;
    title: string;
    showtimes: ShowTime[];
};

export type Theater = {
    id: number;
    name: string;
    movies: Movie[];
};

export type GraphQLEdge<T> = {
    node: T;
};

export type GraphQLCollection<T> = {
    edges: GraphQLEdge<T>[];
};

export type GraphQLShowtime = Omit<ShowTime, "id"> & {
    id: string | number;
};

export type GraphQLMovie = {
    id: string | number;
    title: string;
    showtimesCollection: GraphQLCollection<GraphQLShowtime>;
};

export type GraphQLTheater = {
    id: string | number;
    name: string;
    moviesCollection: GraphQLCollection<GraphQLMovie>;
};

export type TheaterQueryData = {
    theatersCollection: GraphQLCollection<GraphQLTheater>;
};

export type SelectedShowtimeQueryData = {
    moviesCollection: GraphQLCollection<GraphQLMovie>;
};

export type SearchParamValue = string | string[] | undefined;

export interface BookingSearchParams {
    theaterId?: SearchParamValue;
    movieId?: SearchParamValue;
    showtimeId?: SearchParamValue;
}

export type TicketSelectionSearchParams = BookingSearchParams;

export interface PaymentSearchParams extends BookingSearchParams {
    adult?: SearchParamValue;
    children?: SearchParamValue;
    totalAmt?: SearchParamValue;
    orderId?: SearchParamValue;
}