import PaymentForm from "@/components/PaymentForm";
import { PaymentSearchParams } from "@/typescript/movieData";


export default async function PaymentInformation({searchParams}: {searchParams: Promise<PaymentSearchParams>}) {
    const stackParam = await searchParams;

    return (
        <div>
            <PaymentForm props={stackParam} />
        </div>
    )
};