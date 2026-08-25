'use client';
import { useRouter } from "next/navigation";
import type { SubmitEvent } from "react";
import { PaymentSearchParams } from "@/typescript/movieData";
import { AnalyticsEvent, getSearchParamValue, pushAnalyticsEvent } from "@/lib/analytics";
import styles from '../styles/PaymentForm.module.scss';

type PaymentFormProps = {
    props: PaymentSearchParams;
};

export default function PaymentForm({ props }: PaymentFormProps) {
    const router = useRouter();

    // Values passed from the ticket selection page
    // These determine what the user is paying for
    const { theaterId, movieId, showtimeId, adult, children, totalAmt } = props;

    // Basic totals for display only
    const total = Number(adult) + Number(children);
    const totalAmount = Number(totalAmt);

     // Handle form submission and navigate to confirmation page
    const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();

        const orderId = Math.floor(Math.random() * 1000000);
        const totalValue = Number(getSearchParamValue(totalAmt));

        pushAnalyticsEvent({
            event: AnalyticsEvent.AddPaymentInfo,
            ecommerce: {
                currency: 'USD',
                value: totalValue,
            },
        });
    
        router.push(
          `/payment-confirmation?orderId=${orderId}&theaterId=${theaterId}&theaterName=${encodeURIComponent(getSearchParamValue(props.theaterName))}&movieId=${movieId}&showtimeId=${showtimeId}&adult=${adult}&children=${children}&totalAmt=${totalAmt}`
        );
      };

    const handleSelect = () => {
        router.push(
          `/tickets?theaterId=${theaterId}&theaterName=${encodeURIComponent(getSearchParamValue(props.theaterName))}&movieId=${movieId}&showtimeId=${showtimeId}`
        );
      };
      


    return (<div className={styles.paymentFormContainer}>
        <div className={styles.header}>
            <div className={styles.title}>Payment Information</div>
            <div className={styles.subHeader}>
                <span>{total} tickets · </span> 
                <span>${totalAmount}.00 total</span>
            </div>
        </div>
        <hr className={styles.hr}></hr>
        <form onSubmit={handleSubmit} className={styles.form}>

            <div className={styles.field}>
                <label htmlFor="first-name">First Name</label>
                <input id="first-name" name="firstName" autoComplete="given-name" required placeholder="John" />
            </div>

            <div className={styles.field}>
                <label htmlFor="last-name">Last Name</label>
                <input id="last-name" name="lastName" autoComplete="family-name" required placeholder="Doe" />
            </div>

            <div className={styles.field}>
                <label htmlFor="card-number">Card Number</label>
                <input id="card-number" name="cardNumber" type="text" inputMode="numeric" autoComplete="cc-number" required placeholder="1234 5678 9012 3456" />
            </div>
            <div className={styles.note}>Any values are accepted — no real payment is processed.</div>

            <div className={styles.action}>
                <button type="submit" className={styles.submit}> Complete </button>
                <button type="button" onClick={handleSelect} className={styles.backButton}>Back</button>
            </div>
            
        </form>

        
    </div>)
}