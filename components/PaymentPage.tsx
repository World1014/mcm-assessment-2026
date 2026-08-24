'use client';
import { useRouter } from "next/navigation";
import styles from '../styles/PaymentConfirmation.module.scss';
import { Movie as MovieType, ShowTime as showtimeType } from "@/typescript/movieData";

export default function PaymentPage({movie, showtime, stackParams} : {movie: MovieType, showtime: showtimeType, stackParams: any }) {
    const router = useRouter();

    const handleSelect = () => {
        router.push('/');
    }

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

