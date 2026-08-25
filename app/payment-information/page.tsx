import PaymentForm from "@/components/PaymentForm";
import { PaymentSearchParams } from "@/typescript/movieData";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Payment Information",
};

export default async function PaymentInformation({searchParams}: {searchParams: Promise<PaymentSearchParams>}) {
    const stackParam = await searchParams;

    return (
        <div>
            <PaymentForm props={stackParam} />
        </div>
    )
};