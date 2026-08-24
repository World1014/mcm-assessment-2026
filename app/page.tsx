import { fetchGraphQL } from "@/lib/graphql";
import { Theater } from "@/typescript/movieData";
import Showtimes from "@/components/Showtimes";

//TODO (task 1): Expand this query to fetch the full theater, movie, and showtime
//data, then replace the mapping below so movies and showtimes are actually populated.
const GET_THEATER_DATA = `
  query {
    theatersCollection {
      edges {
        node {
          id
          name
        }
      }
    }
  }
`;



export default async function Home() {

  const data = await fetchGraphQL(GET_THEATER_DATA);

  // Transform the top-level collection into a Theater[] shape
  // NOTE: this only includes basic theater info - you will need to expand the query and
  // build out the full nested structure (movie -> showtimes) for the final implementation
  const theaters: Theater[] = data.theatersCollection.edges.map((edge:any) => ({
      ...edge.node,
      movies: []
  }));

  
  return (
    <div className="w-full">
      <main>
        <Showtimes props={theaters} /> 
      </main>
    </div>
  );
}
