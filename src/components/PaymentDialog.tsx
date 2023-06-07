import * as React from "react";
import styled from "styled-components";
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Schedule } from "../types";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import StripeCheckoutForm from "./StripeCheckoutForm";

export interface PaymentDialogRef {
  startPayment: (paymentIntentClientSecret: string, returnUrl: string) => void;
}

interface Props {
  prefix?: React.ReactNode;
}

const Root = styled(Box)`
  #payment-form {
    width: 100%;
  }
`;

const stripePromise = loadStripe(
  process.env.REACT_APP_STRIPE_PUBLIC_KEY as string
);

const PaymentDialog = React.forwardRef<PaymentDialogRef, Props>(
  ({ prefix }, ref) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const promiseResolve = useRef<
      ((value: Schedule[] | PromiseLike<Schedule[]>) => void) | null
    >(null);
    const promiseReject = useRef<
      ((value: Schedule[] | PromiseLike<Schedule[]>) => void) | null
    >(null);

    const [returnUrl, setReturnUrl] = useState<string | null>(null);
    const [paymentIntentClientSecret, setPaymentIntentClientSecret] = useState<
      string | null
    >(null);

    React.useImperativeHandle(ref, () => {
      return {
        startPayment: async (paymentIntentClientSecret, returnUrl) => {
          onOpen();
          setReturnUrl(returnUrl);
          setPaymentIntentClientSecret(paymentIntentClientSecret);

          return new Promise<Schedule[]>((resolve, reject) => {
            promiseResolve.current = resolve;
            promiseReject.current = reject;
          });
        },
      };
    });

    return (
      <Root>
        <Modal
          isOpen={isOpen}
          onClose={() => {
            onClose();
          }}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Add a payment method</ModalHeader>
            <ModalCloseButton />
            <ModalBody flexDirection={"column"}>
              {prefix}
              {!!paymentIntentClientSecret && (
                <Elements
                  options={{
                    clientSecret: paymentIntentClientSecret,
                    appearance: { theme: "stripe" },
                  }}
                  stripe={stripePromise}
                >
                  <StripeCheckoutForm
                    clientSecret={paymentIntentClientSecret}
                    returnUrl={returnUrl || ""}
                  />
                </Elements>
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </Root>
    );
  }
);

export default PaymentDialog;
