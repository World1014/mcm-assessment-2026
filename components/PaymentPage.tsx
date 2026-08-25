'use client';
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from '../styles/PaymentConfirmation.module.scss';
import { Movie as MovieType, PaymentSearchParams, ShowTime as showtimeType } from "@/typescript/movieData";
import { createPurchaseEvent, getSearchParamValue, pushAnalyticsEventOnce } from "@/lib/analytics";

export default function PaymentPage({movie, showtime, stackParams} : {movie: MovieType, showtime: showtimeType, stackParams: PaymentSearchParams }) {
    const router = useRouter();
    const orderId = getSearchParamValue(stackParams.orderId);
    const adultQuantity = Number(getSearchParamValue(stackParams.adult));
    const childrenQuantity = Number(getSearchParamValue(stackParams.children));
    const totalValue = Number(getSearchParamValue(stackParams.totalAmt));
    const theaterName = getSearchParamValue(stackParams.theaterName);
    const transactionId = orderId || `${movie.id}-${showtime.id}-${adultQuantity}-${childrenQuantity}`;

    const handleSelect = () => {
        router.push('/');
    }

    useEffect(() => {
        pushAnalyticsEventOnce(createPurchaseEvent({
            transactionId,
            movieTitle: movie.title,
            showtime: showtime.showtime,
            theaterName,
            adultPrice: Number(showtime.adult_price),
            adultQuantity,
            childrenPrice: Number(showtime.children_price),
            childrenQuantity,
            totalValue,
        }), `cinema-purchase-${transactionId}`);
    }, [movie.id, movie.title, showtime.id, showtime.showtime, showtime.adult_price, showtime.children_price, theaterName, transactionId, adultQuantity, childrenQuantity, totalValue]);

    return(<div className={styles.paymentPageContainer}>
        <div className={styles.check}>✓</div>
        <div>
           <div className={styles.title}>Purchase complete</div>
            <div className={styles.subTitle}>Your tickets are confirmed. Show this screen at the door.</div> 
        </div>
        
        <div className={styles.receipt}>
            <div className={styles.infoSection}>
                <div>Film</div>
                <div>{movie?.title}</div>
            </div>
            <div className={styles.infoSection}>
                <div>Showtime</div>
                <div>{showtime?.showtime}</div>
            </div>
            <div className={styles.infoSection}>
                <div>Tickets</div>
                <div>
                    <span>{stackParams.adult} adult • </span>
                    <span>{stackParams.children} child</span>
                </div>
            </div>
            <div className={styles.infoSection}>
                <div>Paid</div>
                <div>${stackParams.totalAmt}.00</div>
            </div>
        </div>

        <button className={styles.button} onClick={handleSelect}>Return to main page</button>
        </div>
    )
}

