import { fetchGraphQL } from "@/lib/graphql";
import PaymentPage from "@/components/PaymentPage";

export default async function PaymentConfirmation({searchParams}: {searchParams: any}) {
    const stackParams = await searchParams;
    const movieId = Number(stackParams.movieId);
    const showtimeId = Number(stackParams.showtimeId);

    //TODO (task 1): Expand this query to fetch the full movie + showtime data.
    //You will need to filter by each movieId and showtimeId, then delete the
    //placeholder showtime object below.
    const query = `
    query GetSelectedShowtime($movieId: BigInt!) {
      moviesCollection(filter: { id: { eq: $movieId } }) {
        edges {
          node {
            id
            title
          }
        }
      }
    }
  `;

  const data = await fetchGraphQL(query, {movieId, showtimeId});
  const movie =  data.moviesCollection.edges.map((edge:any) => ({
    ...edge.node,
  }))[0];

  // Temporary placeholder
  // Replace this with the real 'showtime' variable from your GraphQL query
  const showtime = {
      id: 0,
      showtime: "N/A",
      adult_available: 0,
      children_available: 0,
      adult_price: 0,
      children_price: 0
  };


    return (<span>
        <PaymentPage movie={movie} showtime={showtime} stackParams={stackParams}  />
    </span>)
}