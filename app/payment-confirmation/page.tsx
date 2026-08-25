import { fetchGraphQL } from "@/lib/graphql";
import PaymentPage from "@/components/PaymentPage";
import { Movie, PaymentSearchParams, SelectedShowtimeQueryData, ShowTime } from "@/typescript/movieData";

export default async function PaymentConfirmation({searchParams}: {searchParams: Promise<PaymentSearchParams>}) {
    const stackParams = await searchParams;
    const movieId = Number(stackParams.movieId);
    const showtimeId = Number(stackParams.showtimeId);

    const query = `
    query GetSelectedShowtime($movieId: BigInt!, $showtimeId: BigInt!) {
      moviesCollection(filter: { id: { eq: $movieId } }) {
        edges {
          node {
            id
            title
            showtimesCollection(filter: { id: { eq: $showtimeId } }) {
              edges {
                node {
                  id
                  showtime
                  adult_available
                  children_available
                  adult_price
                  children_price
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL<SelectedShowtimeQueryData>(query, {movieId, showtimeId});
  const selectedMovie = data.moviesCollection.edges[0]?.node;
  if (!selectedMovie) {
    throw new Error("Selected movie was not found");
  }
  const selectedShowtime = selectedMovie.showtimesCollection.edges[0]?.node;
  if (!selectedShowtime) {
    throw new Error("Selected showtime was not found");
  }
  const movie: Movie = {
    id: Number(selectedMovie.id),
    title: selectedMovie.title,
    showtimes: [{
      ...selectedShowtime,
      id: Number(selectedShowtime.id),
    }],
  };
  const showtime: ShowTime = {
    ...selectedShowtime,
    id: Number(selectedShowtime.id),
  };


    return (<span>
        <PaymentPage movie={movie} showtime={showtime} stackParams={stackParams}  />
    </span>)
}