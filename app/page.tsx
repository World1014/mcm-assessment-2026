import { fetchGraphQL } from "@/lib/graphql";
import { Theater, TheaterQueryData } from "@/typescript/movieData";
import Showtimes from "@/components/Showtimes";

const GET_THEATER_DATA = `
  query {
    theatersCollection {
      edges {
        node {
          id
          name
          moviesCollection {
            edges {
              node {
                id
                title
                showtimesCollection {
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
      }
    }
  }
`;



export default async function Home() {

  const data = await fetchGraphQL<TheaterQueryData>(GET_THEATER_DATA);
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date());

  const theaters: Theater[] = data.theatersCollection.edges.map(({ node: theater }) => ({
    id: Number(theater.id),
    name: theater.name,
    movies: theater.moviesCollection.edges.map(({ node: movie }) => ({
      id: Number(movie.id),
      title: movie.title,
      showtimes: movie.showtimesCollection.edges.map(({ node: showtime }) => ({
        ...showtime,
        id: Number(showtime.id),
      })),
    })),
  }));

  
  return (
    <div className="w-full">
      <main>
        <Showtimes props={theaters} formattedDate={formattedDate} />
      </main>
    </div>
  );
}
