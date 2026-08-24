import PaymentForm from "@/components/PaymentForm";


export default async function PaymentInformation({searchParams}: {searchParams: any}) {
    const stackParam = await searchParams;

    return (
        <div>
            <PaymentForm props={stackParam} />
        </div>
    )
};