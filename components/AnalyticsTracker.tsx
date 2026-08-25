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

        lastTrackedPath.current = pathname;
        pushAnalyticsEvent({
            event: AnalyticsEvent.PageView,
            page_path: pathname,
            page_title: document.title,
        });
    }, [pathname]);

    return null;
}
