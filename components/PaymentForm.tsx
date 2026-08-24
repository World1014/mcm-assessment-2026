'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from '../styles/PaymentForm.module.scss';

export default function PaymentForm(props:any) {
    const router = useRouter();

    // Values passed from the ticket selection page
    // These determine what the user is paying for
    const { theaterId, movieId, showtimeId, adult, children, totalAmt } = props.props;

    // Basic totals for display only
    let total = Number(adult) + Number(children);
    let totalAmount = Number(totalAmt);

     // Handle form submission and navigate to confirmation page
    const handleSubmit = (e:any) => {
        e.preventDefault();
    
        const formData = new FormData(e.currentTarget);
    
        const firstName = formData.get("firstName");
        const lastName = formData.get("lastName");
        const cardNumber = formData.get("cardNumber");
    
        const orderId = Math.floor(Math.random() * 1000000);
    
        router.push(
          `/payment-confirmation?orderId=${orderId}&theaterId=${theaterId}&movieId=${movieId}&showtimeId=${showtimeId}&adult=${adult}&children=${children}&totalAmt=${totalAmt}`
        );
      };

    const handleSelect = () => {
        router.push(
          `/tickets?theaterId=${theaterId}&movieId=${movieId}&showtimeId=${showtimeId}`
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
                <label>First Name</label>
                <input name="firstName" required placeholder="John" />
            </div>

            <div className={styles.field}>
                <label>Last Name</label>
                <input name="lastName" required placeholder="Doe" />
            </div>

            <div className={styles.field}>
                <label>Card Number</label>
                <input name="cardNumber" required placeholder="1234 5678 9012 3456" />
            </div>
            <div className={styles.note}>Any values are accepted — no real payment is processed.</div>

            <div className={styles.action}>
                <button type="submit" className={styles.submit}> Complete </button>
                <button onClick={() => handleSelect()} className={styles.backButton}>Back</button>  
            </div>
            
        </form>

        
    </div>)
}