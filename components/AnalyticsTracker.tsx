'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AnalyticsEvent, pushAnalyticsEvent } from '@/lib/analytics';

export default function AnalyticsTracker() {
    const pathname = usePathname();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
    if (!pathname || lastTrackedPath.current === pathname) {
        return;
    }

    let observer: MutationObserver | null = null;

    const trackPageView = () => {
        const pageTitle = document.title;

        if (!pageTitle) {
            return false;
        }

        lastTrackedPath.current = pathname;

        pushAnalyticsEvent({
            event: AnalyticsEvent.PageView,
            page_path: pathname,
            page_title: pageTitle,
        });

        return true;
    };

    const frame = requestAnimationFrame(() => {
        if (trackPageView()) {
            return;
        }

        observer = new MutationObserver(() => {
            if (trackPageView()) {
                observer?.disconnect();
            }
        });

        observer.observe(document.head, {
            childList: true,
            subtree: true,
            characterData: true,
        });
    });

    return () => {
        cancelAnimationFrame(frame);
        observer?.disconnect();
    };
}, [pathname]);

    return null;
}
