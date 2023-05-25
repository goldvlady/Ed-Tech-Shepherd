import React, { FormEvent, useEffect, useState } from "react";
import {
    PaymentElement,
    useStripe,
    useElements
} from "@stripe/react-stripe-js";
import { Alert, AlertIcon, Box, Button, createStandaloneToast, Spinner } from "@chakra-ui/react";

const { toast } = createStandaloneToast();

type Props = {
    clientSecret: string;
    returnUrl: string;
    checkPaymentIntentStatus?: boolean;
}

const StripeCheckoutForm: React.FC<Props> = ({ clientSecret, returnUrl, checkPaymentIntentStatus = false }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [message, setMessage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!checkPaymentIntentStatus) {
            return;
        }

        if (!stripe || !clientSecret) {
            return;
        }

        stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
            console.log(paymentIntent);
            
            switch (paymentIntent?.status) {
                case "succeeded":
                    toast({
                        title: 'Payment successful!',
                        status: 'success',
                        position: 'top',
                        isClosable: true
                    })
                    break;
                case "processing":
                    toast({
                        title: 'Your payment is processing.',
                        status: 'loading',
                        position: 'top',
                        isClosable: true
                    })
                    break;
                case "requires_payment_method":
                    toast({
                        title: 'Your payment was not successful, please try again.',
                        status: 'error',
                        position: 'top',
                        isClosable: true
                    })
                    break;
                default:
                    toast({
                        title: 'Something went wrong.',
                        status: 'error',
                        position: 'top',
                        isClosable: true
                    })
                    break;
            }
        });
    }, [stripe, clientSecret]);

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setMessage("");

        setIsLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Make sure to change this to your payment completion page
                return_url: returnUrl
            },
        });

        setMessage(error.message || "An unexpected error occurred.");
        setIsLoading(false);
    };

    return checkPaymentIntentStatus === false ? <form id="payment-form" onSubmit={handleSubmit}>
            {!stripe || !elements ? <Spinner /> : <>
                {!!message && <Box mb={4}>
                    <Alert status='error'>
                        <AlertIcon />
                        {message}
                    </Alert>
                </Box>}
                <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
                <Box mt={5} pb={4}>
                    <Button type="submit" width={"100%"} variant={"solid"} isLoading={isLoading} isDisabled={isLoading || !stripe || !elements} id="submit">Pay now</Button>
                </Box>
            </>}
        </form> : <></>
}

export default StripeCheckoutForm;