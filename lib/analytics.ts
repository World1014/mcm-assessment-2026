export type AnalyticsItem = {
    item_id: string;
    item_name: string;
    item_variant?: string;
    item_category?: string;
    price?: number;
    quantity: number;
};

export enum AnalyticsEvent {
    PageView = 'page_view',
    ViewItemList = 'view_item_list',
    SelectItem = 'select_item',
    TicketQuantitySelected = 'ticket_quantity_selected',
    BeginCheckout = 'begin_checkout',
    AddPaymentInfo = 'add_payment_info',
    Purchase = 'purchase',
}

export type AnalyticsEcommerce = {
    value?: number;
    items?: AnalyticsItem[];
    item_list_name?: string;
    transaction_id?: string;
};

type MonetizedEcommerce = AnalyticsEcommerce & {
    currency: 'USD';
};

export type AnalyticsPayload =
    | { event: AnalyticsEvent.PageView; page_path: string; page_title: string }
    | { event: AnalyticsEvent.ViewItemList; ecommerce: AnalyticsEcommerce & { items: AnalyticsItem[]; item_list_name: string } }
    | { event: AnalyticsEvent.SelectItem; ecommerce: AnalyticsEcommerce & { items: AnalyticsItem[]; item_list_name: string } }
    | { event: AnalyticsEvent.TicketQuantitySelected; ticket_type: string; quantity: number }
    | { event: AnalyticsEvent.BeginCheckout; ecommerce: MonetizedEcommerce & { items: AnalyticsItem[]; value: number } }
    | { event: AnalyticsEvent.AddPaymentInfo; ecommerce: MonetizedEcommerce & { value: number } }
    | { event: AnalyticsEvent.Purchase; ecommerce: MonetizedEcommerce & { transaction_id: string; items: AnalyticsItem[]; value: number } };

export type PurchaseEventInput = {
    transactionId: string;
    movieTitle: string;
    showtime: string;
    theaterName: string;
    adultPrice: number;
    adultQuantity: number;
    childrenPrice: number;
    childrenQuantity: number;
    totalValue: number;
};

declare global {
    interface Window {
        dataLayer: AnalyticsPayload[];
    }
}

export function pushAnalyticsEvent(payload: AnalyticsPayload): void {
    if (typeof window === 'undefined') {
        return;
    }

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
}

export function pushAnalyticsEventOnce(payload: AnalyticsPayload, storageKey: string): void {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        if (window.localStorage.getItem(storageKey)) {
            return;
        }

        window.localStorage.setItem(storageKey, 'sent');
    } catch {
        // Analytics should never block the booking flow when storage is unavailable.
    }

    pushAnalyticsEvent(payload);
}

export function getSearchParamValue(value: string | string[] | undefined): string {
    return Array.isArray(value) ? value[0] || '' : value || '';
}

export function getTicketItems({
    movieTitle,
    showtime,
    theaterName,
    adultPrice,
    adultQuantity,
    childrenPrice,
    childrenQuantity,
}: {
    movieTitle: string;
    showtime: string;
    theaterName: string;
    adultPrice: number;
    adultQuantity: number;
    childrenPrice: number;
    childrenQuantity: number;
}): AnalyticsItem[] {
    const items: AnalyticsItem[] = [];

    if (adultQuantity > 0) {
        items.push({
            item_id: 'adult-ticket',
            item_name: movieTitle,
            item_variant: showtime,
            item_category: theaterName,
            price: adultPrice,
            quantity: adultQuantity,
        });
    }

    if (childrenQuantity > 0) {
        items.push({
            item_id: 'children-ticket',
            item_name: movieTitle,
            item_variant: showtime,
            item_category: theaterName,
            price: childrenPrice,
            quantity: childrenQuantity,
        });
    }

    return items;
}

export function getShowtimeItems(theaters: Array<{
    name: string;
    movies: Array<{
        title: string;
        showtimes: Array<{
            id: number;
            showtime: string;
            adult_price: number;
        }>;
    }>;
}>): AnalyticsItem[] {
    return theaters.flatMap((theater) => theater.movies.flatMap((movie) => movie.showtimes.map((showtime) => ({
        item_id: String(showtime.id),
        item_name: movie.title,
        item_variant: showtime.showtime,
        item_category: theater.name,
        price: Number(showtime.adult_price),
        quantity: 1,
    }))));
}

export function createPurchaseEvent({
    transactionId,
    movieTitle,
    showtime,
    theaterName,
    adultPrice,
    adultQuantity,
    childrenPrice,
    childrenQuantity,
    totalValue,
}: PurchaseEventInput): AnalyticsPayload {
    return {
        event: AnalyticsEvent.Purchase,
        ecommerce: {
            transaction_id: transactionId,
            currency: 'USD',
            value: totalValue,
            items: getTicketItems({
                movieTitle,
                showtime,
                theaterName,
                adultPrice,
                adultQuantity,
                childrenPrice,
                childrenQuantity,
            }),
        },
    };
}
