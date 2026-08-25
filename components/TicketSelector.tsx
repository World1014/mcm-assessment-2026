'use client';
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { ShowTime, Movie } from "@/typescript/movieData";
import { AnalyticsEvent, getTicketItems, pushAnalyticsEvent } from "@/lib/analytics";
import styles from '../styles/TicketSelector.module.scss';

type CheckoutRoute = 'continue' | 'back';

enum TicketType {
    Adult = 'adult',
    Children = 'children',
}

type TicketTypeValue = `${TicketType}`;

export default function TicketSelector({showtime, movie, theaterId, theaterName}: {showtime: ShowTime, movie: Movie, theaterId: number, theaterName: string}) {
    const router = useRouter();

    // Local UI state for dropdowns and ticket totals
    const [adultCount, setAdultCount] = useState(0);
    const [adultIsOpen, setAdultIsOpen] = useState(false);
    const [adultTotalAmt, setAdultTotalAmt] = useState(0);
    const [childrenCount, setChildrenCount] = useState(0);
    const [childrenIsOpen, setChildrenIsOpen] = useState(false);
    const [childrenTotalAmt, setChildrenTotalAmt] = useState(0);
    const [total, setTotal] = useState(0);
    const hasStartedCheckout = useRef(false);

    // Navigate forward to payment page or back to home
    const handleSelect = (route: CheckoutRoute) => {
        if (route === 'continue') {
            if (hasExceededAvailability || (adultCount === 0 && childrenCount === 0) || hasStartedCheckout.current) {
                return;
            }

            hasStartedCheckout.current = true;

            pushAnalyticsEvent({
                event: AnalyticsEvent.BeginCheckout,
                ecommerce: {
                    currency: 'USD',
                    value: total,
                    items: getTicketItems({
                        movieTitle: movie.title,
                        showtime: showtime.showtime,
                        theaterName,
                        adultPrice: Number(showtime.adult_price),
                        adultQuantity: adultCount,
                        childrenPrice: Number(showtime.children_price),
                        childrenQuantity: childrenCount,
                    }),
                },
            });
            router.push(
                `/payment-information?theaterId=${theaterId}&theaterName=${encodeURIComponent(theaterName)}&movieId=${movie.id}&showtimeId=${showtime.id}&adult=${adultCount}&children=${childrenCount}&totalAmt=${total}`
              );
        } else {
            router.push(`/`);
        }
       
    }

    // Handle selecting adult ticket quantity
    const handleAdultOptionClick = (option:number) => {
        pushAnalyticsEvent({ event: AnalyticsEvent.TicketQuantitySelected, ticket_type: TicketType.Adult, quantity: option });
        setAdultCount(option);
        setAdultIsOpen(false);
        totalAmtForEach(option, TicketType.Adult)
    };

    // Handle selecting children ticket quantity
    const handleChildrenOptionClick = (option:number) => {
        pushAnalyticsEvent({ event: AnalyticsEvent.TicketQuantitySelected, ticket_type: TicketType.Children, quantity: option });
        setChildrenCount(option);
        setChildrenIsOpen(false);
        totalAmtForEach(option, TicketType.Children);
    };

    // Calculate totals for each ticket type and overall
    const totalAmtForEach = (amt:number, adultOrChildren: TicketTypeValue) => {
        if (adultOrChildren === TicketType.Adult) {
            const newAdultTotal = amt * Number(showtime.adult_price);
            setAdultTotalAmt(newAdultTotal);
            setTotal(newAdultTotal + childrenTotalAmt);
        } else {
            const newChildrenTotal = amt * Number(showtime.children_price);
            setChildrenTotalAmt(newChildrenTotal);
            setTotal(adultTotalAmt + newChildrenTotal);
        }
    };

    const optionHandlers: Record<TicketTypeValue, (option: number) => void> = {
        [TicketType.Adult]: handleAdultOptionClick,
        [TicketType.Children]: handleChildrenOptionClick,
    };

    const adultExceeded = adultCount > Number(showtime.adult_available);
    const childrenExceeded = childrenCount > Number(showtime.children_available);
    const hasExceededAvailability = adultExceeded || childrenExceeded;
    const availabilityError = adultExceeded && childrenExceeded
        ? 'You\'ve exceeded the available adult and children tickets.'
        : adultExceeded
            ? 'You\'ve exceeded the available adult tickets.'
            : 'You\'ve exceeded the available children tickets.';

    const handleOptionKeyDown = (event: KeyboardEvent<HTMLLIElement>, option: number, ticketType: TicketTypeValue) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            optionHandlers[ticketType](option);
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
                {hasExceededAvailability && (
                    <div className={styles.error} id="ticket-selection-error" role="alert">
                        {availabilityError} Please reduce your selection to continue.
                    </div>
                )}
                <div
                  className={styles.adult}
                  data-testid="ticket-type-adult"
                  data-available={showtime.adult_available}
                  role="group"
                  aria-labelledby="adult-ticket-label"
                >
                    <div className={styles.description}>
                        <div className={styles.name} id="adult-ticket-label">Adult</div>
                        <div className={styles.price}>${showtime.adult_price} each</div>
                        <div className={styles.available} id="adult-ticket-availability" data-testid="adult-available">
                            {showtime.adult_available} available
                        </div>
                    </div>
                    <button
                    type="button"
                    className={styles.dropdownButton}
                    data-testid="adult-dropdown-button"
                    aria-label={`Select adult ticket quantity${adultExceeded ? '. Selection exceeds availability' : ''}`}
                    aria-expanded={adultIsOpen}
                    aria-controls="adult-ticket-options"
                    aria-describedby={`adult-ticket-availability${hasExceededAvailability ? ' ticket-selection-error' : ''}`}
                    onClick={() => setAdultIsOpen(!adultIsOpen)}
                    >
                        {adultCount}
                        <span className={`${styles.arrow} ${adultIsOpen ? styles.open  : ''}`}>▼</span>
                    </button>
                    {adultIsOpen && (
                        <ul className={styles.dropdown} id="adult-ticket-options" role="listbox" aria-label="Adult ticket quantities" data-testid="adult-dropdown-list">
                        {[...Array(21)].map((_, index) => (
                                <li 
                                key={index} 
                                className={styles.dropdownList}
                                role="option"
                                aria-selected={adultCount === index}
                                tabIndex={0}
                                onKeyDown={(event) => handleOptionKeyDown(event, index, TicketType.Adult)}
                                onClick={() => handleAdultOptionClick(index)}>
                                    {index}
                                </li>
                            ))} 
                        </ul>
                    )}
                </div>

                <div
                  className={styles.children}
                  data-testid="ticket-type-children"
                  data-available={showtime.children_available}
                  role="group"
                  aria-labelledby="children-ticket-label"
                >
                <div className={styles.description}>
                    <div className={styles.name} id="children-ticket-label">Children</div>
                        <div className={styles.price}>${showtime.children_price} each</div>
                    <div className={styles.available} id="children-ticket-availability" data-testid="children-available">
                            {showtime.children_available} available
                        </div>
                    </div>
                    <button
                    type="button"
                    className={styles.dropdownButton}
                    data-testid="children-dropdown-button"
                    aria-label={`Select children ticket quantity${childrenExceeded ? '. Selection exceeds availability' : ''}`}
                    aria-expanded={childrenIsOpen}
                    aria-controls="children-ticket-options"
                    aria-describedby={`children-ticket-availability${hasExceededAvailability ? ' ticket-selection-error' : ''}`}
                    onClick={() => setChildrenIsOpen(!childrenIsOpen)}
                    >
                        {childrenCount}
                        <span className={`${styles.arrow} ${childrenIsOpen ? styles.open : ''}`}>▼</span>
                    </button>
                    {childrenIsOpen && (
                        <ul className={styles.dropdown} id="children-ticket-options" role="listbox" aria-label="Children ticket quantities" data-testid="children-dropdown-list">
                        {[...Array(21)].map((_, index) => (
                                <li 
                                key={index} 
                                className={styles.dropdownList}
                                role="option"
                                aria-selected={childrenCount === index}
                                tabIndex={0}
                                onKeyDown={(event) => handleOptionKeyDown(event, index, TicketType.Children)}
                                onClick={() => handleChildrenOptionClick(index)}>
                                    {index}
                                </li>
                            ))} 
                        </ul>
                    )}
                </div>
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
                      type="button"
                      onClick={() => handleSelect('continue')}
                      aria-disabled={hasExceededAvailability || (adultCount === 0 && childrenCount === 0)}
                      className={`${styles.continueButton} ${(hasExceededAvailability || (adultCount === 0 && childrenCount === 0) ? styles.disable : '' )} `}>
                        Continue
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleSelect('back')} 
                      className={styles.backButton}>
                        Back
                    </button>
                </div>
            </div>

        </div>
    )
};