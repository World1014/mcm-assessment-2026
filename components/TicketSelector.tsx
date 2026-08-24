'use client';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShowTime, Movie } from "@/typescript/movieData";
import styles from '../styles/TicketSelector.module.scss';

export default function TicketSelector({showtime, movie, theaterId}: {showtime: ShowTime, movie: Movie, theaterId: number}) {
    const router = useRouter();

    // Local UI state for dropdowns and ticket totals
    const [adultCount, setAdultCount] = useState(0);
    const [adultIsOpen, setAdultIsOpen] = useState(false);
    const [adultTotalAmt, setAdultTotalAmt] = useState(0);
    const [childrenCount, setChildrenCount] = useState(0);
    const [childrenIsOpen, setChildrenIsOpen] = useState(false);
    const [childrenTotalAmt, setChildrenTotalAmt] = useState(0);
    const [total, setTotal] = useState(0);

    // Navigate forward to payment page or back to home
    const handleSelect = (route:string) => {
        if (route === 'continue') {
            router.push(
                `/payment-information?theaterId=${theaterId}&movieId=${movie.id}&showtimeId=${showtime.id}&adult=${adultCount}&children=${childrenCount}&totalAmt=${total}`
              );
        } else {
            router.push(`/`);
        }
       
    }

    // Handle selecting adult ticket quantity
    const handleAdultOptionClick = (option:number) => {
        setAdultCount(option);
        setAdultIsOpen(false);
        totalAmtForEach(option, 'adult')
    };

    // Handle selecting children ticket quantity
    const handleChildrenOptionClick = (option:number) => {
        setChildrenCount(option);
        setChildrenIsOpen(false);
        totalAmtForEach(option, 'children');
    };

    // Calculate totals for each ticket type and overall
    const totalAmtForEach = (amt:number, adultOrChildren:string) => {
        if (adultOrChildren === 'adult') {
            const newAdultTotal = amt * Number(showtime.adult_price);
            setAdultTotalAmt(newAdultTotal);
            setTotal(newAdultTotal + childrenTotalAmt);
        } else {
            const newChildrenTotal = amt * Number(showtime.children_price);
            setChildrenTotalAmt(newChildrenTotal);
            setTotal(adultTotalAmt + newChildrenTotal);
        }
    };


    return (
        <div className={styles.ticketSelectorContainer}>
            <div className={styles.header}>
                <div className={styles.title}>Choose tickets</div>
                <div className={styles.headerSub}>
                    <span>{movie?.title} · </span>
                    <span>{showtime?.showtime}</span>
                </div> 
            </div>
           
            <hr className={styles.hr}></hr>
            <div className={styles.body}>
                {/*
                  TODO (task 4): cap these options and replace a sold-out dropdown from a
                  GTM tag, not from this component.

                  Both dropdowns below intentionally render a fixed 0-20 range and are
                  always interactive, even when zero seats are available. Capping the
                  options and replacing a sold-out dropdown is task 4, and must be done
                  post-render from a GTM tag rather than here. Availability is published
                  on the data-available attributes and as visible text.
                */}
                <div
                  className={styles.adult}
                  data-testid="ticket-type-adult"
                  data-available={showtime.adult_available}
                >
                    <div className={styles.description}>
                        <div className={styles.name}>Adult</div>
                        <div className={styles.price}>${showtime.adult_price} each</div>
                        <div className={styles.available} data-testid="adult-available">
                            {showtime.adult_available} available
                        </div>
                    </div>
                    <button
                    className={styles.dropdownButton}
                    data-testid="adult-dropdown-button"
                    onClick={() => setAdultIsOpen(!adultIsOpen)}
                    >
                        {adultCount}
                        <span className={`${styles.arrow} ${adultIsOpen ? styles.open  : ''}`}>▼</span>
                    </button>
                    {adultIsOpen && (
                        <ul className={styles.dropdown} data-testid="adult-dropdown-list">
                        {[...Array(21)].map((_, index) => (
                                <li 
                                key={index} 
                                className={styles.dropdownList}
                                onClick={() => handleAdultOptionClick(index)}>
                                    {index}
                                </li>
                            ))} 
                        </ul>
                    )}
                </div>

                {adultCount > Number(showtime.adult_available) && <div className={styles.error}>Not enough tickets</div>}

                <div
                  className={styles.children}
                  data-testid="ticket-type-children"
                  data-available={showtime.children_available}
                >
                <div className={styles.description}>
                        <div className={styles.name}>Children</div>
                        <div className={styles.price}>${showtime.children_price} each</div>
                        <div className={styles.available} data-testid="children-available">
                            {showtime.children_available} available
                        </div>
                    </div>
                    <button
                    className={styles.dropdownButton}
                    data-testid="children-dropdown-button"
                    onClick={() => setChildrenIsOpen(!childrenIsOpen)}
                    >
                        {childrenCount}
                        <span className={`${styles.arrow} ${childrenIsOpen ? styles.open : ''}`}>▼</span>
                    </button>
                    {childrenIsOpen && (
                        <ul className={styles.dropdown} data-testid="children-dropdown-list">
                        {[...Array(21)].map((_, index) => (
                                <li 
                                key={index} 
                                className={styles.dropdownList}
                                onClick={() => handleChildrenOptionClick(index)}>
                                    {index}
                                </li>
                            ))} 
                        </ul>
                    )}
                </div>
                {childrenCount > Number(showtime.children_available) && <div className={styles.error}>Not enough tickets</div>}

                <hr className={styles.hr}></hr>
                <div className={styles.total}>
                    <div>{adultCount} x Adult</div>
                    <div>${adultTotalAmt}.00</div>
                </div>
                <div className={styles.total}>
                    <div>{childrenCount} x Child</div>
                    <div>${childrenTotalAmt}.00</div>
                </div>
                <div className={styles.totalForAll}>
                    <div>Total</div>
                    <div>${total}.00</div>
                </div>

                <div className={styles.buttons}>
                    <button 
                      onClick={() => handleSelect('continue')}
                      className={`${styles.continueButton} ${(childrenCount > Number(showtime.children_available) || adultCount > Number(showtime.adult_available) || (adultCount == 0 && childrenCount == 0) ? styles.disable : '' )} `}>
                        Continue
                    </button>
                    
                    <button
                      onClick={() => handleSelect('back')} 
                      className={styles.backButton}>
                        Back
                    </button>
                </div>
            </div>

        </div>
    )
};