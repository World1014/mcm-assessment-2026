'use client';
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Theater } from "@/typescript/movieData";
import { AnalyticsEvent, getShowtimeItems, pushAnalyticsEvent } from "@/lib/analytics";
import styles from '../styles/Showtimes.module.scss';


export default function Showtimes({props}: {props: Theater[]}) {
    const router = useRouter();
    const hasTrackedShowtimeList = useRef(false);
    const date = new Date();

    // Format today's date for the "Now showing" header
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
    }).format(date);

    // Navigate to the ticket page using selected theater/movie/showtime
    const handleSelect = (theaterId:number, movieId:number, showtimeId:number) => {
            const theater = props.find((item) => item.id === theaterId);
            const movie = theater?.movies.find((item) => item.id === movieId);
            const showtime = movie?.showtimes.find((item) => item.id === showtimeId);

            if (!theater || !movie || !showtime) {
                return;
            }

            pushAnalyticsEvent({
                event: AnalyticsEvent.SelectItem,
                ecommerce: {
                    item_list_name: 'Showtimes',
                    items: [{
                        item_id: String(showtime.id),
                        item_name: movie.title,
                        item_variant: showtime.showtime,
                        item_category: theater.name,
                        price: Number(showtime.adult_price),
                        quantity: 1,
                    }],
                },
            });

            router.push(`/tickets?theaterId=${theaterId}&theaterName=${encodeURIComponent(theater.name)}&movieId=${movieId}&showtimeId=${showtimeId}`);
    };

        useEffect(() => {
            if (hasTrackedShowtimeList.current) {
                return;
            }

            hasTrackedShowtimeList.current = true;
            pushAnalyticsEvent({
                event: AnalyticsEvent.ViewItemList,
                ecommerce: {
                    item_list_name: 'Showtimes',
                    items: getShowtimeItems(props),
                },
            });
        }, [props]);


    return (<div className={styles.showtimesContainer}>
        {props.map((theater, index) => (
            <div className={styles.theater} key={index} data-testid="theater">
                <div className={styles.header}>
                  <div className={styles.name} data-testid="theater-name">{theater.name}</div>
                  <div className={styles.date}>Now showing - {formattedDate}</div>
                </div>

                {theater.movies?.map((movie, movieIndex) => (
                    <div key={movieIndex} className={styles.body} data-testid="movie">
                        <div className={styles.movieTitle} data-testid="movie-title">{movie.title}</div>
                        <div className={styles.stack}>
                            <div className={styles.selectTime}>Select a showtime</div>
                            {/*
                              TODO (task 4): reflect sold-out state on this button from a GTM
                              tag, not from this component.

                              Availability is exposed both as visible text and as data-*
                              attributes so it can be read after render. Note that the Buy
                              button below is always enabled and always reads "Buy" --
                              reflecting sold-out state is task 4, and belongs in a GTM tag,
                              not in this component.
                            */}
                            {movie.showtimes.map((showtime, showtimeIndex) => (
                                <div
                                  className={styles.showtime}
                                  key={showtimeIndex}
                                  data-testid="showtime-row"
                                  data-showtime-id={showtime.id}
                                  data-adult-available={showtime.adult_available}
                                  data-children-available={showtime.children_available}
                                >
                                    <div>
                                        <span className={styles.showtimeTime}>{showtime.showtime}</span>
                                        <span className={styles.notes}>Standard seating</span>
                                        <span className={styles.availability} data-testid="showtime-availability">
                                            Adult ${showtime.adult_price} ({showtime.adult_available} left)
                                            {' \u00b7 '}
                                            Child ${showtime.children_price} ({showtime.children_available} left)
                                        </span>
                                    </div>
                                    {/* TODO (task 2): fire a GA4 dataLayer push from this CTA with at
                                        least two parameters, and console.log the exact payload. */}
                                    <button
                                      type="button"
                                      className={`${styles.button}`}
                                      data-testid="showtime-cta"
                                      aria-label={`Buy tickets for ${movie.title} at ${showtime.showtime}`}
                                      onClick={() => handleSelect(theater.id, movie.id, showtime.id)}
                                    >
                                        Buy
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        ))}

    </div>)
}
